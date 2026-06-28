/* SYNAPSE — game logic
 * Two modes:
 *   shout   - question shows, mic listens, first correct answer scores
 *   explain - each player gets 15s to explain, the judge picks the most accurate
 * No external AI required: the judge is a local keyword/overlap heuristic.
 */

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const state = {
  players: [],
  mode: "shout",
  catId: null,
  duration: 15,
  queue: [],          // shuffled question indices for the chosen category
  qIndex: 0,
  current: null,      // current question object
  // explain-mode round data
  turn: 0,
  transcripts: {},    // playerName -> transcript
};

/* ---------------- speech ---------------- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const speechSupported = !!SR;
let recog = null;
let recogActive = false;

function startRecog(onResult, opts = {}) {
  if (!SR) return false;
  stopRecog();
  recog = new SR();
  recog.lang = "en-US";
  recog.continuous = opts.continuous ?? true;
  recog.interimResults = true;
  recog.maxAlternatives = 3;
  let finalText = "";
  recog.onresult = (e) => {
    let interim = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const res = e.results[i];
      const txt = res[0].transcript;
      if (res.isFinal) finalText += " " + txt;
      else interim += " " + txt;
      // feed all alternatives for matching
      onResult({ interim: interim.trim(), final: finalText.trim(), alts: Array.from(res).map(r => r.transcript), isFinal: res.isFinal });
    }
  };
  recog.onerror = (e) => { /* ignore no-speech / aborted */ };
  recog.onend = () => {
    recogActive = false;
    if (opts.keepAlive && opts.keepAlive()) {
      try { recog.start(); recogActive = true; } catch (_) {}
    }
  };
  try { recog.start(); recogActive = true; return true; } catch (_) { return false; }
}
function stopRecog() {
  if (recog) { try { recog.onend = null; recog.stop(); } catch (_) {} }
  recogActive = false;
}

/* ---------------- judge (no AI needed) ---------------- */
function normalize(s) {
  return (s || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}
// Shout mode: does the spoken text contain an accepted keyword?
function matchesAccept(text, accept) {
  const t = " " + normalize(text) + " ";
  return accept.some(kw => t.includes(" " + normalize(kw) + " ") || t.includes(normalize(kw)));
}
// Explain mode: score a transcript against the question's key concepts.
function scoreExplanation(text, q) {
  const t = normalize(text);
  if (!t) return { score: 0, hits: [], words: 0 };
  const words = t.split(" ").filter(Boolean);
  const hits = [];
  for (const k of q.key) {
    const nk = normalize(k);
    if (t.includes(nk)) hits.push(k);
  }
  // base: concept coverage; small bonus for effort (saying more), capped
  const coverage = hits.length / q.key.length;
  const effort = Math.min(words.length / 25, 1) * 0.2;
  const score = Math.min(1, coverage + effort);
  return { score, hits, words: words.length };
}

/* ---------------- screens ---------------- */
function show(id) {
  $$(".screen").forEach(s => s.classList.remove("active"));
  $("#" + id).classList.add("active");
  window.scrollTo(0, 0);
}

/* ---------------- setup ---------------- */
function renderPlayers() {
  const wrap = $("#player-list");
  wrap.innerHTML = "";
  state.players.forEach((p, i) => {
    const chip = document.createElement("div");
    chip.className = "player-chip";
    chip.innerHTML = `<span class="dot"></span><span class="nm">${p.name}</span><button class="x" data-i="${i}">×</button>`;
    wrap.appendChild(chip);
  });
  $$("#player-list .x").forEach(b => b.onclick = () => {
    state.players.splice(+b.dataset.i, 1);
    renderPlayers();
  });
  $("#start-btn").disabled = state.players.length < 1 || !state.catId;
}

function addPlayer(name) {
  name = (name || "").trim();
  if (!name) return;
  if (state.players.length >= 8) return;
  state.players.push({ name, score: 0 });
  renderPlayers();
}

function renderCategories() {
  const wrap = $("#cat-list");
  wrap.innerHTML = "";
  CATEGORIES.forEach(c => {
    const card = document.createElement("button");
    card.className = "cat-card";
    card.dataset.id = c.id;
    card.innerHTML = `
      <div class="cat-icon">${ICONS[c.icon] || ICONS.bulb}</div>
      <div class="cat-name">${c.name}</div>
      <div class="cat-blurb">${c.blurb}</div>`;
    card.onclick = () => {
      state.catId = c.id;
      $$(".cat-card").forEach(x => x.classList.toggle("sel", x.dataset.id === c.id));
      renderPlayers();
    };
    wrap.appendChild(card);
  });
}

function setMode(m) {
  state.mode = m;
  $$(".mode-card").forEach(x => x.classList.toggle("sel", x.dataset.mode === m));
  $("#duration-row").style.display = m === "explain" ? "flex" : "none";
}

/* ---------------- gameplay ---------------- */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startGame() {
  state.players.forEach(p => p.score = 0);
  const cat = CATEGORIES.find(c => c.id === state.catId);
  state.queue = shuffle(cat.questions.map((_, i) => i));
  state.qIndex = 0;
  show("screen-play");
  nextQuestion();
}

function nextQuestion() {
  stopRecog();
  if (state.qIndex >= state.queue.length) return endGame();
  const cat = CATEGORIES.find(c => c.id === state.catId);
  state.current = cat.questions[state.queue[state.qIndex]];
  state.transcripts = {};
  state.turn = 0;
  SYNAPSE_NEURONS.setIntensity(1);

  $("#q-progress").textContent = `Q${state.qIndex + 1} / ${state.queue.length}`;
  $("#q-cat").textContent = cat.name;
  $("#q-text").textContent = state.current.q;
  renderScoreStrip();

  if (state.mode === "shout") setupShout();
  else setupExplain();
}

function renderScoreStrip() {
  const strip = $("#score-strip");
  strip.innerHTML = state.players
    .slice()
    .map(p => `<div class="sc"><span class="sc-n">${p.name}</span><span class="sc-v">${p.score}</span></div>`)
    .join("");
}

/* ---- SHOUT MODE ---- */
function setupShout() {
  $("#play-shout").style.display = "block";
  $("#play-explain").style.display = "none";
  $("#reveal-box").classList.remove("show");
  const live = $("#shout-live");
  live.textContent = "";
  const status = $("#shout-status");
  status.textContent = speechSupported ? "Tap the mic, then shout your answer" : "Mic not supported here — tap who got it";
  $("#shout-mic").classList.remove("listening");
  $("#shout-correct").classList.remove("show");

  let listening = false;
  let solved = false;

  $("#shout-mic").onclick = () => {
    if (!speechSupported) return;
    if (listening) {
      listening = false;
      stopRecog();
      $("#shout-mic").classList.remove("listening");
      status.textContent = "Paused — tap to listen again";
      SYNAPSE_NEURONS.setIntensity(1);
      return;
    }
    listening = true;
    solved = false;
    $("#shout-mic").classList.add("listening");
    status.textContent = "Listening… shout it!";
    SYNAPSE_NEURONS.setIntensity(1.8);
    startRecog((r) => {
      live.textContent = r.interim || r.final;
      const pool = [r.final, r.interim, ...(r.alts || [])].join(" ");
      if (!solved && matchesAccept(pool, state.current.accept)) {
        solved = true;
        listening = false;
        stopRecog();
        $("#shout-mic").classList.remove("listening");
        onShoutCorrect();
      }
    }, { continuous: true, keepAlive: () => listening });
  };

  // manual award (works without mic / for the host)
  $("#shout-claim").onclick = () => onShoutCorrect();
  $("#shout-nobody").onclick = () => revealMiss();
}

function onShoutCorrect() {
  SYNAPSE_NEURONS.burst(18);
  SYNAPSE_NEURONS.setIntensity(2);
  $("#shout-correct").classList.add("show");
  $("#shout-status").textContent = "Correct! Who shouted it first?";
  // build award buttons
  const wrap = $("#shout-award");
  wrap.innerHTML = "";
  state.players.forEach((p, i) => {
    const b = document.createElement("button");
    b.className = "award-btn";
    b.textContent = p.name;
    b.onclick = () => {
      p.score += 1;
      renderScoreStrip();
      advanceWithReveal(false, p.name);
    };
    wrap.appendChild(b);
  });
}

/* ---- EXPLAIN MODE ---- */
function setupExplain() {
  $("#play-shout").style.display = "none";
  $("#play-explain").style.display = "block";
  $("#reveal-box").classList.remove("show");
  $("#explain-results").classList.remove("show");
  $("#explain-results").innerHTML = "";
  runExplainTurn();
}

function runExplainTurn() {
  if (state.turn >= state.players.length) return judgeExplain();
  const p = state.players[state.turn];
  const stage = $("#explain-stage");
  stage.innerHTML = `
    <div class="turn-name">${p.name}<span class="turn-of">'s turn</span></div>
    <div class="turn-sub">Explain your answer out loud</div>
    <div class="timer-ring" id="timer-ring">
      <svg viewBox="0 0 120 120"><circle class="ring-bg" cx="60" cy="60" r="52"/><circle class="ring-fg" id="ring-fg" cx="60" cy="60" r="52"/></svg>
      <div class="timer-num" id="timer-num">${state.duration}</div>
    </div>
    <div class="explain-live" id="explain-live"></div>
    <div class="row center">
      <button class="btn primary" id="explain-go">Start ${p.name}'s ${state.duration}s</button>
      <button class="btn ghost" id="explain-skip">Skip / no answer</button>
    </div>`;

  const live = $("#explain-live");
  const num = $("#timer-num");
  const ring = $("#ring-fg");
  const circ = 2 * Math.PI * 52;
  ring.style.strokeDasharray = circ;
  ring.style.strokeDashoffset = 0;

  let timer = null;
  let captured = "";

  $("#explain-skip").onclick = () => {
    stopRecog(); clearInterval(timer);
    state.transcripts[p.name] = "";
    state.turn++;
    runExplainTurn();
  };

  $("#explain-go").onclick = () => {
    $("#explain-go").disabled = true;
    $("#explain-go").textContent = "Go!";
    SYNAPSE_NEURONS.setIntensity(1.8);
    let left = state.duration;
    num.textContent = left;
    if (speechSupported) {
      startRecog((r) => {
        captured = (r.final + " " + r.interim).trim();
        live.textContent = captured;
      }, { continuous: true, keepAlive: () => left > 0 });
    } else {
      live.innerHTML = `<textarea id="manual-explain" placeholder="(mic unavailable) type the gist…"></textarea>`;
    }
    timer = setInterval(() => {
      left--;
      num.textContent = Math.max(left, 0);
      ring.style.strokeDashoffset = circ * (1 - left / state.duration);
      if (left <= 0) {
        clearInterval(timer);
        stopRecog();
        const manual = $("#manual-explain");
        state.transcripts[p.name] = (manual ? manual.value : captured) || "";
        SYNAPSE_NEURONS.setIntensity(1);
        state.turn++;
        runExplainTurn();
      }
    }, 1000);
  };
}

function judgeExplain() {
  const stage = $("#explain-stage");
  stage.innerHTML = `<div class="judging"><div class="judging-dots"><span></span><span></span><span></span></div><div>The judge is deciding…</div></div>`;
  SYNAPSE_NEURONS.burst(10);
  SYNAPSE_NEURONS.setIntensity(2);

  setTimeout(() => {
    const ranked = state.players.map(p => {
      const sc = scoreExplanation(state.transcripts[p.name] || "", state.current);
      return { name: p.name, ...sc };
    }).sort((a, b) => b.score - a.score);

    const best = ranked[0];
    const anyGood = best && best.score >= 0.18;
    if (anyGood) {
      const winner = state.players.find(p => p.name === best.name);
      winner.score += 1;
      renderScoreStrip();
    }

    const box = $("#explain-results");
    box.classList.add("show");
    box.innerHTML = `
      <div class="verdict">${anyGood ? `🧠 <b>${best.name}</b> nailed it best` : "😬 Nobody really got there"}</div>
      <div class="rank-list">
        ${ranked.map((r, i) => `
          <div class="rank-row ${i === 0 && anyGood ? "win" : ""}">
            <span class="rk">${i + 1}</span>
            <span class="rk-name">${r.name}</span>
            <span class="rk-bar"><span style="width:${Math.round(r.score * 100)}%"></span></span>
            <span class="rk-pct">${Math.round(r.score * 100)}%</span>
          </div>`).join("")}
      </div>
      <div class="roast">${anyGood ? pick(PRAISE) : pick(ROASTS)}</div>
      <div class="reveal"><span class="reveal-label">The answer</span>${state.current.answer}</div>
      <div class="row center"><button class="btn primary" id="explain-next">Next question →</button></div>`;
    stage.innerHTML = "";
    $("#explain-next").onclick = () => { state.qIndex++; nextQuestion(); };
  }, 1400);
}

/* ---- reveal / advance shared ---- */
function revealMiss() {
  stopRecog();
  SYNAPSE_NEURONS.setIntensity(0.6);
  advanceWithReveal(true);
}

function advanceWithReveal(missed, winnerName) {
  const box = $("#reveal-box");
  box.classList.add("show");
  box.innerHTML = `
    ${missed
      ? `<div class="roast big">${pick(ROASTS)}</div>`
      : `<div class="praise big">✅ Point to ${winnerName}. ${pick(PRAISE)}</div>`}
    <div class="reveal"><span class="reveal-label">The answer</span>${state.current.answer}</div>
    <div class="row center"><button class="btn primary" id="reveal-next">Next question →</button></div>`;
  $("#play-shout").querySelectorAll("button").forEach(b => { if (!b.closest("#reveal-box")) b.disabled = false; });
  $("#reveal-next").onclick = () => { state.qIndex++; nextQuestion(); };
}

function endGame() {
  stopRecog();
  SYNAPSE_NEURONS.burst(24);
  const ranked = state.players.slice().sort((a, b) => b.score - a.score);
  const top = ranked[0];
  show("screen-end");
  $("#end-podium").innerHTML = ranked.map((p, i) => `
    <div class="podium-row ${i === 0 ? "champ" : ""}">
      <span class="medal">${["🥇", "🥈", "🥉"][i] || "•"}</span>
      <span class="p-name">${p.name}</span>
      <span class="p-score">${p.score}</span>
    </div>`).join("");
  $("#end-title").textContent = top && top.score > 0 ? `${top.name} has the sharpest brain` : "A humbling round for humanity";
  $("#end-sub").textContent = top && top.score > 0
    ? "Phones stayed in pockets. Neurons did the work."
    : "Maybe read a manual sometime.";
}

/* ---------------- helpers ---------------- */
function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }

/* ---------------- icons (thin line art) ---------------- */
const ICONS = {
  compass: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><polygon points="15,9 11,11 9,15 13,13"/></svg>`,
  wrench: `<svg viewBox="0 0 24 24"><path d="M14 7a4 4 0 0 0-5 5l-5 5 2 2 5-5a4 4 0 0 0 5-5l-2 2-2-2 2-2z"/></svg>`,
  coin: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 8v8M9.5 10a2.5 2 0 0 1 5 0c0 2-5 1-5 3a2.5 2 0 0 0 5 0"/></svg>`,
  heart: `<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.5-7-9a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 4.5-7 9-7 9z"/><path d="M6 12h3l1.5-3 2 5 1.5-2H18"/></svg>`,
  flame: `<svg viewBox="0 0 24 24"><path d="M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 2-4 0 1 1 2 2 2 0-2-2-3 0-6z"/></svg>`,
  bulb: `<svg viewBox="0 0 24 24"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 1 4 10c-1 1-1 1-1 3H9c0-2 0-2-1-3a6 6 0 0 1 4-10z"/></svg>`
};

/* ---------------- wire up ---------------- */
function init() {
  renderCategories();
  renderPlayers();
  setMode("shout");

  $("#begin-btn").onclick = () => show("screen-setup");
  $("#how-btn").onclick = () => $("#how-modal").classList.add("show");
  $("#how-close").onclick = () => $("#how-modal").classList.remove("show");

  $("#add-player-btn").onclick = () => { addPlayer($("#player-input").value); $("#player-input").value = ""; $("#player-input").focus(); };
  $("#player-input").addEventListener("keydown", (e) => { if (e.key === "Enter") $("#add-player-btn").click(); });

  $$(".mode-card").forEach(c => c.onclick = () => setMode(c.dataset.mode));
  $$("#duration-row .seg").forEach(s => s.onclick = () => {
    state.duration = +s.dataset.sec;
    $$("#duration-row .seg").forEach(x => x.classList.toggle("sel", x === s));
  });

  $("#start-btn").onclick = startGame;
  $("#back-home").onclick = () => { stopRecog(); show("screen-home"); };
  $("#quit-btn").onclick = () => { stopRecog(); show("screen-home"); };
  $("#again-btn").onclick = () => show("screen-setup");
  $("#end-home").onclick = () => show("screen-home");

  if (!speechSupported) $("#mic-note").style.display = "block";
}

document.addEventListener("DOMContentLoaded", init);

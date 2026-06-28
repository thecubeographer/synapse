/* SYNAPSE — game logic
 * Shout It  : question shows, mic listens, first correct shout scores.
 * Explain It: each player gets a timer to explain; the judge ranks accuracy.
 *
 * The judge runs locally by default (keyword/overlap heuristic). When CONFIG.ai
 * is enabled it asks your Claude proxy instead and falls back on any error — so
 * the game always works. See config.js / SERVER_NOTES.md.
 */

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const state = {
  players: [],
  mode: "shout",
  catId: null,
  duration: 15,
  queue: [],
  qIndex: 0,
  current: null,
  turn: 0,
  transcripts: {},
};

/* ---------------- speech ---------------- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const speechSupported = !!SR;
let recog = null;

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
      if (res.isFinal) finalText += " " + res[0].transcript;
      else interim += " " + res[0].transcript;
      onResult({ interim: interim.trim(), final: finalText.trim(), alts: Array.from(res).map(r => r.transcript), isFinal: res.isFinal });
    }
  };
  recog.onerror = () => {};
  recog.onend = () => {
    if (opts.keepAlive && opts.keepAlive()) { try { recog.start(); } catch (_) {} }
  };
  try { recog.start(); return true; } catch (_) { return false; }
}
function stopRecog() { if (recog) { try { recog.onend = null; recog.stop(); } catch (_) {} } }

/* ---------------- judging ---------------- */
function normalize(s) { return (s || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim(); }

function matchesAccept(text, accept) {
  const t = " " + normalize(text) + " ";
  return accept.some(kw => t.includes(normalize(kw)));
}

function scoreExplanation(text, q) {
  const t = normalize(text);
  if (!t) return { score: 0, hits: [] };
  const words = t.split(" ").filter(Boolean);
  const hits = q.key.filter(k => t.includes(normalize(k)));
  const coverage = hits.length / q.key.length;
  const effort = Math.min(words.length / 25, 1) * 0.2;
  return { score: Math.min(1, coverage + effort), hits };
}

// Local judge → uniform result shape, same as the AI judge returns.
function localJudge(transcripts, q) {
  const ranked = state.players.map(p => {
    const { score, hits } = scoreExplanation(transcripts[p.name] || "", q);
    const note = hits.length ? "covered: " + hits.slice(0, 4).join(", ") : "didn't get there";
    return { name: p.name, score, note };
  }).sort((a, b) => b.score - a.score);
  const best = ranked[0];
  const winner = best && best.score >= 0.18 ? best.name : null;
  return {
    ranked, winner,
    verdict: winner ? `${winner} nailed it best` : "Nobody really got there",
    roast: winner ? pick(PRAISE) : pick(ROASTS)
  };
}

// AI judge — POSTs to your proxy. Throws on any failure so we can fall back.
async function aiJudge(transcripts, q) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), CONFIG.ai.timeoutMs);
  try {
    const res = await fetch(CONFIG.ai.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: ctrl.signal,
      body: JSON.stringify({
        question: q.q,
        idealAnswer: q.answer,
        answers: state.players.map(p => ({ name: p.name, text: transcripts[p.name] || "" }))
      })
    });
    if (!res.ok) throw new Error("judge " + res.status);
    const data = await res.json();
    if (!Array.isArray(data.ranked)) throw new Error("bad shape");
    return data;
  } finally { clearTimeout(t); }
}

async function judge(transcripts, q) {
  if (CONFIG?.ai?.enabled) {
    try { return await aiJudge(transcripts, q); }
    catch (e) { console.warn("AI judge failed, using local:", e.message); }
  }
  return localJudge(transcripts, q);
}

// Optional AI verification of a shouted answer (used only if CONFIG.ai.verifyShout).
async function aiCheckShout(said, q) {
  const res = await fetch(CONFIG.ai.shoutEndpoint, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: q.q, idealAnswer: q.answer, said })
  });
  if (!res.ok) throw new Error("check " + res.status);
  return (await res.json()).correct === true;
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
  $$("#player-list .x").forEach(b => b.onclick = () => { state.players.splice(+b.dataset.i, 1); renderPlayers(); });
  $("#start-btn").disabled = state.players.length < 1 || !state.catId;
}

function addPlayer(name) {
  name = (name || "").trim();
  if (!name || state.players.length >= 8) return;
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
    card.innerHTML = `<div class="cat-icon">${ICONS[c.icon] || ICONS.bulb}</div><div class="cat-name">${c.name}</div><div class="cat-blurb">${c.blurb}</div>`;
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
  for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function startGame() {
  state.players.forEach(p => p.score = 0);
  const cat = CATEGORIES.find(c => c.id === state.catId);
  state.queue = shuffle(cat.questions.map((_, i) => i));
  state.qIndex = 0;
  $("#score-strip").classList.remove("show");
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

  $("#q-progress").textContent = `Q${state.qIndex + 1}/${state.queue.length}`;
  $("#q-cat").textContent = cat.name;
  $("#q-text").textContent = state.current.q;
  renderScoreStrip();

  if (state.mode === "shout") setupShout();
  else setupExplain();
}

function renderScoreStrip() {
  $("#score-strip").innerHTML = state.players
    .map(p => `<div class="sc"><span class="sc-n">${p.name}</span><span class="sc-v">${p.score}</span></div>`).join("");
}

/* ---- SHOUT ---- */
function setupShout() {
  $("#play-shout").style.display = "block";
  $("#play-explain").style.display = "none";
  $("#reveal-box").classList.remove("show");
  const live = $("#shout-live"); live.textContent = "";
  const status = $("#shout-status");
  status.textContent = speechSupported ? "Tap to listen, then shout" : "Mic unavailable — tap who got it";
  $("#shout-mic").classList.remove("listening");
  $("#shout-correct").classList.remove("show");
  $("#shout-award").innerHTML = "";
  $$("#play-shout button").forEach(b => b.disabled = false);

  let listening = false, solved = false;

  $("#shout-mic").onclick = () => {
    if (!speechSupported) return;
    if (listening) {
      listening = false; stopRecog();
      $("#shout-mic").classList.remove("listening");
      status.textContent = "Paused — tap to listen again";
      SYNAPSE_NEURONS.setIntensity(1);
      return;
    }
    listening = true; solved = false;
    $("#shout-mic").classList.add("listening");
    status.textContent = "Listening…";
    SYNAPSE_NEURONS.setIntensity(2);
    startRecog((r) => {
      live.textContent = r.interim || r.final;
      const pool = [r.final, r.interim, ...(r.alts || [])].join(" ");
      if (!solved && matchesAccept(pool, state.current.accept)) {
        solved = true; listening = false; stopRecog();
        $("#shout-mic").classList.remove("listening");
        onShoutCorrect();
      }
    }, { continuous: true, keepAlive: () => listening });
  };

  $("#shout-claim").onclick = () => onShoutCorrect();
  $("#shout-nobody").onclick = () => revealMiss();
}

function onShoutCorrect() {
  SYNAPSE_NEURONS.burst(10);
  $("#shout-correct").classList.add("show");
  $("#shout-status").textContent = "Who shouted it first?";
  const wrap = $("#shout-award"); wrap.innerHTML = "";
  state.players.forEach(p => {
    const b = document.createElement("button");
    b.className = "award-btn"; b.textContent = p.name;
    b.onclick = () => { p.score += 1; renderScoreStrip(); advanceWithReveal(false, p.name); };
    wrap.appendChild(b);
  });
}

/* ---- EXPLAIN ---- */
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
  $("#explain-stage").innerHTML = `
    <div class="turn-name">${p.name}<span class="turn-of"> — your turn</span></div>
    <div class="turn-sub">Explain your answer out loud</div>
    <div class="timer-ring">
      <svg viewBox="0 0 120 120"><circle class="ring-bg" cx="60" cy="60" r="54"/><circle class="ring-fg" id="ring-fg" cx="60" cy="60" r="54"/></svg>
      <div class="timer-num" id="timer-num">${state.duration}</div>
    </div>
    <div class="explain-live" id="explain-live"></div>
    <div class="row center">
      <button class="btn primary" id="explain-go">Start ${state.duration}s</button>
      <button class="btn link" id="explain-skip">Skip</button>
    </div>`;

  const live = $("#explain-live"), num = $("#timer-num"), ring = $("#ring-fg");
  const circ = 2 * Math.PI * 54;
  ring.style.strokeDasharray = circ; ring.style.strokeDashoffset = 0;
  let timer = null, captured = "";

  $("#explain-skip").onclick = () => {
    stopRecog(); clearInterval(timer);
    state.transcripts[p.name] = ""; state.turn++; runExplainTurn();
  };

  $("#explain-go").onclick = () => {
    $("#explain-go").disabled = true; $("#explain-go").textContent = "Go";
    SYNAPSE_NEURONS.setIntensity(2);
    let left = state.duration; num.textContent = left;
    if (speechSupported) {
      startRecog((r) => { captured = (r.final + " " + r.interim).trim(); live.textContent = captured; }, { continuous: true, keepAlive: () => left > 0 });
    } else {
      live.innerHTML = `<textarea id="manual-explain" placeholder="(mic unavailable) type the gist…"></textarea>`;
    }
    timer = setInterval(() => {
      left--; num.textContent = Math.max(left, 0);
      ring.style.strokeDashoffset = circ * (1 - left / state.duration);
      if (left <= 0) {
        clearInterval(timer); stopRecog();
        const manual = $("#manual-explain");
        state.transcripts[p.name] = (manual ? manual.value : captured) || "";
        SYNAPSE_NEURONS.setIntensity(1); state.turn++; runExplainTurn();
      }
    }, 1000);
  };
}

async function judgeExplain() {
  $("#explain-stage").innerHTML = `<div class="judging"><div class="judging-dots"><span></span><span></span><span></span></div><div>${CONFIG?.ai?.enabled ? "Claude is judging…" : "Judging accuracy…"}</div></div>`;
  SYNAPSE_NEURONS.setIntensity(2);

  const result = await judge(state.transcripts, state.current);
  if (result.winner) {
    const w = state.players.find(p => p.name === result.winner);
    if (w) { w.score += 1; renderScoreStrip(); SYNAPSE_NEURONS.burst(10); }
  }

  const box = $("#explain-results");
  box.classList.add("show");
  box.innerHTML = `
    <div class="verdict">${result.verdict}</div>
    <div class="rank-list">
      ${result.ranked.map((r, i) => `
        <div class="rank-row ${i === 0 && result.winner ? "win" : ""}">
          <span class="rk">${i + 1}</span>
          <span class="rk-name">${r.name}</span>
          <span class="rk-bar"><span style="width:${Math.round((r.score || 0) * 100)}%"></span></span>
          <span class="rk-pct">${Math.round((r.score || 0) * 100)}%</span>
        </div>
        ${r.note ? `<div class="rk-note">${r.note}</div>` : ""}`).join("")}
    </div>
    <div class="${result.winner ? "praise" : "roast"}">${result.roast}</div>
    <div class="reveal"><span class="reveal-label">The answer</span>${state.current.answer}</div>
    <div class="row center"><button class="btn primary" id="explain-next">Next →</button></div>`;
  $("#explain-stage").innerHTML = "";
  $("#explain-next").onclick = () => { state.qIndex++; nextQuestion(); };
}

/* ---- reveal / advance ---- */
function revealMiss() { stopRecog(); SYNAPSE_NEURONS.setIntensity(0.6); advanceWithReveal(true); }

function advanceWithReveal(missed, winnerName) {
  const box = $("#reveal-box");
  box.classList.add("show");
  box.innerHTML = `
    ${missed ? `<div class="roast big">${pick(ROASTS)}</div>` : `<div class="praise big">Point to ${winnerName} — ${pick(PRAISE)}</div>`}
    <div class="reveal"><span class="reveal-label">The answer</span>${state.current.answer}</div>
    <div class="row center"><button class="btn primary" id="reveal-next">Next →</button></div>`;
  $$("#play-shout button").forEach(b => { if (!b.closest("#reveal-box")) b.disabled = true; });
  $("#reveal-next").onclick = () => { state.qIndex++; nextQuestion(); };
}

function endGame() {
  stopRecog();
  SYNAPSE_NEURONS.burst(12);
  const ranked = state.players.slice().sort((a, b) => b.score - a.score);
  const top = ranked[0];
  show("screen-end");
  $("#end-podium").innerHTML = ranked.map((p, i) => `
    <div class="podium-row ${i === 0 ? "champ" : ""}">
      <span class="medal">${i + 1}</span><span class="p-name">${p.name}</span><span class="p-score">${p.score}</span>
    </div>`).join("");
  $("#end-title").textContent = top && top.score > 0 ? `${top.name} has the sharpest brain` : "A humbling round for humanity";
  $("#end-sub").textContent = top && top.score > 0 ? "Phones stayed in pockets." : "Maybe read a manual sometime.";
}

/* ---------------- helpers ---------------- */
function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }

/* ---------------- thin line-art icons ---------------- */
const ICONS = {
  compass: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><polygon points="15,9 11,11 9,15 13,13"/></svg>`,
  wrench: `<svg viewBox="0 0 24 24"><path d="M14 7a4 4 0 0 0-5 5l-5 5 2 2 5-5a4 4 0 0 0 5-5l-2 2-2-2 2-2z"/></svg>`,
  coin: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 8v8M9.5 10a2.5 2 0 0 1 5 0c0 2-5 1-5 3a2.5 2 0 0 0 5 0"/></svg>`,
  heart: `<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.5-7-9a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 4.5-7 9-7 9z"/><path d="M6 12h3l1.5-3 2 5 1.5-2H18"/></svg>`,
  flame: `<svg viewBox="0 0 24 24"><path d="M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 2-4 0 1 1 2 2 2 0-2-2-3 0-6z"/></svg>`,
  bulb: `<svg viewBox="0 0 24 24"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 1 4 10c-1 1-1 1-1 3H9c0-2 0-2-1-3a6 6 0 0 1 4-10z"/></svg>`,
  doc: `<svg viewBox="0 0 24 24"><path d="M7 3h7l4 4v14H7zM14 3v4h4M9 12h6M9 16h6"/></svg>`
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
  $("#score-toggle").onclick = () => $("#score-strip").classList.toggle("show");
  $("#again-btn").onclick = () => show("screen-setup");
  $("#end-home").onclick = () => show("screen-home");

  if (!speechSupported) $("#mic-note").style.display = "block";
}

document.addEventListener("DOMContentLoaded", init);

/* SYNAPSE — game logic
 * Flow: Players → Mode → Category → Play (landscape) → End.
 * Shout It  : 2+ players. Question shows, mic listens, first correct shout earns a tally.
 * Explain It: 1–3 players. Each gets a timer to explain; the judge ranks accuracy.
 *
 * Judge runs locally by default; flip CONFIG.ai.enabled to use a Claude proxy
 * (falls back to local on any error). See config.js / SERVER_NOTES.md.
 */

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const SHOUT_DURATION = 30;  // seconds to shout the answer
const ROUND_LENGTH = 10;    // questions per round (drawn at random from the pool)

const state = {
  players: [],
  mode: null,
  duration: 15,
  catId: null,
  queue: [],
  qIndex: 0,
  current: null,
  turn: 0,
  transcripts: {},
};

/* soft color theme per category — background + accent (used on the play screen) */
const CATEGORY_THEME = {
  survive:   { bg: "#dbe8d6", accent: "#3f6b4a" },  // green
  house:     { bg: "#e9e1cf", accent: "#876a37" },  // tan
  money:     { bg: "#efe3b0", accent: "#897219" },  // gold
  body:      { bg: "#f0d6d1", accent: "#a4453a" },  // red
  kitchen:   { bg: "#f1ddc5", accent: "#b3652a" },  // orange
  sense:     { bg: "#f0e9b6", accent: "#8c8020" },  // yellow
  grownup:   { bg: "#dee1ea", accent: "#454f6d" },  // slate
  geo:       { bg: "#d3e2ec", accent: "#2f6080" },  // blue
  civics:    { bg: "#dcdde9", accent: "#4a4f7a" },  // indigo-grey
  generaled: { bg: "#e4dcee", accent: "#5e468a" },  // purple
};

/* ---------------- speech ---------------- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const speechSupported = !!SR;
let recog = null;

// Collapse the repetition some speech engines (notably Android Chrome) produce:
// consecutive duplicate words ("boil boil boil" -> "boil") and whole-phrase
// loops ("call 911 call 911" -> "call 911").
function dedupeTranscript(s) {
  let words = (s || "").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  // Collapse any IMMEDIATELY repeated block of words (handles "x x x x" and
  // "in the ground in the ground in the ground"), repeating until stable.
  let changed = true, guard = 0;
  while (changed && guard++ < 400) {
    changed = false;
    const max = Math.floor(words.length / 2);
    for (let len = 1; len <= max && !changed; len++) {
      for (let i = 0; i + 2 * len <= words.length; i++) {
        let eq = true;
        for (let k = 0; k < len; k++) {
          if (words[i + k].toLowerCase() !== words[i + len + k].toLowerCase()) { eq = false; break; }
        }
        if (eq) { words.splice(i + len, len); changed = true; break; }
      }
    }
  }
  return words.join(" ");
}

function startRecog(onResult, opts = {}) {
  if (!SR) return false;
  stopRecog();
  recog = new SR();
  recog.lang = "en-US";
  recog.continuous = opts.continuous ?? true;
  recog.interimResults = true;
  recog.maxAlternatives = 1;
  // Track the single longest clean transcript instead of concatenating across
  // sessions — concatenation was what produced the repeated/overlapping text.
  let best = "";
  recog.onresult = (e) => {
    let finalT = "", interim = "";
    for (let i = 0; i < e.results.length; i++) {
      const res = e.results[i];
      if (res.isFinal) finalT += res[0].transcript + " ";
      else interim += res[0].transcript + " ";
    }
    const current = dedupeTranscript(finalT + " " + interim);
    if (current.length > best.length) best = current;
    onResult({ text: best });
  };
  recog.onerror = () => {};
  recog.onend = () => { if (opts.keepAlive && opts.keepAlive()) { try { recog.start(); } catch (_) {} } };
  try { recog.start(); return true; } catch (_) { return false; }
}
function stopRecog() { if (recog) { try { recog.onend = null; recog.stop(); } catch (_) {} recog = null; } }

/* ---------------- text-to-speech (read the question aloud) ---------------- */
function cancelSpeak() { try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (_) {} }
function speakThen(text, onDone) {
  let done = false;
  const go = () => { if (done) return; done = true; onDone(); };
  try {
    if (!("speechSynthesis" in window)) return go();
    cancelSpeak();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.0; u.pitch = 1.0;
    u.onend = go;
    u.onerror = go;
    window.speechSynthesis.speak(u);
    // Safety net: some browsers never fire onend — start anyway after an estimate.
    setTimeout(go, Math.min(15000, 2000 + text.length * 65));
  } catch (_) { go(); }
}

/* ---------------- judging ---------------- */
function normalize(s) { return (s || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim(); }
function matchesAccept(text, accept) {
  const t = " " + normalize(text) + " ";
  return accept.some(kw => t.includes(normalize(kw)));
}
// crude stemmer so "explaining/explained/explains" all match "explain"
function stem(w) {
  w = w.toLowerCase();
  if (w.length <= 3) return w;
  return w.replace(/(ations?|ments?|ings?|edly|ed|ly|es|s)$/, "").replace(/i$/, "y");
}
function stemSet(text) {
  return new Set(normalize(text).split(" ").filter(Boolean).map(stem));
}
// a key concept counts if its stems appear (exact, stem, or partial substring)
function keyHit(keyTerm, saidSet, saidStr) {
  const parts = normalize(keyTerm).split(" ").filter(Boolean).map(stem);
  return parts.every(p =>
    saidSet.has(p) ||
    [...saidSet].some(s => (s.length > 3 && (s.includes(p) || p.includes(s)))) ||
    saidStr.includes(p)
  );
}
function scoreExplanation(text, q) {
  const t = normalize(text);
  if (!t) return { score: 0, hits: [] };
  const said = stemSet(text);
  const saidStr = " " + t + " ";
  const hits = q.key.filter(k => keyHit(k, said, saidStr));
  const coverage = hits.length / q.key.length;
  const words = t.split(" ").filter(Boolean).length;
  const effort = Math.min(words / 18, 1) * 0.15;
  // curve so a partly-right answer reads fairly (covering ~half the concepts ≈ 70%)
  const score = Math.min(1, Math.pow(coverage, 0.6) + effort);
  return { score, hits };
}
function localJudge(transcripts, q) {
  const ranked = state.players.map(p => {
    const { score, hits } = scoreExplanation(transcripts[p.name] || "", q);
    const note = hits.length ? "covered: " + hits.slice(0, 4).join(", ") : "didn't get there";
    return { name: p.name, score, note };
  }).sort((a, b) => b.score - a.score);
  const best = ranked[0];
  const winner = best && best.score >= 0.18 ? best.name : null;
  return { ranked, winner, verdict: winner ? `${winner} nailed it best` : "Nobody really got there", roast: winner ? pick(PRAISE) : pick(ROASTS) };
}
async function aiJudge(transcripts, q) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), CONFIG.ai.timeoutMs);
  try {
    const res = await fetch(CONFIG.ai.endpoint, {
      method: "POST", headers: { "Content-Type": "application/json" }, signal: ctrl.signal,
      body: JSON.stringify({ question: q.q, idealAnswer: q.answer, answers: state.players.map(p => ({ name: p.name, text: transcripts[p.name] || "" })) })
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

/* ---------------- nav ---------------- */
function show(id) {
  $$(".screen").forEach(s => s.classList.remove("active"));
  $("#" + id).classList.add("active");
  window.scrollTo(0, 0);
}

/* ---------------- reveal page ---------------- */
function showReveal(innerHtml) {
  const cat = CATEGORIES.find(c => c.id === state.catId);
  $("#reveal-cat").textContent = cat.name;
  $("#reveal-progress").textContent = `Q${state.qIndex + 1}/${state.queue.length}`;
  $("#reveal-content").innerHTML = innerHtml;
  show("screen-reveal");
}

/* ---------------- step 1: players ---------------- */
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
  $("#players-next").disabled = state.players.length < 1;
}
function addPlayer(name) {
  name = (name || "").trim();
  if (!name || state.players.length >= 8) return;
  state.players.push({ name, score: 0 });
  renderPlayers();
}

/* ---------------- step 2: mode ---------------- */
function renderMode() {
  const n = state.players.length;
  const explainOK = n >= 1 && n <= 3;
  const shoutOK = n >= 2;
  const avail = { shout: shoutOK, explain: explainOK };

  $$(".mode-big").forEach(c => {
    const ok = avail[c.dataset.mode];
    c.classList.toggle("disabled", !ok);
  });
  // clear invalid selection
  if (state.mode && !avail[state.mode]) state.mode = null;
  // auto-pick if exactly one is valid
  if (!state.mode) {
    if (shoutOK && !explainOK) state.mode = "shout";
    else if (explainOK && !shoutOK) state.mode = "explain";
  }
  applyMode();
}
function selectMode(m) {
  state.mode = m;
  applyMode();
}
function applyMode() {
  $$(".mode-big").forEach(c => c.classList.toggle("sel", c.dataset.mode === state.mode));
  $("#time-block").style.display = state.mode === "explain" ? "block" : "none";
  $("#mode-next").disabled = !state.mode;
}

/* ---------------- step 3: category ---------------- */
function renderCategories() {
  const wrap = $("#cat-list");
  wrap.innerHTML = "";
  CATEGORIES.forEach(c => {
    const t = CATEGORY_THEME[c.id] || {};
    const card = document.createElement("button");
    card.className = "cat-card";
    card.dataset.id = c.id;
    card.style.background = t.bg || "var(--paper)";
    card.innerHTML = `<div class="cat-icon">${ICONS[c.icon] || ICONS.bulb}</div><div class="cat-name">${c.name}</div><div class="cat-blurb">${c.blurb}</div>`;
    card.onclick = () => startGame(c.id);
    wrap.appendChild(card);
  });
}

/* ---------------- gameplay ---------------- */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// shout mode uses each category's short-answer `shout` set; explain uses `questions`
function currentSet(cat) {
  return (state.mode === "shout" && Array.isArray(cat.shout) && cat.shout.length) ? cat.shout : cat.questions;
}

function startGame(catId) {
  state.catId = catId;
  state.players.forEach(p => p.score = 0);
  const cat = CATEGORIES.find(c => c.id === catId);
  const pool = currentSet(cat);
  // scramble the whole pool, then take a round's worth — different subset each game
  state.queue = shuffle(pool.map((_, i) => i)).slice(0, Math.min(ROUND_LENGTH, pool.length));
  state.qIndex = 0;

  const t = CATEGORY_THEME[catId] || {};
  document.documentElement.style.setProperty("--qbg", t.bg || "var(--paper)");
  document.documentElement.style.setProperty("--qaccent", t.accent || "var(--accent)");

  $("#score-strip").classList.remove("show");
  show("screen-play");
  nextQuestion();
}

function nextQuestion() {
  stopRecog();
  cancelSpeak();
  if (state.qIndex >= state.queue.length) return endGame();
  const cat = CATEGORIES.find(c => c.id === state.catId);
  state.current = currentSet(cat)[state.queue[state.qIndex]];
  state.transcripts = {};
  state.turn = 0;

  $("#q-progress").textContent = `Q${state.qIndex + 1}/${state.queue.length}`;
  $("#q-cat").textContent = cat.name;
  $("#q-text").textContent = state.current.q;
  renderScoreStrip();

  if (state.mode === "shout") setupShout();
  else setupExplain();
}

function renderScoreStrip() {
  $("#score-strip").innerHTML = state.players.map(p => `<div class="sc"><span class="sc-n">${p.name}</span><span class="sc-v">${p.score}</span></div>`).join("");
}

/* ---- SHOUT ----
 * Read the question aloud → start a timer + auto-listen → on a correct shout
 * (or "Someone got it") stop and pick who said it → on timeout, reveal. */
function setupShout() {
  $("#play-shout").style.display = "block";
  $("#play-explain").style.display = "none";

  const dur = SHOUT_DURATION;
  $("#shout-stage").innerHTML = `
    <div class="turn-sub" id="shout-sub">Listen to the question…</div>
    <div class="timer-ring">
      <svg viewBox="0 0 120 120"><circle class="ring-bg" cx="60" cy="60" r="54"/><circle class="ring-fg" id="ring-fg" cx="60" cy="60" r="54"/></svg>
      <div class="timer-num" id="timer-num">${dur}</div>
    </div>
    <div class="explain-live" id="shout-live"></div>
    <div id="shout-controls" class="row" style="justify-content:center">
      <button class="btn primary" id="shout-claim">Someone got it</button>
      <button class="btn link" id="shout-nobody">Nobody</button>
    </div>`;

  const num = $("#timer-num"), ring = $("#ring-fg"), live = $("#shout-live");
  const circ = 2 * Math.PI * 54;
  ring.style.strokeDasharray = circ; ring.style.strokeDashoffset = 0;
  let left = dur, timer = null, listening = false, ended = false;

  const stopAll = () => { ended = true; listening = false; clearInterval(timer); stopRecog(); };

  const toAward = () => {
    if (ended) return;
    stopAll();
    $("#shout-sub").textContent = "Correct! Who shouted it first?";
    live.textContent = "";
    $("#shout-controls").style.display = "none";
    const wrap = document.createElement("div");
    wrap.className = "award-grid";
    state.players.forEach(p => {
      const b = document.createElement("button");
      b.className = "award-btn"; b.textContent = p.name;
      b.onclick = () => { p.score += 1; renderScoreStrip(); revealShout(false, p.name); };
      wrap.appendChild(b);
    });
    $("#shout-stage").appendChild(wrap);
  };

  const timeUp = () => { if (ended) return; stopAll(); revealShout(true); };

  $("#shout-claim").onclick = toAward;
  $("#shout-nobody").onclick = timeUp;

  const beginListening = () => {
    if (ended) return;
    $("#shout-sub").textContent = speechSupported ? "Listening… shout the answer!" : "Shout it, then tap “Someone got it”";
    if (speechSupported) {
      listening = true;
      startRecog((r) => {
        live.textContent = r.text;
        if (!ended && matchesAccept(r.text, state.current.accept)) toAward();
      }, { continuous: true, keepAlive: () => listening && !ended });
    }
    timer = setInterval(() => {
      left--; num.textContent = Math.max(left, 0);
      ring.style.strokeDashoffset = circ * (1 - left / dur);
      if (left <= 0) timeUp();
    }, 1000);
  };

  speakThen(state.current.q, beginListening);
}

function revealShout(missed, winnerName) {
  const html = `
    <div class="reveal-q">${state.current.q}</div>
    ${missed ? `<div class="roast big">${pick(ROASTS)}</div>` : `<div class="praise big">Tally to ${winnerName} — ${pick(PRAISE)}</div>`}
    <div class="reveal"><span class="reveal-label">The answer</span><div class="answer-big">${state.current.answer}</div></div>`;
  showReveal(html);
}

/* ---- EXPLAIN ---- */
function setupExplain() {
  $("#play-shout").style.display = "none";
  $("#play-explain").style.display = "block";
  runExplainTurn();
}

function runExplainTurn() {
  if (state.turn >= state.players.length) return judgeExplain();
  const p = state.players[state.turn];
  $("#explain-stage").innerHTML = `
    <div class="turn-name">${p.name}<span class="turn-of" id="turn-of"> — get ready</span></div>
    <div class="turn-sub" id="explain-sub">Listen to the question…</div>
    <div class="timer-ring">
      <svg viewBox="0 0 120 120"><circle class="ring-bg" cx="60" cy="60" r="54"/><circle class="ring-fg" id="ring-fg" cx="60" cy="60" r="54"/></svg>
      <div class="timer-num" id="timer-num">${state.duration}</div>
    </div>
    <div class="explain-live" id="explain-live"></div>
    <div class="row" style="justify-content:center">
      <button class="btn link" id="explain-skip">Skip turn</button>
    </div>`;

  const live = $("#explain-live"), num = $("#timer-num"), ring = $("#ring-fg");
  const circ = 2 * Math.PI * 54;
  ring.style.strokeDasharray = circ; ring.style.strokeDashoffset = 0;
  let left = state.duration, captured = "", timer = null, answering = false;

  const finish = () => {
    clearInterval(timer); stopRecog();
    const manual = $("#manual-explain");
    state.transcripts[p.name] = (manual ? manual.value : captured) || "";
    state.turn++; runExplainTurn();
  };

  $("#explain-skip").onclick = () => { cancelSpeak(); clearInterval(timer); stopRecog(); state.transcripts[p.name] = ""; state.turn++; runExplainTurn(); };

  // mic + timer begin only AFTER the question is read aloud (no feedback into the mic)
  const beginAnswering = () => {
    if (answering) return; answering = true;
    const turnOf = $("#turn-of"), sub = $("#explain-sub");
    if (turnOf) turnOf.textContent = " — go!";
    if (sub) sub.textContent = "Explain your answer out loud";
    if (speechSupported) {
      startRecog((r) => { captured = r.text; live.textContent = captured; }, { continuous: true, keepAlive: () => left > 0 });
    } else {
      live.innerHTML = `<textarea id="manual-explain" placeholder="(mic unavailable) type the gist…"></textarea>`;
    }
    timer = setInterval(() => {
      left--; num.textContent = Math.max(left, 0);
      ring.style.strokeDashoffset = circ * (1 - left / state.duration);
      if (left <= 0) finish();
    }, 1000);
  };

  speakThen(`${p.name}. ${state.current.q}`, beginAnswering);
}

async function judgeExplain() {
  $("#explain-stage").innerHTML = `<div class="judging"><div class="judging-dots"><span></span><span></span><span></span></div><div>${CONFIG?.ai?.enabled ? "Claude is judging…" : "Judging accuracy…"}</div></div>`;
  const result = await judge(state.transcripts, state.current);
  if (result.winner) {
    const w = state.players.find(p => p.name === result.winner);
    if (w) { w.score += 1; renderScoreStrip(); }
  }
  const html = `
    <div class="reveal-q">${state.current.q}</div>
    <div class="verdict">${result.verdict}</div>
    <div class="rank-list">
      ${result.ranked.map((r, i) => `
        <div class="rank-row ${i === 0 && result.winner ? "win" : ""}">
          <span class="rk">${i + 1}</span><span class="rk-name">${r.name}</span>
          <span class="rk-bar"><span style="width:${Math.round((r.score || 0) * 100)}%"></span></span>
          <span class="rk-pct">${Math.round((r.score || 0) * 100)}%</span>
        </div>
        ${r.note ? `<div class="rk-note">${r.note}</div>` : ""}`).join("")}
    </div>
    <div class="${result.winner ? "praise" : "roast"}">${result.roast}</div>
    <div class="reveal"><span class="reveal-label">The answer</span><div class="answer-big">${state.current.answer}</div></div>`;
  showReveal(html);
}

function endGame() {
  stopRecog();
  cancelSpeak();
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
  doc: `<svg viewBox="0 0 24 24"><path d="M7 3h7l4 4v14H7zM14 3v4h4M9 12h6M9 16h6"/></svg>`,
  globe: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></svg>`,
  bank: `<svg viewBox="0 0 24 24"><path d="M4 9h16M5 9l7-5 7 5M6 9v8M10 9v8M14 9v8M18 9v8M4 20h16"/></svg>`,
  atom: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="9" ry="4"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(120 12 12)"/></svg>`
};

/* ---------------- wire up ---------------- */
function init() {
  renderPlayers();
  renderCategories();

  // step 1
  $("#how-btn").onclick = () => $("#how-modal").classList.add("show");
  $("#how-close").onclick = () => $("#how-modal").classList.remove("show");
  $("#add-player-btn").onclick = () => { addPlayer($("#player-input").value); $("#player-input").value = ""; $("#player-input").focus(); };
  $("#player-input").addEventListener("keydown", (e) => { if (e.key === "Enter") $("#add-player-btn").click(); });
  $("#players-next").onclick = () => { renderMode(); show("screen-mode"); };

  // step 2
  $("#mode-back").onclick = () => show("screen-players");
  $$(".mode-big").forEach(c => c.onclick = () => { if (!c.classList.contains("disabled")) selectMode(c.dataset.mode); });
  $$("#time-block .seg").forEach(s => s.onclick = () => {
    state.duration = +s.dataset.sec;
    $$("#time-block .seg").forEach(x => x.classList.toggle("sel", x === s));
  });
  $("#mode-next").onclick = () => { if (state.mode) show("screen-category"); };

  // step 3
  $("#cat-back").onclick = () => show("screen-mode");

  // play
  $("#quit-btn").onclick = () => { stopRecog(); cancelSpeak(); show("screen-players"); };
  $("#score-toggle").onclick = () => $("#score-strip").classList.toggle("show");

  // reveal / answer page
  $("#reveal-quit").onclick = () => { stopRecog(); cancelSpeak(); show("screen-players"); };
  $("#reveal-next").onclick = () => { state.qIndex++; show("screen-play"); nextQuestion(); };

  // end
  $("#again-btn").onclick = () => { renderMode(); show("screen-mode"); };
  $("#end-home").onclick = () => { state.players = []; renderPlayers(); show("screen-players"); };
}

document.addEventListener("DOMContentLoaded", init);

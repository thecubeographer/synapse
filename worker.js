/* SYNAPSE judge proxy — Cloudflare Worker
 *
 * Holds your API key as a server-side secret so the public site never sees it.
 * Supports Google Gemini (has a real FREE tier) or Anthropic Claude.
 *
 * Deploy: see SETUP_AI.md. Set ONE of these secrets in the Worker:
 *   GEMINI_API_KEY      (free — get one at https://aistudio.google.com/apikey)
 *   ANTHROPIC_API_KEY   (paid per call, but cheap)
 * Optional vars:
 *   ALLOW_ORIGIN  default "*"  (lock to https://thecubeographer.github.io to be strict)
 *   GEMINI_MODEL  default "gemini-2.0-flash"
 *   CLAUDE_MODEL  default "claude-haiku-4-5-20251001"
 */

const JUDGE_SYSTEM = `You are the judge in SYNAPSE, an anti-AI party trivia game about real-world knowledge.
You get a question, the ideal answer, and each player's spoken explanation (raw speech-to-text — be forgiving of grammar, filler, and homophones).
Score each player 0..1 on how accurately and completely they explained the idea VERSUS the ideal answer. Reward correct reasoning in the player's OWN words — do NOT require exact wording. Penalize vague or wrong answers.
Pick the single best as "winner", or null if nobody was meaningfully correct (top score < ~0.25).
Write a short punchy "verdict" (one line) and ONE playful "roast" line — roast the table if nobody got it, praise the winner if someone did. Keep it light and funny, never cruel.
For each player include a short "note" (≤8 words) on what they got right or missed.
Respond with ONLY minified JSON, no prose, no code fences:
{"ranked":[{"name":string,"score":number,"note":string}],"winner":string|null,"verdict":string,"roast":string}`;

export default {
  async fetch(request, env) {
    const origin = env.ALLOW_ORIGIN || "*";
    const cors = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return json({ error: "POST only" }, 405, cors);

    let body;
    try { body = await request.json(); } catch { return json({ error: "bad json" }, 400, cors); }
    const { question, idealAnswer, answers } = body || {};
    if (!question || !Array.isArray(answers)) return json({ error: "missing fields" }, 400, cors);

    const userPayload = JSON.stringify({ question, idealAnswer, answers });

    try {
      let text;
      if (env.GEMINI_API_KEY) text = await callGemini(env, userPayload);
      else if (env.ANTHROPIC_API_KEY) text = await callClaude(env, userPayload);
      else return json({ error: "no API key configured" }, 500, cors);

      const data = parseJudge(text);
      if (!data || !Array.isArray(data.ranked)) throw new Error("model returned unparseable output");
      return json(data, 200, cors);
    } catch (e) {
      return json({ error: String(e && e.message || e) }, 502, cors);
    }
  },
};

async function callGemini(env, userPayload) {
  const model = env.GEMINI_MODEL || "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: JUDGE_SYSTEM }] },
      contents: [{ role: "user", parts: [{ text: userPayload }] }],
      generationConfig: { temperature: 0.4, responseMimeType: "application/json" },
    }),
  });
  if (!res.ok) throw new Error("gemini " + res.status + " " + (await res.text()).slice(0, 200));
  const j = await res.json();
  return j?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

async function callClaude(env, userPayload) {
  const model = env.CLAUDE_MODEL || "claude-haiku-4-5-20251001";
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 700,
      system: JUDGE_SYSTEM,
      messages: [{ role: "user", content: userPayload }],
    }),
  });
  if (!res.ok) throw new Error("claude " + res.status + " " + (await res.text()).slice(0, 200));
  const j = await res.json();
  return (j.content || []).filter(c => c.type === "text").map(c => c.text).join("");
}

function parseJudge(text) {
  if (!text) return null;
  let t = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const a = t.indexOf("{"), b = t.lastIndexOf("}");
  if (a !== -1 && b !== -1) t = t.slice(a, b + 1);
  try { return JSON.parse(t); } catch { return null; }
}

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json", ...cors } });
}

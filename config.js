/* SYNAPSE config — flip ai.enabled to true once your Claude proxy is live.
 *
 * The app NEVER calls Claude directly from the browser (that would leak your key).
 * Stand up a tiny server endpoint that holds the key and forwards to the Anthropic
 * API, then point `endpoint` at it. Until then, everything falls back to the
 * built-in local judge — the game is fully playable with ai.enabled = false.
 */
const CONFIG = {
  ai: {
    enabled: false,            // <-- set true when the endpoint below exists
    endpoint: "/api/judge",    // your server route (proxies to Anthropic)
    model: "claude-opus-4-8",
    timeoutMs: 12000,

    // Also let Claude verify Shout-It answers instead of keyword matching.
    verifyShout: false,
    shoutEndpoint: "/api/check"
  }
};

/* ---- Request/response contract your server must honor ----
 *
 * POST {endpoint}  (Explain-It judge)
 *   body: {
 *     question: string,          // the prompt shown
 *     idealAnswer: string,       // the correct answer (q.answer)
 *     answers: [ { name, text } ]// each player's transcript
 *   }
 *   -> 200 JSON: {
 *     ranked:  [ { name, score, note } ],   // score 0..1, note = one-line why
 *     winner:  string | null,               // null = nobody got it
 *     verdict: string,                       // headline shown at top
 *     roast:   string                        // playful line (roast or praise)
 *   }
 *
 * POST {shoutEndpoint}  (optional Shout-It checker)
 *   body:  { question, idealAnswer, said }   // `said` = transcribed shout
 *   -> 200 JSON: { correct: boolean }
 *
 * A reference server prompt lives in SERVER_NOTES.md.
 */

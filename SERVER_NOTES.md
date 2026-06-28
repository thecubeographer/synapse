# Hooking SYNAPSE up to Claude

The browser never holds your API key. You run a small server that does, and the
app calls it. Flip `ai.enabled = true` in `config.js` once it's live.

## What the app sends / expects

See the contract at the bottom of `config.js`. Two routes:

- `POST /api/judge` — ranks each player's explanation, returns winner + verdict + roast.
- `POST /api/check` (optional) — yes/no whether a shouted answer is correct.

## Reference judge prompt (system)

> You are the judge in SYNAPSE, an anti-AI party trivia game about real-world
> knowledge. You are given a question, the ideal answer, and each player's spoken
> explanation (raw speech-to-text — be forgiving of grammar). Score each from 0 to
> 1 on how accurate and complete it is versus the ideal answer. Pick the best one
> as the winner, or null if nobody was meaningfully correct (top score < ~0.2).
> Write a short, punchy verdict and ONE playful line — roast the table if nobody
> got it, praise the winner if someone did. Keep it light and funny, never mean.
> Respond ONLY as JSON: {"ranked":[{"name","score","note"}],"winner","verdict","roast"}.

## Minimal Node/Express example

```js
import express from "express";
import Anthropic from "@anthropic-ai/sdk";
const app = express();
app.use(express.json());
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.post("/api/judge", async (req, res) => {
  const { question, idealAnswer, answers } = req.body;
  const msg = await anthropic.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 700,
    system: "<the judge prompt above>",
    messages: [{ role: "user", content: JSON.stringify({ question, idealAnswer, answers }) }]
  });
  const text = msg.content.find(c => c.type === "text").text;
  res.json(JSON.parse(text));
});

app.listen(8787);
```

This mirrors the dev Vite-proxy pattern used in your other TOOLHUB apps — same idea,
keep the key server-side only.

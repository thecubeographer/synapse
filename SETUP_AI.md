# Turn on the AI judge (the FREE way) — ~5 minutes

This makes Claude/Gemini actually *read* each explanation and grade it like a human,
instead of keyword-matching. Your API key stays secret on a server — never in the
public site.

**Fully-free route = Google Gemini's free tier + Cloudflare Workers' free tier.**

---

## 1. Get a free Gemini API key
1. Go to <https://aistudio.google.com/apikey> (sign in with a Google account).
2. Click **Create API key**. Copy it. (Free tier — fine for a party game.)

> Prefer Claude instead? Skip this and use a fresh Anthropic key in step 3.
> Claude is cheap but not free (~a fraction of a cent per judged question).

## 2. Create the Cloudflare Worker
1. Make a free account at <https://dash.cloudflare.com> → **Workers & Pages** → **Create** → **Create Worker**.
2. Name it `synapse-judge`, click **Deploy** (the placeholder code is fine for now).
3. Click **Edit code**. Delete everything, then paste the entire contents of
   [`worker.js`](worker.js) from this repo. Click **Deploy**.

## 3. Add your key as a secret
In the Worker: **Settings → Variables and Secrets → Add**.
- Type **Secret**, Name **`GEMINI_API_KEY`**, Value = your key from step 1. Save & deploy.
- (Using Claude instead? Name it **`ANTHROPIC_API_KEY`** with your Anthropic key.)
- Optional, to lock it down: add a plain **Variable** `ALLOW_ORIGIN` =
  `https://thecubeographer.github.io`.

Your Worker now has a URL like `https://synapse-judge.YOURNAME.workers.dev`.

## 4. Point the app at it
In [`config.js`](config.js) set:
```js
ai: {
  enabled: true,
  endpoint: "https://synapse-judge.YOURNAME.workers.dev",
  ...
}
```
Commit & push. Done — Explain mode now grades with real understanding, and falls
back to the local judge automatically if the Worker is ever unreachable.

---

### Test it
Open the Worker URL test, or just play an Explain round. If grading still feels
keyword-y, check the browser console for `AI judge failed, using local:` — that
means the Worker errored (usually a missing/wrong secret).

### Cost
- Gemini free tier: **$0** for this volume.
- Cloudflare Workers free tier: **$0** (100k requests/day).
- Claude (if you chose it): a few cents per long game.

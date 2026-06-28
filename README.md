# SYNAPSE

**A trivia game for the unplugged.** Real-world questions, no phones, use your *actual* brain.

An anti-AI party game: gather your friends, pick a category of real-world problems (changing the oil, surviving without a phone, spotting a scam), and compete. The whole point is to make decisions **without** reaching for AI — keep the neurons firing.

## Two game modes

- **📣 Shout It** — A question appears, the mic listens, and the first person to yell the right answer scores. Tap who said it.
- **⏱️ Explain It** — Each player gets a timer to explain their answer out loud. The judge ranks who was most accurate and awards the point.

Get it wrong? You get roasted — then the real answer is revealed, so you actually learn it.

## Tech

Pure vanilla — `index.html`, `styles.css`, `app.js`, `questions.js`, `neurons.js`. No build step, no dependencies, no cloud.

- **Mic** via the Web Speech API (works best on Android Chrome; iOS Safari support is limited, so manual tap-buttons are always available).
- **The judge** is a local keyword/accuracy heuristic — no API key, runs entirely offline.
- **The background** is an animated neuron network on `<canvas>` that fires harder when someone gets it right.

## Run locally

Any static server works:

```bash
python3 -m http.server 4690
```

Then open <http://localhost:4690>. Live version runs on GitHub Pages.

## Categories

Off The Grid · Around The House · Real-World Money · Body & First Aid · In The Kitchen · Common Sense

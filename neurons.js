/* Neuron field — hairline straight lines + small circles. Light, minimal.
 * No gradients, no glow, no lonely "star" dots: every node that's drawn is wired
 * into the network. Pulses are tiny solid dots that travel the connections. */
(function () {
  const canvas = document.getElementById("neurons");
  const ctx = canvas.getContext("2d");
  let w, h, dpr;
  let nodes = [];
  let edges = [];
  let pulses = [];
  let intensity = 1;
  let maxD = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  }

  function build() {
    nodes = [];
    edges = [];
    // sparse — a quiet network, not a starfield
    const count = Math.max(10, Math.min(34, Math.round((w * h) / 42000)));
    maxD = Math.min(w, h) * 0.34;
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        deg: 0
      });
    }
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
        if (d < maxD) { edges.push({ a: i, b: j }); nodes[i].deg++; nodes[j].deg++; }
      }
    }
  }

  function fire(n) {
    n = n || 1;
    for (let k = 0; k < n; k++) {
      if (!edges.length) return;
      const e = edges[(Math.random() * edges.length) | 0];
      pulses.push({ e, t: 0, speed: 0.006 + Math.random() * 0.01, dir: Math.random() < 0.5 ? 1 : -1 });
    }
  }

  function cssVar(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  function frame() {
    const line = cssVar("--neuron-line", "rgba(0,0,0,0.07)");
    const dot = cssVar("--neuron-dot", "rgba(0,0,0,0.22)");
    const spark = cssVar("--neuron-spark", "#3b41c4");

    ctx.clearRect(0, 0, w, h);

    for (const nd of nodes) {
      nd.x += nd.vx; nd.y += nd.vy;
      if (nd.x < 0 || nd.x > w) nd.vx *= -1;
      if (nd.y < 0 || nd.y > h) nd.vy *= -1;
    }

    // hairline connections
    ctx.lineWidth = 0.6;
    ctx.strokeStyle = line;
    for (const e of edges) {
      const a = nodes[e.a], b = nodes[e.b];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d > maxD) continue;
      ctx.globalAlpha = 1 - d / maxD;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // small circles — only wired nodes
    ctx.fillStyle = dot;
    for (const nd of nodes) {
      if (nd.deg === 0) continue;
      ctx.beginPath();
      ctx.arc(nd.x, nd.y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // pulses: tiny solid dots, no glow
    ctx.fillStyle = spark;
    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i];
      p.t += p.speed;
      if (p.t >= 1) { pulses.splice(i, 1); continue; }
      const a = nodes[p.e.a], b = nodes[p.e.b];
      const t = p.dir === 1 ? p.t : 1 - p.t;
      const x = a.x + (b.x - a.x) * t;
      const y = a.y + (b.y - a.y) * t;
      ctx.beginPath();
      ctx.arc(x, y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    if (Math.random() < 0.02 * intensity) fire(1);

    requestAnimationFrame(frame);
  }

  window.SYNAPSE_NEURONS = {
    fire,
    burst: function (n) { fire(n || 8); },
    setIntensity: function (v) { intensity = v; }
  };

  window.addEventListener("resize", resize);
  resize();
  frame();
})();

/* Animated neuron network — thin line art with pulses "firing" along synapses.
 * Draws to a full-screen canvas behind the UI. Tunable via window.SYNAPSE_NEURONS. */
(function () {
  const canvas = document.getElementById("neurons");
  const ctx = canvas.getContext("2d");
  let w, h, dpr;
  let nodes = [];
  let edges = [];
  let pulses = [];
  let intensity = 1;      // 0..2, ramps up when "thinking"/correct
  let raf = null;

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
    const density = Math.max(18, Math.round((w * h) / 26000));
    const count = Math.min(70, density);
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: 1.2 + Math.random() * 1.6
      });
    }
    // connect near neighbors
    const maxD = Math.min(w, h) * 0.22;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d = Math.hypot(dx, dy);
        if (d < maxD) edges.push({ a: i, b: j, d });
      }
    }
  }

  function fire(n) {
    // launch n pulses along random edges
    n = n || 1;
    for (let k = 0; k < n; k++) {
      if (!edges.length) return;
      const e = edges[(Math.random() * edges.length) | 0];
      pulses.push({ e, t: 0, speed: 0.012 + Math.random() * 0.02, dir: Math.random() < 0.5 ? 1 : -1 });
    }
  }

  function cssVar(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  function frame() {
    const line = cssVar("--neuron-line", "rgba(120,130,160,0.18)");
    const dot = cssVar("--neuron-dot", "rgba(150,160,190,0.5)");
    const spark = cssVar("--neuron-spark", "#7c9eff");

    ctx.clearRect(0, 0, w, h);

    // drift
    for (const nd of nodes) {
      nd.x += nd.vx; nd.y += nd.vy;
      if (nd.x < 0 || nd.x > w) nd.vx *= -1;
      if (nd.y < 0 || nd.y > h) nd.vy *= -1;
    }

    // edges
    ctx.lineWidth = 1;
    ctx.strokeStyle = line;
    const maxD = Math.min(w, h) * 0.22;
    for (const e of edges) {
      const a = nodes[e.a], b = nodes[e.b];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d > maxD) continue;
      const alpha = 1 - d / maxD;
      ctx.globalAlpha = alpha * 0.9;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // nodes
    ctx.fillStyle = dot;
    for (const nd of nodes) {
      ctx.beginPath();
      ctx.arc(nd.x, nd.y, nd.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // pulses
    ctx.save();
    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i];
      p.t += p.speed;
      if (p.t >= 1) { pulses.splice(i, 1); continue; }
      const a = nodes[p.e.a], b = nodes[p.e.b];
      const t = p.dir === 1 ? p.t : 1 - p.t;
      const x = a.x + (b.x - a.x) * t;
      const y = a.y + (b.y - a.y) * t;
      const glow = ctx.createRadialGradient(x, y, 0, x, y, 9);
      glow.addColorStop(0, spark);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalAlpha = 0.9 * (1 - Math.abs(0.5 - p.t) * 1.2);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = spark;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // ambient firing
    if (Math.random() < 0.04 * intensity) fire(1);

    raf = requestAnimationFrame(frame);
  }

  window.SYNAPSE_NEURONS = {
    fire,
    burst: function (n) { fire(n || 14); },
    setIntensity: function (v) { intensity = v; }
  };

  window.addEventListener("resize", resize);
  resize();
  frame();
})();

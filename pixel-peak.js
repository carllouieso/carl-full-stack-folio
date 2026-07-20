/* Pixel Peak — a tiny stacking climber built for this portfolio.
   One button: drop the sliding block on the tower. Overhang is sliced off.
   Perfect drops build combos and regrow your block. Reach the peak. */

(() => {
  const canvas = document.querySelector("#pixel-peak");
  if (!canvas) return;

  // Global leaderboard (Supabase). Public keys — safe to ship in a static site;
  // writes are constrained by row-level security on the table.
  const SUPABASE_URL = "https://qbldmuebqecosjtfqcez.supabase.co";
  const SUPABASE_KEY = "sb_publishable_7NY2ANU6iinN6TvhzwzDCA_K6pyhUGK";
  const SCORES_ENDPOINT = `${SUPABASE_URL}/rest/v1/pixel_peak_scores`;
  const supabaseHeaders = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
  };

  const overlay = document.querySelector("[data-arcade-overlay]");
  const startButton = document.querySelector("[data-arcade-start]");
  const submitForm = document.querySelector("[data-arcade-submit]");
  const nameInput = document.querySelector("[data-arcade-name]");
  const globalWrap = document.querySelector("[data-arcade-global-wrap]");
  const globalList = document.querySelector("[data-arcade-global]");
  const overlayTitle = document.querySelector("[data-arcade-title]");
  const overlayCopy = document.querySelector("[data-arcade-copy]");
  const scoreReadout = document.querySelector("[data-arcade-score]");
  const bestReadout = document.querySelector("[data-arcade-best]");
  const comboReadout = document.querySelector("[data-arcade-combo]");
  const badgeList = document.querySelectorAll("[data-badge]");
  const boardList = document.querySelector("[data-arcade-board]");

  const ctx = canvas.getContext("2d");
  const VIEW_W = 420;
  const VIEW_H = 560;
  const BLOCK_H = 26;
  const BASE_W = 180;
  const PERFECT_PX = 5;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = VIEW_W * dpr;
  canvas.height = VIEW_H * dpr;
  ctx.scale(dpr, dpr);

  const PALETTE = ["#22d3ee", "#38bdf8", "#818cf8", "#c084fc", "#f472b6", "#fb7185", "#fb923c", "#facc15"];
  const blockColor = (level) => PALETTE[Math.floor(level / 6) % PALETTE.length];

  const BADGES = [
    { id: "base-camp", label: "Base Camp", hint: "Stack 10 blocks", test: (s) => s.height >= 10 },
    { id: "ridge-runner", label: "Ridge Runner", hint: "Stack 25 blocks", test: (s) => s.height >= 25 },
    { id: "summit-crew", label: "Summit Crew", hint: "Stack 50 blocks", test: (s) => s.height >= 50 },
    { id: "combo-3", label: "Triple Clean", hint: "3 perfect drops in a row", test: (s) => s.bestCombo >= 3 },
    { id: "combo-7", label: "Locked In", hint: "7 perfect drops in a row", test: (s) => s.bestCombo >= 7 },
  ];

  const store = {
    read(key, fallback) {
      try {
        const raw = localStorage.getItem(`pixel-peak:${key}`);
        return raw === null ? fallback : JSON.parse(raw);
      } catch {
        return fallback;
      }
    },
    write(key, value) {
      try {
        localStorage.setItem(`pixel-peak:${key}`, JSON.stringify(value));
      } catch {
        /* storage unavailable: play without persistence */
      }
    },
  };

  let best = store.read("best", 0);
  let unlockedBadges = new Set(store.read("badges", []));
  let runs = store.read("runs", []);

  const state = {
    playing: false,
    over: false,
    tower: [],
    slider: null,
    fallers: [],
    particles: [],
    camera: 0,
    cameraTarget: 0,
    shake: 0,
    score: 0,
    height: 0,
    combo: 0,
    bestCombo: 0,
    flash: 0,
  };

  const syncReadouts = () => {
    if (scoreReadout) scoreReadout.textContent = String(state.score);
    if (bestReadout) bestReadout.textContent = String(best);
    if (comboReadout) comboReadout.textContent = state.combo > 1 ? `x${state.combo}` : "-";
  };

  const syncBadges = () => {
    badgeList.forEach((el) => {
      el.classList.toggle("is-unlocked", unlockedBadges.has(el.dataset.badge));
    });
  };

  const syncBoard = () => {
    if (!boardList) return;
    boardList.replaceChildren(
      ...runs.slice(0, 5).map((run, index) => {
        const item = document.createElement("li");
        item.innerHTML = `<span>${index + 1}.</span><strong>${run.score}</strong><small>${run.when}</small>`;
        return item;
      }),
    );
  };

  const renderGlobalBoard = (rows) => {
    if (!globalWrap || !globalList) return;
    globalWrap.hidden = false;
    globalList.replaceChildren(
      ...rows.map((row, index) => {
        const item = document.createElement("li");
        const rank = document.createElement("span");
        rank.textContent = `${index + 1}.`;
        const score = document.createElement("strong");
        score.textContent = String(row.score);
        const who = document.createElement("small");
        who.textContent = row.name;
        item.append(rank, score, who);
        return item;
      }),
    );
  };

  const fetchGlobalBoard = async () => {
    try {
      const response = await fetch(
        `${SCORES_ENDPOINT}?select=name,score&order=score.desc&limit=5`,
        { headers: supabaseHeaders },
      );
      if (!response.ok) return;
      const rows = await response.json();
      if (Array.isArray(rows) && rows.length) renderGlobalBoard(rows);
    } catch {
      /* offline or table not ready: global board stays hidden */
    }
  };

  let scoreSubmitted = false;

  const submitScore = async (name, score) => {
    try {
      const response = await fetch(SCORES_ENDPOINT, {
        method: "POST",
        headers: { ...supabaseHeaders, Prefer: "return=minimal" },
        body: JSON.stringify({ name, score }),
      });
      if (response.ok) {
        scoreSubmitted = true;
        if (submitForm) submitForm.hidden = true;
        fetchGlobalBoard();
      }
    } catch {
      /* submission is best-effort */
    }
  };

  submitForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = (nameInput?.value || "").trim().toUpperCase().slice(0, 12);
    if (!name || !state.over || state.score <= 0 || scoreSubmitted) return;
    submitScore(name, state.score);
  });

  const announceBadge = (badge) => {
    const toast = document.createElement("div");
    toast.className = "cheat-toast";
    toast.textContent = `BADGE UNLOCKED: ${badge.label.toUpperCase()}`;
    document.body.appendChild(toast);
    window.setTimeout(() => toast.remove(), 3100);
  };

  const checkBadges = () => {
    BADGES.forEach((badge) => {
      if (unlockedBadges.has(badge.id) || !badge.test(state)) return;
      unlockedBadges.add(badge.id);
      store.write("badges", [...unlockedBadges]);
      announceBadge(badge);
    });
    syncBadges();
  };

  const spawnSlider = () => {
    const top = state.tower[state.tower.length - 1];
    const level = state.tower.length;
    const fromLeft = level % 2 === 0;
    state.slider = {
      w: top.w,
      x: fromLeft ? -top.w : VIEW_W,
      y: top.y - BLOCK_H,
      dir: fromLeft ? 1 : -1,
      speed: Math.min(2.2 + level * 0.055, 6),
      color: blockColor(level),
    };
  };

  const resetGame = () => {
    state.tower = [{ x: (VIEW_W - BASE_W) / 2, y: VIEW_H - BLOCK_H - 12, w: BASE_W, color: blockColor(0) }];
    state.fallers = [];
    state.particles = [];
    state.camera = 0;
    state.cameraTarget = 0;
    state.shake = 0;
    state.score = 0;
    state.height = 0;
    state.combo = 0;
    state.bestCombo = 0;
    state.flash = 0;
    state.over = false;
    spawnSlider();
    syncReadouts();
  };

  const burst = (x, y, color, count) => {
    for (let i = 0; i < count; i += 1) {
      state.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 5,
        vy: -Math.random() * 4 - 1,
        life: 1,
        size: Math.random() < 0.6 ? 3 : 5,
        color,
      });
    }
  };

  const endRun = () => {
    state.over = true;
    state.playing = false;
    if (state.score > best) {
      best = state.score;
      store.write("best", best);
    }
    runs = [
      { score: state.score, when: new Date().toLocaleDateString("en-PH", { month: "short", day: "numeric" }) },
      ...runs,
    ]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    store.write("runs", runs);
    syncBoard();
    syncReadouts();

    if (overlay) {
      if (overlayTitle) overlayTitle.textContent = "PEAK REACHED";
      if (overlayCopy) {
        overlayCopy.textContent = `Height ${state.height} · Score ${state.score}${state.score >= best ? " · New best!" : ""}`;
      }
      if (startButton) startButton.textContent = "Climb Again";
      if (submitForm) submitForm.hidden = state.score <= 0 || scoreSubmitted;
      overlay.hidden = false;
    }
  };

  const dropBlock = () => {
    if (!state.playing || state.over || !state.slider) return;

    const slider = state.slider;
    // Forgiveness: a drop while the block hasn't entered the screen yet is a no-op.
    if (slider.x + slider.w < 0 || slider.x > VIEW_W) return;

    const top = state.tower[state.tower.length - 1];
    const overlapLeft = Math.max(slider.x, top.x);
    const overlapRight = Math.min(slider.x + slider.w, top.x + top.w);
    const overlap = overlapRight - overlapLeft;

    if (overlap <= 2) {
      state.fallers.push({ x: slider.x, y: slider.y, w: slider.w, vy: 0, vr: (Math.random() - 0.5) * 0.1, r: 0, color: slider.color });
      state.shake = 9;
      endRun();
      return;
    }

    const offset = Math.abs(slider.x - top.x);
    const isPerfect = offset <= PERFECT_PX;
    let placed;

    if (isPerfect) {
      state.combo += 1;
      state.bestCombo = Math.max(state.bestCombo, state.combo);
      const grown = Math.min(slider.w + 6, BASE_W);
      placed = { x: top.x + (top.w - grown) / 2, y: slider.y, w: grown, color: slider.color };
      state.score += 1 + state.combo * 2;
      state.flash = 1;
      burst(placed.x + placed.w / 2, placed.y, "#facc15", 16);
    } else {
      state.combo = 0;
      placed = { x: overlapLeft, y: slider.y, w: overlap, color: slider.color };
      state.score += 1;
      const cutW = slider.w - overlap;
      if (cutW > 1) {
        const cutX = slider.x < top.x ? slider.x : overlapRight;
        state.fallers.push({ x: cutX, y: slider.y, w: cutW, vy: -1.5, vr: (Math.random() - 0.5) * 0.14, r: 0, color: slider.color });
      }
      burst(placed.x + placed.w / 2, placed.y + BLOCK_H / 2, placed.color, 6);
    }

    state.tower.push(placed);
    state.height = state.tower.length - 1;
    state.shake = isPerfect ? 5 : 3;
    state.cameraTarget = Math.max(0, VIEW_H * 0.42 - placed.y);
    checkBadges();
    syncReadouts();
    spawnSlider();
  };

  const startGame = () => {
    resetGame();
    scoreSubmitted = false;
    state.playing = true;
    if (overlay) overlay.hidden = true;
    if (submitForm) submitForm.hidden = true;
  };

  /* ---- rendering ---- */

  const drawBlock = (block, yOffset) => {
    const y = block.y + yOffset;
    ctx.fillStyle = block.color;
    ctx.fillRect(Math.round(block.x), Math.round(y), Math.round(block.w), BLOCK_H);
    ctx.fillStyle = "rgba(255, 255, 255, 0.28)";
    ctx.fillRect(Math.round(block.x), Math.round(y), Math.round(block.w), 4);
    ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
    ctx.fillRect(Math.round(block.x), Math.round(y + BLOCK_H - 4), Math.round(block.w), 4);
  };

  const draw = () => {
    const camY = state.camera + (state.shake > 0 ? (Math.random() - 0.5) * state.shake : 0);
    const camX = state.shake > 0 ? (Math.random() - 0.5) * state.shake : 0;

    ctx.clearRect(0, 0, VIEW_W, VIEW_H);

    // Backdrop: deep sky that warms as the tower climbs.
    const altitude = Math.min(state.height / 60, 1);
    const skyTop = `rgba(${Math.round(8 + altitude * 40)}, ${Math.round(11 + altitude * 8)}, ${Math.round(24 + altitude * 30)}, 1)`;
    const gradient = ctx.createLinearGradient(0, 0, 0, VIEW_H);
    gradient.addColorStop(0, skyTop);
    gradient.addColorStop(1, "#080b18");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);

    // Parallax grid.
    ctx.strokeStyle = "rgba(34, 211, 238, 0.07)";
    ctx.lineWidth = 1;
    const gridShift = (state.camera * 0.4) % 28;
    for (let gy = -28 + gridShift; gy < VIEW_H; gy += 28) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(VIEW_W, gy);
      ctx.stroke();
    }

    ctx.save();
    ctx.translate(camX, camY);

    state.tower.forEach((block) => {
      if (block.y + state.camera > -BLOCK_H && block.y + state.camera < VIEW_H + BLOCK_H) {
        drawBlock(block, 0);
      }
    });

    state.fallers.forEach((piece) => {
      ctx.save();
      ctx.translate(piece.x + piece.w / 2, piece.y + BLOCK_H / 2);
      ctx.rotate(piece.r);
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = piece.color;
      ctx.fillRect(-piece.w / 2, -BLOCK_H / 2, piece.w, BLOCK_H);
      ctx.restore();
    });

    if (state.playing && state.slider) {
      drawBlock(state.slider, 0);
      const top = state.tower[state.tower.length - 1];
      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      ctx.fillRect(Math.round(top.x), Math.round(state.slider.y), Math.round(top.w), BLOCK_H);
    }

    state.particles.forEach((p) => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
      ctx.globalAlpha = 1;
    });

    ctx.restore();

    if (state.flash > 0) {
      ctx.fillStyle = `rgba(250, 204, 21, ${state.flash * 0.16})`;
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    }

    // Scanlines for the CRT feel.
    ctx.fillStyle = "rgba(255, 255, 255, 0.025)";
    for (let sy = 0; sy < VIEW_H; sy += 4) {
      ctx.fillRect(0, sy, VIEW_W, 1);
    }
  };

  const update = () => {
    if (state.playing && state.slider) {
      const slider = state.slider;
      slider.x += slider.dir * slider.speed;
      if (slider.x <= -slider.w * 0.4) slider.dir = 1;
      if (slider.x + slider.w >= VIEW_W + slider.w * 0.4) slider.dir = -1;
    }

    state.camera += (state.cameraTarget - state.camera) * 0.08;
    state.shake = Math.max(0, state.shake - 0.6);
    state.flash = Math.max(0, state.flash - 0.05);

    state.fallers.forEach((piece) => {
      piece.vy += 0.35;
      piece.y += piece.vy;
      piece.r += piece.vr;
    });
    state.fallers = state.fallers.filter((piece) => piece.y + state.camera < VIEW_H + 80);

    state.particles.forEach((p) => {
      p.vy += 0.16;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.025;
    });
    state.particles = state.particles.filter((p) => p.life > 0);
  };

  const frame = () => {
    update();
    draw();
    window.requestAnimationFrame(frame);
  };

  /* ---- input ---- */

  startButton?.addEventListener("click", startGame);

  canvas.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    if (state.playing) dropBlock();
  });

  document.addEventListener("keydown", (event) => {
    if (event.code !== "Space") return;
    if (!state.playing) return;
    event.preventDefault();
    dropBlock();
  });

  syncReadouts();
  syncBadges();
  syncBoard();
  fetchGlobalBoard();
  window.requestAnimationFrame(frame);

  // Small public surface: used by the (upcoming) global leaderboard sync and handy for debugging.
  window.pixelPeak = {
    start: startGame,
    drop: dropBlock,
    step: (count = 1) => {
      for (let i = 0; i < count; i += 1) update();
      draw();
    },
    snapshot: () => ({
      playing: state.playing,
      over: state.over,
      score: state.score,
      height: state.height,
      combo: state.combo,
      bestCombo: state.bestCombo,
      sliderX: state.slider ? Math.round(state.slider.x) : null,
      sliderW: state.slider ? Math.round(state.slider.w) : null,
      topX: Math.round(state.tower[state.tower.length - 1]?.x ?? 0),
      topW: Math.round(state.tower[state.tower.length - 1]?.w ?? 0),
      best,
    }),
  };
})();

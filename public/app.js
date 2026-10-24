const state = {
  bossHp: 8450,
  bossMaxHp: 10000,
  gravity: 0.65,
  projSpeed: 1.85,
  shield: 1420,
  combo: 24,
  mutation: "LOW_GRAVITY_PLASMA_STORM",
  tick: 0
};

const canvas = document.getElementById("raidCanvas");
const ctx = canvas.getContext("2d");

const particles = Array.from({ length: 42 }, (_, i) => ({
  x: (i * 73) % 760,
  y: (i * 47) % 360,
  vx: 1.5 + (i % 4) * 0.45,
  vy: -0.8 + (i % 3) * 0.5,
  r: 2.5 + (i % 4),
  color: i % 2 === 0 ? "#a855f7" : "#22d3ee"
}));

function drawArena() {
  state.tick += 1;
  ctx.fillStyle = "#06040d";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Cyber grid
  ctx.strokeStyle = "rgba(145, 70, 255, 0.16)";
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Streamer Defender Ship (Left)
  const shipY = 180 + Math.sin(state.tick * 0.06) * 28;
  ctx.save();
  ctx.strokeStyle = "#34d399";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(115, shipY, 36, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#10b981";
  ctx.beginPath();
  ctx.moveTo(140, shipY);
  ctx.lineTo(95, shipY - 18);
  ctx.lineTo(95, shipY + 18);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Boss: NEON_HYDRA_MK4 (Right)
  const bossY = 175 + Math.cos(state.tick * 0.045) * 32;
  ctx.save();
  const grad = ctx.createRadialGradient(590, bossY, 10, 590, bossY, 72);
  grad.addColorStop(0, "#f43f5e");
  grad.addColorStop(0.55, "#9333ea");
  grad.addColorStop(1, "rgba(147, 51, 234, 0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(590, bossY, 72, 0, Math.PI * 2);
  ctx.fill();

  // Boss orbital rings
  ctx.strokeStyle = "#22d3ee";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(590, bossY, 84, 34, state.tick * 0.03, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Laser beam between Streamer & Boss
  ctx.strokeStyle = "rgba(52, 211, 153, 0.7)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(145, shipY);
  ctx.lineTo(540, bossY);
  ctx.stroke();

  // Plasma particles governed by Codex gravity_scale & projectile_speed
  particles.forEach(p => {
    p.x += p.vx * state.projSpeed;
    p.y += p.vy * state.gravity;
    if (p.x > canvas.width) p.x = 0;
    if (p.y > canvas.height) p.y = 0;
    if (p.y < 0) p.y = canvas.height;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Top-left Canvas telemetry watermark
  ctx.fillStyle = "rgba(15, 23, 42, 0.82)";
  ctx.fillRect(14, 14, 375, 52);
  ctx.strokeStyle = "#9146ff";
  ctx.strokeRect(14, 14, 375, 52);
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "bold 12px Consolas, monospace";
  ctx.fillText(`TWITCH OVERLAY · 60 FPS · GRAVITY=${state.gravity.toFixed(2)}G`, 26, 34);
  ctx.fillStyle = "#6ee7b7";
  ctx.fillText(`OPENAI CODEX SESSION: sess_codex_019a1b8e-7c42`, 26, 54);

  requestAnimationFrame(drawArena);
}

function updateHud() {
  const pct = Math.max(0, Math.min(100, (state.bossHp / state.bossMaxHp) * 100));
  document.getElementById("bossHpFill").style.width = `${pct}%`;
  document.getElementById("bossHpText").textContent = `${state.bossHp.toLocaleString()} / ${state.bossMaxHp.toLocaleString()} HP`;
  document.getElementById("physicsText").textContent = `${state.gravity.toFixed(2)}G · ${state.projSpeed.toFixed(2)}x Speed`;
  document.getElementById("shieldText").textContent = `${state.shield.toLocaleString()} Shield · ${state.combo}x Combo`;
  document.getElementById("activeMutationBadge").textContent = `ACTIVE MUTATION: ${state.mutation}`;
}

document.querySelectorAll(".cmd-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const cmd = btn.dataset.cmd;
    const feed = document.getElementById("twitchChatFeed");
    const term = document.getElementById("codexLiveTerm");

    if (cmd === "!mutate low_gravity") {
      state.gravity = 0.25;
      state.projSpeed = 2.40;
      state.bossHp = Math.max(0, state.bossHp - 650);
      state.mutation = "ZERO_G_ORBITAL_SWARM";
    } else if (cmd === "!mutate boss_rage") {
      state.gravity = 1.15;
      state.projSpeed = 3.10;
      state.shield += 450;
      state.mutation = "OVERCLOCK_HYDRA_ENRAGE";
    } else {
      state.bossHp = Math.max(0, state.bossHp - 1500);
      state.shield += 800;
      state.combo += 5;
      state.mutation = "BITS_METEOR_STRIKE_500";
    }
    updateHud();

    const m = document.createElement("div");
    m.className = "chat-msg sys";
    m.innerHTML = `⚡ OpenAI Codex applied <code>${cmd}</code> → <strong>${state.mutation}</strong> (AST Safe ✓)`;
    feed.appendChild(m);
    term.textContent += `\n> Applied live Twitch patch: ${cmd} -> ${state.mutation} (AST Safe ✓)`;
  });
});

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

updateHud();
drawArena();

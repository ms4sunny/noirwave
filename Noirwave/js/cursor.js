// ===============================
// Magnetic Balls Cursor Animation
// ===============================

let ballsAnimationId = null;

// Canvas
const canvas = document.getElementById("magneticBalls");
const ctx = canvas.getContext("2d");

// Size
let w, h;
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// ===============================
// Mouse Tracking (Canvas-local)
// ===============================
let mouse = { x: null, y: null, active: false };

// ===============================
// Mouse Tracking (Global / Window)
// ===============================
window.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  mouse.active = true;
});

window.addEventListener("mouseleave", () => {
  mouse.active = false;
  mouse.x = null;
  mouse.y = null;
});


// ===============================
// Balls Setup
// ===============================
const BALL_COUNT = 6;
const balls = [];

function initBalls() {
  balls.length = 0;
  for (let i = 0; i < BALL_COUNT; i++) {
    balls.push({
      x: w / 2 + (Math.random() - 0.5) * 80,
      y: h / 2 + (Math.random() - 0.5) * 80,
      vx: 0,
      vy: 0,
      size: 14 + Math.random() * 6
    });
  }
}
initBalls();

// ===============================
// Draw Orb
// ===============================
function drawBall(x, y, r) {
  const orbColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--orb-color")
    .trim();

  const gradient = ctx.createRadialGradient(
    x - r * 0.4,
    y - r * 0.4,
    r * 0.1,
    x,
    y,
    r
  );

  gradient.addColorStop(0, orbColor);
  gradient.addColorStop(0.3, "rgba(255,255,255,0.5)");
  gradient.addColorStop(1, "rgba(0,0,0,0.25)");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

// ===============================
// Animation Control
// ===============================
function startBalls() {
  if (ballsAnimationId) return;

  // Reset physics state
  balls.forEach(b => {
    b.vx = 0;
    b.vy = 0;
  });
  mouse.x = null;
  mouse.y = null;
  mouse.active = false;


  function animate() {
    ctx.clearRect(0, 0, w, h);

    balls.forEach((b, index) => {
      // Attraction to cursor
      if (mouse.active) {
        const dx = mouse.x - b.x;
        const dy = mouse.y - b.y;
        b.vx += dx * 0.004;
        b.vy += dy * 0.004;
      }

      // Soft attraction between balls
      for (let j = 0; j < balls.length; j++) {
        if (j === index) continue;
        const o = balls[j];
        const dx = o.x - b.x;
        const dy = o.y - b.y;
        b.vx += dx * 0.0007;
        b.vy += dy * 0.0007;
      }

      // Damping
      b.vx *= 0.90;
      b.vy *= 0.90;

      // Move
      b.x += b.vx;
      b.y += b.vy;

      drawBall(b.x, b.y, b.size);
    });

    ballsAnimationId = requestAnimationFrame(animate);
  }

  animate();
}

function stopBalls() {
  cancelAnimationFrame(ballsAnimationId);
  ballsAnimationId = null;

  // Clear canvas
  ctx.clearRect(0, 0, w, h);

  // Reset mouse
  mouse.x = null;
  mouse.y = null;
  mouse.active = false;
}

// ===============================
// Expose API
// ===============================
window.NoirBalls = {
  start: startBalls,
  stop: stopBalls
};

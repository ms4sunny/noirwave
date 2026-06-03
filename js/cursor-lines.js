// ===============================
// Silk Thread Cursor Animation
// (Option A – Calm / Elegant)
// File name preserved: cursor-lines.js
// ===============================

let linesAnimationId = null;

// Canvas
const linesCanvas = document.createElement("canvas");
const linesCtx = linesCanvas.getContext("2d");

linesCanvas.id = "cursorLinesCanvas";
document.body.appendChild(linesCanvas);

// Ensure background behavior
linesCanvas.style.position = "fixed";
linesCanvas.style.top = "0";
linesCanvas.style.left = "0";
linesCanvas.style.width = "100%";
linesCanvas.style.height = "100%";
linesCanvas.style.pointerEvents = "none";
linesCanvas.style.zIndex = "1";

// Size
let linesWidth, linesHeight;
function resizeLines() {
  lineswidth = linesCanvas.width = window.innerWidth;
  linesheight = linesCanvas.height = window.innerHeight;
}
resizeLines();
window.addEventListener("resize", resizeLines);

// ===============================
// Theme-aware color
// ===============================
function getLineColor() {
  return getComputedStyle(document.body)
    .getPropertyValue("--line-color")
    .trim();
}

// ===============================
// Cursor tracking
// ===============================
const lineMouse = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
};

window.addEventListener("mousemove", e => {
  lineMouse.x = e.clientX;
  lineMouse.y = e.clientY;
});

// ===============================
// Thread points
// ===============================
const POINT_COUNT = 20;
const threads = [];

function initThreads() {
  threads.length = 0;
  for (let i = 0; i < POINT_COUNT; i++) {
    threads.push({
      x: lineMouse.x,
      y: lineMouse.y,
      vx: 0,
      vy: 0
    });
  }
}

// ===============================
// Animation Control
// ===============================
function startLines() {
  if (linesAnimationId) return;

  initThreads();

  function animate() {
    linesCtx.clearRect(0, 0, width, height);

    linesCtx.strokeStyle = getLineColor();
    linesCtx.lineWidth = 1.2;
    linesCtx.lineCap = "round";
    linesCtx.beginPath();

    threads.forEach((p, i) => {
      const targetX = i === 0 ? lineMouse.x : threads[i - 1].x;
      const targetY = i === 0 ? lineMouse.y : threads[i - 1].y;

      const dx = targetX - p.x;
      const dy = targetY - p.y;

      // Silk-like elasticity
      p.vx += dx * 0.12;
      p.vy += dy * 0.12;

      p.vx *= 0.70;
      p.vy *= 0.70;

      p.x += p.vx;
      p.y += p.vy;

      if (i === 0) {
        linesCtx.moveTo(p.x, p.y);
      } else {
        linesCtx.lineTo(p.x, p.y);
      }
    });

    linesCtx.stroke();

    linesAnimationId = requestAnimationFrame(animate);
  }

  animate();
}

function stopLines() {
  cancelAnimationFrame(linesAnimationId);
  linesAnimationId = null;
  linesCtx.clearRect(0, 0, width, height);
}

// ===============================
// Expose API (same pattern)
// ===============================
window.NoirLines = {
  start: startLines,
  stop: stopLines
};

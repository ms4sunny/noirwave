// ===============================
// Inertia Veil Cursor Animation
// NoirWave — Oddly Satisfying
// ===============================

let veilAnimationId = null;

// -------------------------------
// Canvas
// -------------------------------
const veilCanvas = document.createElement("canvas");
const veilCtx = veilCanvas.getContext("2d");

veilCanvas.id = "cursorVeilCanvas";
document.body.appendChild(veilCanvas);

veilCanvas.style.position = "fixed";
veilCanvas.style.top = "0";
veilCanvas.style.left = "0";
veilCanvas.style.width = "100%";
veilCanvas.style.height = "100%";
veilCanvas.style.pointerEvents = "none";
veilCanvas.style.zIndex = "1";

// -------------------------------
// Size
// -------------------------------
let veilWidth, veilHeight;

function resizeVeil() {
  veilWidth = veilCanvas.width = window.innerWidth;
  veilHeight = veilCanvas.height = window.innerHeight;
}
resizeVeil();
window.addEventListener("resize", resizeVeil);

// ===============================
// Helper function: get current theme color
// ===============================
function getVeilColor() {
  return getComputedStyle(document.body)
    .getPropertyValue("--veil-color")
    .trim() || "rgba(180,180,180,0.6)";
}


// -------------------------------
// Cursor tracking
// -------------------------------
const veilMouse = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
};

window.addEventListener("mousemove", e => {
  veilMouse.x = e.clientX;
  veilMouse.y = e.clientY;
});

// -------------------------------
// Veil points (memory trail)
// -------------------------------
const LAYER_COUNT = 10;
const veilLayers = [];

function initVeil() {
  veilLayers.length = 0;
  for (let i = 0; i < LAYER_COUNT; i++) {
    veilLayers.push({
      x: veilMouse.x,
      y: veilMouse.y,
      vx: 0,
      vy: 0
    });
  }
}

// -------------------------------
// Animation Control
// -------------------------------
function startVeil() {
  if (veilAnimationId) return;

  initVeil();

  function animate() {
    veilCtx.clearRect(0, 0, veilWidth, veilHeight);

  veilCtx.fillStyle = getVeilColor();


    veilLayers.forEach((layer, i) => {
      const targetX = i === 0 ? veilMouse.x : veilLayers[i - 1].x;
      const targetY = i === 0 ? veilMouse.y : veilLayers[i - 1].y;

      const dx = targetX - layer.x;
      const dy = targetY - layer.y;

      // Inertia physics (this is the magic)
      layer.vx += dx * 0.08;
      layer.vy += dy * 0.08;

      layer.vx *= 0.72;
      layer.vy *= 0.72;

      layer.x += layer.vx;
      layer.y += layer.vy;

      const alpha = 1 - i / LAYER_COUNT;

       // -------------------------------
  // FIX: compute color with alpha dynamically
  // -------------------------------
  const baseColor = getVeilColor(); // <-- get CSS variable
  // convert rgba string to insert alpha
  const colorWithAlpha = baseColor.replace(/rgba?\(([^)]+)\)/, `rgba($1, ${alpha * 0.6})`);

  veilCtx.beginPath();
  veilCtx.arc(layer.x, layer.y, 6 + i * 0.6, 0, Math.PI * 2);
  veilCtx.fillStyle = colorWithAlpha; // <-- use computed color
  veilCtx.fill();
});

    veilAnimationId = requestAnimationFrame(animate);
  }

  animate();
}

function stopVeil() {
  cancelAnimationFrame(veilAnimationId);
  veilAnimationId = null;
  veilCtx.clearRect(0, 0, veilWidth, veilHeight);
}

// -------------------------------
// Expose API (same pattern)
// -------------------------------
window.NoirVeil = {
  start: startVeil,
  stop: stopVeil
};

console.log("cursor-veil.js loaded");

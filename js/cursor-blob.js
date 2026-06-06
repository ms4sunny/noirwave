// ===============================
// Organic Blob Cursor Animation
// NoirWave Compatible Version
// Engine v2.6 — Turbine Rotation & Rubber Ring Overextension
// ===============================

(function () {
  let blobAnimationId = null;
  let pullStrength = 0; // elastic drag energy

  // Canvas
  const blobCanvas = document.getElementById("cursorBlobCanvas") || document.createElement("canvas");
  const blobCtx = blobCanvas.getContext("2d");

  if (!document.getElementById("cursorBlobCanvas")) {
    blobCanvas.id = "cursorBlobCanvas";
    document.body.appendChild(blobCanvas);

    // Styling
    blobCanvas.style.position = "fixed";
    blobCanvas.style.top = "0";
    blobCanvas.style.left = "0";
    blobCanvas.style.width = "100%";
    blobCanvas.style.height = "100%";
    blobCanvas.style.pointerEvents = "none";
    blobCanvas.style.zIndex = "1";
  }

  // Size
  let blobWidth, blobHeight;

  function resizeBlob() {
    blobWidth = blobCanvas.width = window.innerWidth;
    blobHeight = blobCanvas.height = window.innerHeight;
  }
  resizeBlob();
  window.addEventListener("resize", resizeBlob);

  // -------------------------------
  // Unified Input Tracking (Mouse + Touch)
  // -------------------------------
  const blobMouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  };

  window.addEventListener("mousemove", e => {
    blobMouse.x = e.clientX;
    blobMouse.y = e.clientY;
  });

  window.addEventListener("touchstart", e => {
    if (e.touches.length > 0) {
      blobMouse.x = e.touches[0].clientX;
      blobMouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener("touchmove", e => {
    if (e.touches.length > 0) {
      blobMouse.x = e.touches[0].clientX;
      blobMouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  // Your exact original state registers
  const blob = {
    x: blobMouse.x,
    y: blobMouse.y,
    radius: 28,
    points: 18,
    noise: 6,
    angle: 0,
    relaxation: 0 
  };

  // ===============================
  // Animation Control
  // ===============================
  function startBlob() {
    if (blobAnimationId) return;

    let lastX = blob.x;
    let lastY = blob.y;
    let stretchEnergy = 0;

    function animate() {
      blobCtx.clearRect(0, 0, blobWidth, blobHeight);

      // Smooth positional follow (slightly slower = more elegance)
      blob.x += (blobMouse.x - blob.x) * 0.16;
      blob.y += (blobMouse.y - blob.y) * 0.16;

      // Velocity
      const vx = blob.x - lastX;
      const vy = blob.y - lastY;
      const speed = Math.sqrt(vx * vx + vy * vy);

      lastX = blob.x;
      lastY = blob.y;

      // Elastic energy (fast build, slow decay)
      stretchEnergy += speed * 1.9;
      stretchEnergy *= 0.78;

      // Relaxation memory (slow return to base shape)
      blob.relaxation += (stretchEnergy - blob.relaxation) * 0.08;
      blob.relaxation *= 0.92;

      // ENHANCEMENT 1: Stretched Rubber Ring Overextension
      // Increased max limit from 38 to 55 to let it pull out into a sleek dramatic ring when whipped fast
      const stretchAmount = Math.min(blob.relaxation, 55);
      const direction = Math.atan2(vy, vx);

      blobCtx.beginPath();

      for (let i = 0; i <= blob.points; i++) {
        const angle = (Math.PI * 2 / blob.points) * i;

        // Directional stretch
        const directionalStretch = Math.cos(angle - direction) * stretchAmount;

        // Back compression (rubber tension)
        const compression = Math.cos(angle - direction + Math.PI) * stretchAmount * 0.45;

        // UNTOUCHED: Your original beautiful 3-wave signature orbit calculation
        const wobble =
          Math.sin(angle * 3 + blob.angle) * blob.noise * 1.6 +
          Math.sin(blob.angle * 0.7) * 1.4;

        const radius =
          blob.radius +
          directionalStretch -
          compression +
          wobble;

        const x = blob.x + Math.cos(angle) * radius;
        const y = blob.y + Math.sin(angle) * radius;

        if (i === 0) blobCtx.moveTo(x, y);
        else blobCtx.lineTo(x, y);
      }

      blobCtx.closePath();

      const styles = getComputedStyle(document.body);
      blobCtx.fillStyle = styles.getPropertyValue("--blob-fill").trim() || "rgba(255, 255, 255, 0.1)";
      blobCtx.strokeStyle = styles.getPropertyValue("--blob-stroke").trim() || "#00ffcc";

      blobCtx.lineWidth = 2;
      blobCtx.fill();
      blobCtx.stroke();

      // ENHANCEMENT 2: Helicopter Turbine Spin Velocity
      // Your original base step was 0.035. Now, we add a multiplier scaled by speed (speed * 0.006) 
      // Fast swipes make the 3 original edges instantly rotate at hyper-speed like a motorized fan!
      blob.angle += 0.035 + (stretchAmount * 0.0015) + (speed * 0.006);

      blobAnimationId = requestAnimationFrame(animate);
    }

    animate();
  }

  function stopBlob() {
    cancelAnimationFrame(blobAnimationId);
    blobAnimationId = null;
    blobCtx.clearRect(0, 0, blobWidth, blobHeight);
  }

  // ===============================
  // Expose API
  // ===============================
  window.NoirBlob = {
    start: startBlob,
    stop: stopBlob
  };
})();
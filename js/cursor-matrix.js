// ===============================
// Quantum Laser Mesh — High-Visibility Ribbon Edition
// NoirWave — Amplified Gradient Planes & Dense Kinetic Shears
// Preserved: Exact Tension Mechanics, Kinetic Telemetry, and Opacity Curves
// ===============================

(function () {
  let meshAnimationId = null;

  const matrixCanvas = document.getElementById("magneticBalls") || document.createElement("canvas");
  const ctx = matrixCanvas.getContext("2d");

  let width, height;
  
  // Physics Configurations
  const TENSION = 0.12;       
  const DAMPING = 0.80;       
  const MAX_LINES = 4;        

  let particles = [];
  const MAX_PARTICLES = 80;

  function resize() {
    width = matrixCanvas.width = window.innerWidth;
    height = matrixCanvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);

  function getThemeColor() {
    return getComputedStyle(document.body).getPropertyValue("--veil-color").trim() || 
           getComputedStyle(document.body).getPropertyValue("--accent-color").trim() || 
           "#00ff77";
  }

  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false };
  let history = [];

  for (let i = 0; i < MAX_LINES; i++) {
    history.push({ x: mouse.x, y: mouse.y, vx: 0, vy: 0 });
  }

  // -------------------------------
  // Unified Input Event Listeners
  // -------------------------------

  // Desktop Mouse Tracking
  window.addEventListener("mousemove", e => {
    mouse.active = true;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("mouseleave", () => {
    mouse.active = false;
  });

  // Mobile Touch Tracking Integrations
  window.addEventListener("touchstart", e => {
    if (e.touches.length > 0) {
      mouse.active = true;
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener("touchmove", e => {
    if (e.touches.length > 0) {
      mouse.active = true;
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener("touchend", () => {
    mouse.active = false;
  });

  window.addEventListener("touchcancel", () => {
    mouse.active = false;
  });

  // -------------------------------
  // Particle Spawning Physics
  // -------------------------------
  function spawnShearParticles(x, y, vx, vy, count) {
    const speed = Math.sqrt(vx * vx + vy * vy);
    if (speed < 5) return;

    for (let i = 0; i < count; i++) {
      if (particles.length >= MAX_PARTICLES) particles.shift();

      const angle = Math.atan2(vy, vx) + Math.PI + (Math.random() - 0.5) * 0.5;
      const pSpeed = Math.random() * speed * 0.2;

      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * pSpeed,
        vy: Math.sin(angle) * pSpeed,
        life: 1.0,
        decay: 0.04 + Math.random() * 0.04,
        size: 1 + Math.random() * 1.5
      });
    }
  }

  // -------------------------------
  // Animation System Loop
  // -------------------------------
  function startMesh() {
    if (meshAnimationId) return;
    resize();

    function animate() {
      ctx.clearRect(0, 0, width, height);
      const color = getThemeColor();

      let targetX = mouse.x;
      let targetY = mouse.y;

      // --- 1. RENDER AMPLIFIED VOLUMETRIC RIBBONS ---
      if (mouse.active && history.length > 1) {
        ctx.save();
        for (let i = history.length - 1; i > 0; i--) {
          const ptA = history[i];
          const ptB = history[i - 1];

          const visibilityAlpha = 0.22 * ((MAX_LINES - i) / MAX_LINES);
          ctx.fillStyle = color;
          ctx.globalAlpha = visibilityAlpha; 

          // Horizontal Ribbon Sheath
          ctx.beginPath();
          ctx.moveTo(0, ptA.y);
          ctx.quadraticCurveTo(mouse.x, ptA.y + (ptA.vy * 0.4), width, ptA.y);
          ctx.lineTo(width, ptB.y);
          ctx.quadraticCurveTo(mouse.x, ptB.y + (ptB.vy * 0.4), 0, ptB.y);
          ctx.closePath();
          ctx.fill();
          ctx.fill(); 

          // Vertical Ribbon Sheath
          ctx.beginPath();
          ctx.moveTo(ptA.x, 0);
          ctx.quadraticCurveTo(ptA.x + (ptA.vx * 0.4), mouse.y, ptA.x, height);
          ctx.lineTo(ptB.x, height);
          ctx.quadraticCurveTo(ptB.x + (ptB.vx * 0.4), mouse.y, ptB.x, 0);
          ctx.closePath();
          ctx.fill();
          ctx.fill();
        }
        ctx.restore();
      }

      // --- 2. UPDATE AND RENDER GRID STRANDS ---
      history.forEach((pt, index) => {
        const ax = (targetX - pt.x) * TENSION;
        const ay = (targetY - pt.y) * TENSION;

        pt.vx += ax;
        pt.vy += ay;
        pt.vx *= DAMPING;
        pt.vy *= DAMPING;

        pt.x += pt.vx;
        pt.y += pt.vy;

        targetX = pt.x;
        targetY = pt.y;

        if (mouse.active) {
          const alphaRatio = (MAX_LINES - index) / MAX_LINES;
          const velocityDist = Math.sqrt(pt.vx * pt.vx + pt.vy * pt.vy);

          if (index === 0 && velocityDist > 5) {
            spawnShearParticles(pt.x, pt.y, pt.vx, pt.vy, Math.floor(velocityDist * 0.12));
          }

          ctx.save();
          ctx.strokeStyle = color;
          ctx.shadowColor = color;
          
          ctx.lineWidth = index === 0 ? 2.2 : 0.9 * alphaRatio;
          ctx.globalAlpha = index === 0 ? 0.85 : 0.35 * alphaRatio;
          ctx.shadowBlur = index === 0 ? 12 : 3 * alphaRatio;

          const flickerOffset = index > 0 && Math.random() < 0.3 ? (Math.random() - 0.5) * 2.5 : 0;

          // Curve Crosshairs
          ctx.beginPath();
          ctx.moveTo(0, pt.y + flickerOffset);
          ctx.quadraticCurveTo(mouse.x, pt.y + (pt.vy * 0.4) + flickerOffset, width, pt.y + flickerOffset);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(pt.x + flickerOffset, 0);
          ctx.quadraticCurveTo(pt.x + (pt.vx * 0.4) + flickerOffset, mouse.y, pt.x + flickerOffset, height);
          ctx.stroke();

          // Coordinate Telemetry Displays
          if (index === 0 && velocityDist > 2) {
            ctx.fillStyle = color;
            ctx.font = "bold 9px monospace";
            ctx.globalAlpha = 0.6;
            ctx.fillText(`Y:${Math.floor(pt.y)}`, width - 45, pt.y - 6);
            ctx.fillText(`X:${Math.floor(pt.x)}`, pt.x + 6, height - 12);
          }

          // Matrix Center Node
          if (index === 0) {
            ctx.fillStyle = "#ffffff";
            ctx.globalAlpha = 1.0;
            ctx.shadowBlur = 16;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
            ctx.fill();
          }
          
          ctx.restore();
        }
      });

      // --- 3. UPDATE AND RENDER PARTICLES ---
      ctx.save();
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95;
        p.vy *= 0.95;

        ctx.fillStyle = color;
        ctx.globalAlpha = p.life * 0.8;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      meshAnimationId = requestAnimationFrame(animate);
    }

    animate();
  }

  function stopMesh() {
    cancelAnimationFrame(meshAnimationId);
    meshAnimationId = null;
    ctx.clearRect(0, 0, width, height);
    particles = [];
  }

  window.NoirFracture = { start: startMesh, stop: stopMesh };
  window.NoirMatrix = window.NoirFracture;

  console.log("Quantum Laser Mesh: High-Visibility Ribbons Armed.");
})();
// ===============================
// Flow Field Cursor Animation
// NoirWave Compatible — Pure Mobile Translation
// Preserved: Standard Arc Engine & Original Vector Weights
// ===============================

(function () {
  let flowAnimationId = null;

  // Canvas Setup
  const flowCanvas = document.getElementById("flowFieldCanvas") || document.createElement("canvas");
  const flowCtx = flowCanvas.getContext("2d");

  if (!document.getElementById("flowFieldCanvas")) {
    flowCanvas.id = "flowFieldCanvas";
    document.body.appendChild(flowCanvas);

    // CRITICAL: Prevent layout blockage, element shifting, or touch blocking
    flowCanvas.style.position = "fixed";
    flowCanvas.style.top = "0";
    flowCanvas.style.left = "0";
    flowCanvas.style.width = "100%";
    flowCanvas.style.height = "100%";
    flowCanvas.style.pointerEvents = "none";
    flowCanvas.style.zIndex = "1";
  }

  let width, height;
  let time = 0;

  const PARTICLE_COUNT = 300;
  const GRID_SIZE = 40;
  let particles = [];

  // Unified Input Tracking (Mouse + Touch)
  let flowMouse = { x: null, y: null };

  // Desktop Tracking
  window.addEventListener("mousemove", e => {
    flowMouse.x = e.clientX;
    flowMouse.y = e.clientY;
  });

  // Mobile Touch Tracking
  window.addEventListener("touchstart", e => {
    if (e.touches.length > 0) {
      flowMouse.x = e.touches[0].clientX;
      flowMouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener("touchmove", e => {
    if (e.touches.length > 0) {
      flowMouse.x = e.touches[0].clientX;
      flowMouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener("touchend", () => {
    flowMouse.x = null;
    flowMouse.y = null;
  });

  function getFlowParticleColor() {
    return getComputedStyle(document.body)
      .getPropertyValue("--flow-particle-color")
      .trim() || "rgba(255, 255, 255, 0.7)";
  }

  // -------------------------------
  // Resize
  // -------------------------------
  function resize() {
    width = flowCanvas.width = window.innerWidth;
    height = flowCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  // -------------------------------
  // Flow Field Function
  // -------------------------------
  function flowAngle(x, y) {
    return (
      Math.sin(x * 0.01 + time) +
      Math.cos(y * 0.01 + time)
    );
  }

  // -------------------------------
  // Particle
  // -------------------------------
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = 0;
      this.vy = 0;
      this.speed = 0.5 + Math.random() * 0.5;
    }

    update() {
      const angle = flowAngle(this.x, this.y);

      // Flow force
      this.vx += Math.cos(angle) * 0.2;
      this.vy += Math.sin(angle) * 0.2;

      // Cursor repulsion
      if (flowMouse.x !== null) {
        const dx = this.x - flowMouse.x;
        const dy = this.y - flowMouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120 && dist > 0.1) {
          const force = (120 - dist) / 120;
          this.vx += (dx / dist) * force * 2.2;
          this.vy += (dy / dist) * force * 2.2;
        }
      }

      // Damping
      this.vx *= 0.94;
      this.vy *= 0.94;

      // Move
      this.x += this.vx * this.speed;
      this.y += this.vy * this.speed;

      // Wrap edges
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }

    draw() {
      flowCtx.beginPath();
      flowCtx.arc(this.x, this.y, 2.3, 0, Math.PI * 2);
      flowCtx.fill();
    }
  }

  // -------------------------------
  // Init
  // -------------------------------
  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  // -------------------------------
  // Animation Control
  // -------------------------------
  function startFlow() {
    if (flowAnimationId) return;

    // Safety Fix: Only spin up allocation layout arrays inside structural launch scope
    if (particles.length === 0) {
      initParticles();
    }

    function animate() {
      time += 0.007;

      // Clear canvas every frame
      flowCtx.clearRect(0, 0, width, height);

      // ALWAYS re-read theme color
      flowCtx.fillStyle = getFlowParticleColor();

      // Update + draw particles
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      flowAnimationId = requestAnimationFrame(animate);
    }

    animate();
  }

  function stopFlow() {
    cancelAnimationFrame(flowAnimationId);
    flowAnimationId = null;
    flowCtx.clearRect(0, 0, width, height);
    particles = []; // Fully clean allocation footprints
  }

  // -------------------------------
  // Expose API
  // -------------------------------
  window.NoirFlow = {
    start: startFlow,
    stop: stopFlow
  };
})();
// ===============================
// Magnetic Balls Cursor Animation (Engine v2.1)
// NoirWave — Smooth Invisible Magnetism & Mobile Touch Logic
// ===============================

(function () {
  let ballsAnimationId = null;

  // Canvas
  const canvas = document.getElementById("magneticBalls") || document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Size
  let w, h;
  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  // -------------------------------
  // Mobile Adaptations & Throttling
  // -------------------------------
  const isMobile = window.matchMedia("(max-width: 768px)").matches || ('ontouchstart' in window);
  
  // Performance Throttle: 4 elegant balls on phones, 6 on desktop
  const BALL_COUNT = isMobile ? 4 : 6;
  const SIZE_MULTIPLIER = isMobile ? 0.65 : 1.0; 
  const balls = [];

  // -------------------------------
  // Unified Input Tracking (Mouse + Touch)
  // -------------------------------
  let mouse = { x: null, y: null, active: false };

  // Desktop Events
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

  // Mobile Touch Events
  window.addEventListener("touchstart", e => {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
      mouse.active = true;
    }
  }, { passive: true });

  window.addEventListener("touchmove", e => {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener("touchend", () => {
    mouse.active = false;
    mouse.x = null;
    mouse.y = null;
  });

  // -------------------------------
  // Balls Architecture Initializer
  // -------------------------------
  function initBalls() {
    balls.length = 0;
    for (let i = 0; i < BALL_COUNT; i++) {
      balls.push({
        x: w / 2 + (Math.random() - 0.5) * 120,
        y: h / 2 + (Math.random() - 0.5) * 120,
        vx: 0,
        vy: 0,
        size: (15 + Math.random() * 8) * SIZE_MULTIPLIER
      });
    }
  }

  // -------------------------------
  // Premium Liquid Chrome Render Loop
  // -------------------------------
  function drawBall(x, y, r) {
    const orbColor = getComputedStyle(document.documentElement).getPropertyValue("--orb-color").trim() || "#00ffcc";

    // 3D specular glare gradient mechanics
    const gradient = ctx.createRadialGradient(
      x - r * 0.35,
      y - r * 0.35,
      r * 0.05,
      x,
      y,
      r
    );

    // Blinding white-hot reflection peak that transitions smoothly into dark shade edges
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.2, orbColor);
    gradient.addColorStop(0.5, "rgba(0, 0, 0, 0.15)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.6)");

    ctx.save();
    // Add a native back-glow aura to each ball
    ctx.shadowBlur = 15;
    ctx.shadowColor = orbColor;

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // -------------------------------
  // Smooth Magnetic Loop Execution
  // -------------------------------
  function startBalls() {
    if (ballsAnimationId) return;

    initBalls();
    balls.forEach(b => { b.vx = 0; b.vy = 0; });
    mouse.active = false;

    function animate() {
      ctx.clearRect(0, 0, w, h);

      balls.forEach((b, index) => {
        // SMOOTH INVISIBLE FORCE FIELD: Balanced pull value gives a floating, premium delay
        if (mouse.active) {
          const dx = mouse.x - b.x;
          const dy = mouse.y - b.y;

          b.vx += dx * 0.012;
          b.vy += dy * 0.012;
        }

        // Magnetized inter-ball cluster logic
        for (let j = 0; j < balls.length; j++) {
          if (j === index) continue;
          const o = balls[j];
          const dx = o.x - b.x;
          const dy = o.y - b.y;
          
          b.vx += dx * 0.001;
          b.vy += dy * 0.001;
        }

        // Damping set to 0.93 allows them to drift smoothly with sleek fluid momentum
        b.vx *= 0.93;
        b.vy *= 0.93;

        // Apply spatial translations
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
    ctx.clearRect(0, 0, w, h);
    mouse.active = false;
  }

  // API Export
  window.NoirBalls = {
    start: startBalls,
    stop: stopBalls
  };
})();
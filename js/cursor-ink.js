// ===============================
// Adaptive Industrial Grinder Engine (V3.5)
// NoirWave — Blackbody Thermal Decay with Multi-Theme Contrast Mechanics
// Preserved: Exact Spark Metrics, Thermal Curves, and Layout Luminance Checks
// ===============================

(function () {
  let scratchAnimationId = null;

  const canvas = document.getElementById("magneticBalls") || document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  let width, height;
  let sparks = [];       
  let activeTrail = null; 

  const SPARK_FRICTION = 0.97; 
  const SPARK_GRAVITY = 0.22;  

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);

  // -------------------------------
  // Smart Environment Contrast Detection
  // -------------------------------
  function isLightTheme() {
    const bg = window.getComputedStyle(document.body).backgroundColor;
    if (!bg) return false;
    
    const rgb = bg.match(/\d+/g);
    if (rgb && rgb.length >= 3) {
      const r = parseInt(rgb[0]);
      const g = parseInt(rgb[1]);
      const b = parseInt(rgb[2]);
      const luminance = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
      return luminance > 160; 
    }
    return false;
  }

  const mouse = { x: 0, y: 0, lastX: 0, lastY: 0, speed: 0, isPressed: false };

  // -------------------------------
  // Core Spark Engine Trigger
  // -------------------------------
  function handleInputMove(clientX, clientY) {
    mouse.lastX = mouse.x;
    mouse.lastY = mouse.y;
    mouse.x = clientX;
    mouse.y = clientY;

    const dx = mouse.x - mouse.lastX;
    const dy = mouse.y - mouse.lastY;
    mouse.speed = Math.sqrt(dx * dx + dy * dy);

    if (mouse.speed > 1) {
      const sparkCount = mouse.isPressed ? Math.min(mouse.speed * 2.2, 45) : Math.min(mouse.speed * 0.5, 8);
      const isLight = isLightTheme();

      for (let i = 0; i < sparkCount; i++) {
        const randomAngle = Math.random() * Math.PI * 2;
        const launchVelocity = 10 + Math.random() * 22;

        let primaryColor, particleSize;

        if (isLight) {
          primaryColor = Math.random() < 0.45 ? "#ffaa00" : (Math.random() < 0.8 ? "#ff3300" : "#ffffff");
          particleSize = Math.random() * 4.0 + 2.5; 
        } else {
          primaryColor = Math.random() < 0.55 ? "#ffffff" : "#fff199";
          particleSize = Math.random() * 3.5 + 2.0;
        }

        sparks.push({
          x: mouse.x,
          y: mouse.y,
          vx: Math.cos(randomAngle) * launchVelocity,
          vy: Math.sin(randomAngle) * launchVelocity,
          life: 1.0,
          decay: 0.015 + Math.random() * 0.02, 
          size: particleSize,
          color: primaryColor
        });
      }

      if (mouse.isPressed && activeTrail) {
        activeTrail.points.push({ x: mouse.x, y: mouse.y });
      }
    }
  }

  function handleInputDown(clientX, clientY) {
    mouse.isPressed = true;
    activeTrail = {
      points: [{ x: clientX, y: clientY }],
      heat: 1.0, 
      maxThickness: 14
    };
  }

  function handleInputUp() {
    mouse.isPressed = false;
  }

  // -------------------------------
  // Event Listeners (Mouse + Touch)
  // -------------------------------
  
  // Desktop Mouse
  window.addEventListener("mousemove", e => {
    handleInputMove(e.clientX, e.clientY);
  });
  window.addEventListener("mousedown", e => {
    handleInputDown(e.clientX, e.clientY);
  });
  window.addEventListener("mouseup", handleInputUp);

  // Mobile Touch Unified Integrations
  window.addEventListener("touchstart", e => {
    if (e.touches.length > 0) {
      // Warm up coordinates to instantly jump to touch point without trailing streak anomalies
      mouse.x = mouse.lastX = e.touches[0].clientX;
      mouse.y = mouse.lastY = e.touches[0].clientY;
      handleInputDown(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  window.addEventListener("touchmove", e => {
    if (e.touches.length > 0) {
      handleInputMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  window.addEventListener("touchend", handleInputUp);
  window.addEventListener("touchcancel", handleInputUp);

  // -------------------------------
  // Adaptive Blackbody Color Engine
  // -------------------------------
  function getThermalColor(heat, isLight) {
    let r, g, b, alpha;

    if (heat > 0.7) {
      r = 255;
      g = Math.floor(180 + 75 * ((heat - 0.7) / 0.3));
      b = isLight ? Math.floor(20 + 120 * ((heat - 0.7) / 0.3)) : Math.floor(50 + 205 * ((heat - 0.7) / 0.3));
      alpha = 1.0;
    } else if (heat > 0.4) {
      r = 255;
      g = Math.floor(70 + 110 * ((heat - 0.4) / 0.3));
      b = Math.floor(10 + 40 * ((heat - 0.4) / 0.3));
      alpha = 1.0;
    } else if (heat > 0.15) {
      const t = (heat - 0.15) / 0.25;
      r = Math.floor(130 + 125 * t);
      g = Math.floor(10 + 60 * t);
      b = Math.floor(10 * t);
      alpha = isLight ? 0.6 + 0.4 * t : 0.4 + 0.6 * t; 
    } else {
      const t = heat / 0.15;
      if (isLight) {
        r = Math.floor(40 + 35 * t);
        g = Math.floor(40 + 10 * t);
        b = Math.floor(45 + 10 * t);
        alpha = 0.5 * t;
      } else {
        r = Math.floor(35 * t);
        g = Math.floor(10 * t);
        b = Math.floor(10 * t);
        alpha = t;
      }
    }

    return { stroke: `rgba(${r}, ${g}, ${b}, ${alpha})`, r, g, b };
  }

  // -------------------------------
  // Animation Core Loop
  // -------------------------------
  function animate() {
    ctx.clearRect(0, 0, width, height);
    const isLight = isLightTheme();

    // --- LAYER 1: SOLID ADAPTIVE MOLTEN TRAIL ---
    if (activeTrail) {
      activeTrail.heat -= 0.005;

      if (activeTrail.heat <= 0) {
        activeTrail = null;
      } else if (activeTrail.points.length > 1) {
        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        const thermal = getThermalColor(activeTrail.heat, isLight);

        if (isLight) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = "rgba(40, 10, 0, 0.45)";
        } else {
          if (activeTrail.heat > 0.4) {
            ctx.shadowBlur = activeTrail.heat * 24;
            ctx.shadowColor = `rgb(${thermal.r}, ${Math.floor(thermal.g * 0.5)}, 0)`;
          }
        }

        ctx.strokeStyle = thermal.stroke;
        ctx.lineWidth = activeTrail.maxThickness * (0.2 + activeTrail.heat * 0.8);

        ctx.beginPath();
        ctx.moveTo(activeTrail.points[0].x, activeTrail.points[0].y);
        for (let i = 1; i < activeTrail.points.length; i++) {
          ctx.lineTo(activeTrail.points[i].x, activeTrail.points[i].y);
        }
        ctx.stroke();
        ctx.restore();
      }
    }

    // --- LAYER 2: HIGH-VELOCITY ADAPTIVE SPARKS ---
    ctx.save();
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.life -= s.decay;

      if (s.life <= 0) {
        sparks.splice(i, 1);
        continue;
      }

      s.x += s.vx;
      s.y += s.vy;
      s.vx *= SPARK_FRICTION;
      s.vy *= SPARK_FRICTION;
      s.vy += SPARK_GRAVITY; 

      ctx.lineWidth = s.size * s.life;
      ctx.strokeStyle = s.color;
      ctx.globalAlpha = s.life;
      
      if (isLight) {
        ctx.shadowBlur = 4;
        ctx.shadowColor = "#ff4400";
      } else {
        ctx.shadowBlur = 6;
        ctx.shadowColor = s.color;
      }

      ctx.beginPath();
      window.NoirInk = { start: startEngine, stop: stopEngine };
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - (s.vx * 0.22), s.y - (s.vy * 0.22));
      ctx.stroke();
    }
    ctx.restore();

    scratchAnimationId = requestAnimationFrame(animate);
  }

  function startEngine() {
    if (scratchAnimationId) return;
    resize();
    scratchAnimationId = requestAnimationFrame(animate);
  }

  function stopEngine() {
    cancelAnimationFrame(scratchAnimationId);
    scratchAnimationId = null;
    sparks = [];
    activeTrail = null;
    ctx.clearRect(0, 0, width, height);
  }

  window.NoirInk = { start: startEngine, stop: stopEngine };
})();
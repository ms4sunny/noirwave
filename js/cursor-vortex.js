// ===============================
// Vortex Ring Cursor Animation (High-Intensity Weight & Flash)
// NoirWave — Mobile Integrated & Polished High-Contrast Render
// ===============================

(function () {
  let vortexAnimationId = null;

  // -------------------------------
  // Canvas Setup
  // -------------------------------
  const vortexCanvas = document.getElementById("cursorVortexCanvas") || document.createElement("canvas");
  const vortexCtx = vortexCanvas.getContext("2d");

  if (!document.getElementById("cursorVortexCanvas")) {
    vortexCanvas.id = "cursorVortexCanvas";
    document.body.appendChild(vortexCanvas);

    vortexCanvas.style.position = "fixed";
    vortexCanvas.style.top = "0";
    vortexCanvas.style.left = "0";
    vortexCanvas.style.width = "100%";
    vortexCanvas.style.height = "100%";
    vortexCanvas.style.pointerEvents = "none";
    vortexCanvas.style.zIndex = "1";
  }

  let vortexWidth, vortexHeight;

  function resizeVortex() {
    vortexWidth = vortexCanvas.width = window.innerWidth;
    vortexHeight = vortexCanvas.height = window.innerHeight;
  }
  resizeVortex();
  window.addEventListener("resize", resizeVortex);

  // -------------------------------
  // Color Grabber
  // -------------------------------
  function getVortexColor() {
    return getComputedStyle(document.body).getPropertyValue("--veil-color").trim() || 
           getComputedStyle(document.body).getPropertyValue("--accent-color").trim() || 
           "rgba(255, 255, 255, 0.8)";
  }

  // -------------------------------
  // Unified Input Tracking (Mouse + Touch)
  // -------------------------------
  const vortexMouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    lastX: window.innerWidth / 2,
    lastY: window.innerHeight / 2,
    speed: 0
  };

  // Desktop Listener
  window.addEventListener("mousemove", e => {
    vortexMouse.x = e.clientX;
    vortexMouse.y = e.clientY;
  });

  // Mobile Touch Listeners
  window.addEventListener("touchstart", e => {
    if (e.touches.length > 0) {
      vortexMouse.x = vortexMouse.lastX = e.touches[0].clientX;
      vortexMouse.y = vortexMouse.lastY = e.touches[0].clientY;
      
      // Tap triggers an instant camera-strobe pop on mobile layout structures
      if (pulseProgress >= 1.0) {
        pulseProgress = 0.0;
        pulseIntensity = 1.1; 
      }
    }
  }, { passive: true });

  window.addEventListener("touchmove", e => {
    if (e.touches.length > 0) {
      vortexMouse.x = e.touches[0].clientX;
      vortexMouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  // -------------------------------
  // Configuration Deck & Performance Throttle
  // -------------------------------
  const isMobileDevice = window.matchMedia("(max-width: 768px)").matches || ('ontouchstart' in window);

  // Throttling point allocation profiles to protect weak mobile CPUs
  const TOTAL_POINTS = isMobileDevice ? 10 : 16;
  const BASE_RADIUS = isMobileDevice ? 20 : 30; 
  const ringPoints = [];
  let idleTimer = 0; 

  // Shockwave Pulse Variables
  let pulseProgress = 1.0; 
  let pulseIntensity = 0;

  function initVortex() {
    ringPoints.length = 0;
    for (let i = 0; i < TOTAL_POINTS; i++) {
      const angle = (i / TOTAL_POINTS) * Math.PI * 2;
      ringPoints.push({
        x: vortexMouse.x + Math.cos(angle) * BASE_RADIUS,
        y: vortexMouse.y + Math.sin(angle) * BASE_RADIUS,
        vx: 0,
        vy: 0,
        angle: angle,
        pulseOffset: Math.random() * Math.PI
      });
    }
    pulseProgress = 1.0;
    pulseIntensity = 0;
  }

  // -------------------------------
  // Animation System Loop
  // -------------------------------
  function startVortex() {
    if (vortexAnimationId) return;

    initVortex();

    function animate() {
      vortexCtx.clearRect(0, 0, vortexWidth, vortexHeight);
      const baseColor = getVortexColor();
      
      // Calculate input velocity profile
      const dxMouse = vortexMouse.x - vortexMouse.lastX;
      const dyMouse = vortexMouse.y - vortexMouse.lastY;
      vortexMouse.speed = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
      
      vortexMouse.lastX = vortexMouse.x;
      vortexMouse.lastY = vortexMouse.y;

      // Lowered threshold for easy shockwaves
      if (vortexMouse.speed > 8 && pulseProgress >= 1.0) {
        pulseProgress = 0.0; 
        pulseIntensity = 1.0; 
      }

      // Advance shockwave propagation timing
      if (pulseProgress < 1.0) {
        pulseProgress += 0.07; 
      }

      idleTimer += 0.04;

      // --- ORIGINAL PHYSICAL INERTIA WEIGHT LOOPS ---
      ringPoints.forEach((p) => {
        const breathWave = Math.sin(idleTimer + p.pulseOffset * 0.5);
        const currentTargetRadius = BASE_RADIUS + (breathWave * 12) + (vortexMouse.speed * 2.5);
        const activeAngle = p.angle + (idleTimer * 0.12);

        const idealX = vortexMouse.x + Math.cos(activeAngle) * currentTargetRadius;
        const idealY = vortexMouse.y + Math.sin(activeAngle) * currentTargetRadius;

        const dx = idealX - p.x;
        const dy = idealY - p.y;

        p.vx += dx * 0.015; 
        p.vy += dy * 0.015;
        p.vx *= 0.92; 
        p.vy *= 0.92;

        p.x += p.vx;
        p.y += p.vy;
      });

      // --- RENDERING LAYER 1: JELLY RIBBON ---
      vortexCtx.save();
      vortexCtx.beginPath();
      vortexCtx.strokeStyle = baseColor;
      vortexCtx.globalAlpha = 0.35;
      vortexCtx.lineWidth = 2.5; 

      for (let i = 0; i < TOTAL_POINTS; i++) {
        const current = ringPoints[i];
        const next = ringPoints[(i + 1) % TOTAL_POINTS];
        
        const midX = (current.x + next.x) / 2;
        const midY = (current.y + next.y) / 2;
        
        if (i === 0) {
          vortexCtx.moveTo(midX, midY);
        } else {
          vortexCtx.quadraticCurveTo(current.x, current.y, midX, midY);
        }
      }
      vortexCtx.closePath();
      vortexCtx.stroke();
      vortexCtx.restore();

      // --- RENDERING LAYER 2: POLISHED STROBE SHOCKWAVES & HIGH-GLOW NODES ---
      ringPoints.forEach((p) => {
        const breathWave = Math.sin(idleTimer + p.pulseOffset * 0.5);
        
        const dxCenter = p.x - vortexMouse.x;
        const dyCenter = p.y - vortexMouse.y;
        const nodeDistance = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);

        const waveDistanceTarget = pulseProgress * 250; 
        const distanceDelta = Math.abs(nodeDistance - waveDistanceTarget);
        
        let waveFlashEffect = 0;
        if (pulseProgress < 1.0 && distanceDelta < 60) {
          waveFlashEffect = (1.0 - distanceDelta / 60) * pulseIntensity;
        }

        // 1. Render Structural Anchor Strands (With Camera Flash Bloom)
        vortexCtx.save();
        vortexCtx.beginPath();
        vortexCtx.strokeStyle = baseColor;
        vortexCtx.globalAlpha = 0.06 + (waveFlashEffect * 0.7); 
        vortexCtx.lineWidth = 0.8 + (waveFlashEffect * 3.5);     

        if (waveFlashEffect > 0.1) {
          vortexCtx.shadowBlur = waveFlashEffect * 15;
          vortexCtx.shadowColor = baseColor;
        }

        vortexCtx.moveTo(p.x, p.y);
        vortexCtx.lineTo(vortexMouse.x, vortexMouse.y);
        vortexCtx.stroke();
        vortexCtx.restore();

        // 2. Node Bead Sizing & Composite Layered High-Brightness Polish
        const ringExpansionRatio = nodeDistance / BASE_RADIUS; 
        const baseBeadSize = (3.5 + (breathWave * 1.5)) * (0.85 + ringExpansionRatio * 0.15) + Math.min(vortexMouse.speed * 0.1, 3);
        const finalBeadSize = baseBeadSize + (waveFlashEffect * 8);

        vortexCtx.save();
        
        // Pass A: Outer Blurry Neon Ring
        vortexCtx.shadowBlur = 12 + (waveFlashEffect * 15);
        vortexCtx.shadowColor = baseColor;
        vortexCtx.fillStyle = baseColor;
        vortexCtx.globalAlpha = 0.5 + (breathWave * 0.2) + (waveFlashEffect * 0.5);
        
        vortexCtx.beginPath();
        vortexCtx.arc(p.x, p.y, finalBeadSize, 0, Math.PI * 2);
        vortexCtx.fill();
        
        // Pass B: Inner White-Hot Camera Flash Core Injection
        vortexCtx.shadowBlur = 0; 
        vortexCtx.fillStyle = "#ffffff";
        vortexCtx.globalAlpha = 0.8 + (waveFlashEffect * 0.2); 
        
        vortexCtx.beginPath();
        vortexCtx.arc(p.x, p.y, finalBeadSize * 0.45, 0, Math.PI * 2);
        vortexCtx.fill();

        vortexCtx.restore();
      });

      vortexCtx.globalAlpha = 1.0;
      vortexAnimationId = requestAnimationFrame(animate);
    }

    animate();
  }

  function stopVortex() {
    cancelAnimationFrame(vortexAnimationId);
    vortexAnimationId = null;
    vortexCtx.clearRect(0, 0, vortexWidth, vortexHeight);
  }

  window.NoirVortex = {
    start: startVortex,
    stop: stopVortex
  };

  console.log("High-Intensity Mobile Adaptive Vortex Engine Online.");
})();
// ===============================
// Ultimate Tesla Coil Overload Engine
// NoirWave — Snapbacks, Cascades, & Kinetic Detonations
// ===============================

(function () {
  let rippleAnimationId = null;

  // -------------------------------
  // Canvas Setup — Armed Against DOM Race Conditions
  // -------------------------------
  const rippleCanvas = document.getElementById("cursorRippleCanvas") || document.createElement("canvas");
  const rippleCtx = rippleCanvas.getContext("2d");

  if (!rippleCanvas.id) {
    rippleCanvas.id = "cursorRippleCanvas";
    
    // Fallback if script is loaded in the header before body exists
    if (document.body) {
      document.body.appendChild(rippleCanvas);
    } else {
      window.addEventListener("DOMContentLoaded", () => {
        document.body.appendChild(rippleCanvas);
      });
    }
  }

  rippleCanvas.style.position = "fixed";
  rippleCanvas.style.top = "0";
  rippleCanvas.style.left = "0";
  rippleCanvas.style.width = "100%";
  rippleCanvas.style.height = "100%";
  rippleCanvas.style.pointerEvents = "none";
  rippleCanvas.style.zIndex = "1";

  let rippleWidth, rippleHeight;
  let gridNodes = [];
  const SPACING = 55; 

  function resizeRipple() {
    rippleWidth = rippleCanvas.width = window.innerWidth;
    rippleHeight = rippleCanvas.height = window.innerHeight;
    initGrid();
  }

  function initGrid() {
    gridNodes = [];
    const cols = Math.ceil(rippleWidth / SPACING) + 1;
    const rows = Math.ceil(rippleHeight / SPACING) + 1;

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        gridNodes.push({
          baseX: c * SPACING,
          baseY: r * SPACING,
          x: c * SPACING,
          y: r * SPACING,
          vx: 0,           // Kinetic physical velocities
          vy: 0,
          charge: 0,       
          overload: 0      // Local kinetic energy reservoir storage
        });
      }
    }
  }

  window.addEventListener("resize", resizeRipple);

  function getRippleColor() {
    return getComputedStyle(document.body).getPropertyValue("--veil-color").trim() || 
           getComputedStyle(document.body).getPropertyValue("--accent-color").trim() || 
           "rgba(0, 0, 0, 0.8)";
  }

  function isLightTheme() {
    const bg = window.getComputedStyle(document.body).backgroundColor;
    if (!bg) return false;
    const rgb = bg.match(/\d+/g);
    if (rgb && rgb.length >= 3) {
      const r = parseInt(rgb[0], 10);
      const g = parseInt(rgb[1], 10);
      const b = parseInt(rgb[2], 10);
      return Math.sqrt(0.299*(r*r) + 0.587*(g*g) + 0.114*(b*b)) > 145;
    }
    return false;
  }

  // -------------------------------
  // Mouse & Shockwave Repellers
  // -------------------------------
  const rippleMouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    lastX: window.innerWidth / 2,
    lastY: window.innerHeight / 2,
    speed: 0,
    active: false
  };

  window.addEventListener("mousemove", e => {
    rippleMouse.x = e.clientX;
    rippleMouse.y = e.clientY;
    rippleMouse.active = true;
  });

  // Mobile Touch Integration (Injected directly into input handler block)
  window.addEventListener("touchstart", e => {
    if (e.touches.length > 0) {
      rippleMouse.active = true;
      rippleMouse.x = rippleMouse.lastX = e.touches[0].clientX;
      rippleMouse.y = rippleMouse.lastY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener("touchmove", e => {
    if (e.touches.length > 0) {
      rippleMouse.active = true;
      rippleMouse.x = e.touches[0].clientX;
      rippleMouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener("touchend", () => {
    rippleMouse.active = false;
  });

  window.addEventListener("touchcancel", () => {
    rippleMouse.active = false;
  });

  const shockwaves = []; // Tracks explosion entities triggered by wrist gestures

  // -------------------------------
  // LIGHTNING CORE RENDERING MAPPING
  // -------------------------------
  function drawLightning(startX, startY, endX, endY, color, intensity, speedSurge, lightModeActive, isSubBranch = false) {
    const dx = endX - startX;
    const dy = endY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 4) return;
    
    // Sub-branches are slightly less segmented to optimize processing
    const segmentDivisor = isSubBranch ? 20 : 12;
    const segments = Math.max(3, Math.floor(distance / segmentDivisor));
    
    rippleCtx.beginPath();
    rippleCtx.moveTo(startX, startY);

    const maxSway = ((isSubBranch ? 8 : 14) * intensity) + (speedSurge * 22);

    for (let i = 1; i < segments; i++) {
      const t = i / segments;
      let targetX = startX + dx * t;
      let targetY = startY + dy * t;
      const sway = (Math.random() - 0.5) * maxSway;
      const angle = Math.atan2(dy, dx) + Math.PI / 2;
      
      targetX += Math.cos(angle) * sway;
      targetY += Math.sin(angle) * sway;
      rippleCtx.lineTo(targetX, targetY);
    }

    rippleCtx.lineTo(endX, endY);
    
    let finalLineWidth = (1.2 * intensity) + (speedSurge * 3.0);
    if (isSubBranch) finalLineWidth *= 0.5; // Thinner secondary chains

    // Outer Glow Backing Sleeve
    rippleCtx.strokeStyle = color;
    rippleCtx.lineWidth = finalLineWidth;
    rippleCtx.globalAlpha = isSubBranch ? 0.25 : (lightModeActive ? 0.35 : 0.5 + (speedSurge * 0.4));
    rippleCtx.stroke();

    // Hot Adaptive Wire Center Core
    rippleCtx.strokeStyle = lightModeActive ? color : "#ffffff";
    rippleCtx.lineWidth = (isSubBranch ? 0.4 : 0.6) + (speedSurge * 1.0);
    rippleCtx.globalAlpha = isSubBranch ? 0.5 : 0.95;
    rippleCtx.stroke();
  }

  // -------------------------------
  // Main Animation loop
  // -------------------------------
  function startRipple() {
    if (rippleAnimationId) return;
    resizeRipple();

    function animate() {
      rippleCtx.clearRect(0, 0, rippleWidth, rippleHeight);
      
      const baseColor = getRippleColor();
      const lightModeActive = isLightTheme();

      // Track raw pixel mouse velocity spikes
      const dxMouse = rippleMouse.x - rippleMouse.lastX;
      const dyMouse = rippleMouse.y - rippleMouse.lastY;
      const instantSpeed = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
      
      rippleMouse.speed += (instantSpeed - rippleMouse.speed) * 0.15;
      rippleMouse.lastX = rippleMouse.x;
      rippleMouse.lastY = rippleMouse.y;

      const speedSurge = Math.min(rippleMouse.speed / 40, 1.0);
      const MAX_STRIKE_RADIUS = 120 + (speedSurge * 260); 

     // --- CRITICAL OVERLOAD DETECTION MECHANIC (EXPLOSION GENERATOR) ---
      // Balanced Calibration: Requires a deliberate, fast circular friction gesture to pop.
      if (rippleMouse.active && rippleMouse.speed > 60) { // Raised speed limit from 20 to 50 to block accidents
        let internalHeatCounter = 0;
        gridNodes.forEach(n => {
          const dxHeat = n.x - rippleMouse.x;
          const dyHeat = n.y - rippleMouse.y;
          const distHeat = Math.sqrt(dxHeat * dxHeat + dyHeat * dyHeat);

          if (distHeat < 90) { 
            n.overload += 0.22; // Smooth heat collection buildup
            if (n.overload > 1.2) internalHeatCounter++; 
          }
        });
        
        // Requires more nodes to hit max pressure simultaneously (Raised from 2 to 6)
        if (internalHeatCounter > 6 && shockwaves.length < 2) {
          shockwaves.push({
            x: rippleMouse.x,
            y: rippleMouse.y,
            radius: 5,
            maxRadius: 300 + (speedSurge * 150), 
            speed: 14 + (speedSurge * 10),      
            force: 20 + (speedSurge * 12)        
          });
          
          // Flash clean the local heat zone instantly
          gridNodes.forEach(n => {
            if (Math.abs(n.x - rippleMouse.x) < 110 && Math.abs(n.y - rippleMouse.y) < 110) {
              n.overload = 0;
            }
          });
        }
      }

      // --- UPDATE EXPLOSION ENTITIES ---
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += sw.speed;
        sw.speed *= 0.96; // Wave dissipation slowing rate
        
        if (sw.radius >= sw.maxRadius || sw.speed < 1) {
          shockwaves.splice(i, 1);
          continue;
        }

        // Render transparent blast indicator ring
        rippleCtx.beginPath();
        rippleCtx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        rippleCtx.strokeStyle = baseColor;
        rippleCtx.lineWidth = 2.5 * (1.0 - (sw.radius / sw.maxRadius));
        rippleCtx.globalAlpha = 0.25 * (1.0 - (sw.radius / sw.maxRadius));
        rippleCtx.stroke();
      }

      // --- CORE GRID INTEGRATION UPDATE ---
      gridNodes.forEach((node) => {
        const dx = rippleMouse.x - node.x;
        const dy = rippleMouse.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;

        // Apply external shockwave forces pushing nodes outward away from detonation points
        shockwaves.forEach(sw => {
          const swDx = node.x - sw.x;
          const swDy = node.y - sw.y;
          const swDist = Math.sqrt(swDx * swDx + swDy * swDy) || 1;
          
          // Check if shockwave boundary is physically crossing this grid node coordinate right now
          if (Math.abs(swDist - sw.radius) < 30) {
            const pushIntensity = (1.0 - (sw.radius / sw.maxRadius)) * sw.force;
            node.vx += (swDx / swDist) * pushIntensity;
            node.vy += (swDy / swDist) * pushIntensity;
          }
        });

        // MECHANICAL LOOP 1: Target capture updates inside reach perimeter
        if (distance < MAX_STRIKE_RADIUS && rippleMouse.active) {
          const proximityFactor = 1.0 - (distance / MAX_STRIKE_RADIUS);
          const targetCharge = proximityFactor * (1.0 + speedSurge * 0.8);
          node.charge += (targetCharge - node.charge) * 0.25;

          // MECHANIC 1: THE RUBBER-BAND SNAPBACK (Magnet Pull Tensions)
          // High speed movements pull the nodes inward toward the magnetic center coil vector
          const pullTension = 0.015 * node.charge * (1.0 + speedSurge * 4.0);
          node.vx += (dx / distance) * pullTension * distance;
          node.vy += (dy / distance) * pullTension * distance;

          // Chaotic electrical shivering shaking
          const shakeFactor = node.charge * (3 + speedSurge * 6);
          node.vx += (Math.random() - 0.5) * shakeFactor;
          node.vy += (Math.random() - 0.5) * shakeFactor;

          // Fire primary structural lightning threads
          const distanceProbability = Math.random() * MAX_STRIKE_RADIUS;
          if (Math.random() < 0.07 && distance < distanceProbability) {
            drawLightning(rippleMouse.x, rippleMouse.y, node.x, node.y, baseColor, node.charge, speedSurge, lightModeActive);

            // MECHANIC 2: THE CHAIN REACTION CASCADE (Branching Arcs)
            // If this node is heavily charged up, let's allow it to spark chains to neighbors!
            if (node.charge > 0.65 && Math.random() < 0.25) {
              // Grab a completely random node from the master index deck to evaluate for chain leaping
              const randomNeighbor = gridNodes[Math.floor(Math.random() * gridNodes.length)];
              const nDx = randomNeighbor.x - node.x;
              const nDy = randomNeighbor.y - node.y;
              const nDist = Math.sqrt(nDx * nDx + nDy * nDy);
              
              // Leap secondary electricity chains if neighbor is within close jump range
              if (nDist > 10 && nDist < 90) {
                randomNeighbor.charge += 0.35; // Feed energy forward dynamically!
                drawLightning(node.x, node.y, randomNeighbor.x, randomNeighbor.y, baseColor, node.charge * 0.6, speedSurge, lightModeActive, true);
              }
            }
          }
        } else {
          // Standard structural cool down metrics
          node.charge *= 0.84;
        }

        // Natural environment dissipation balancing rates
        node.overload *= 0.94;

        // PHYSICS ENGINE SPRING LOOPS: Rubber band restoring springs back to anchor origins
        const springDx = node.baseX - node.x;
        const springDy = node.baseY - node.y;
        
        node.vx += springDx * 0.08; // High k-constant elasticity pull back speed
        node.vy += springDy * 0.08;
        
        node.vx *= 0.78; // Fluid drag damping to allow spring bounciness oscillations
        node.vy *= 0.78;

        node.x += node.vx;
        node.y += node.vy;

        // --- RENDER CURRENT SPOTS ---
        if (node.charge > 0.02 || node.overload > 0.05) {
          const maxRadiusFactor = 1.0 + (speedSurge * 2.5);
          // Overloading spots get significantly bigger visually to show stored juice
          const nodeRadius = 1.2 + (node.charge * 2.8 * maxRadiusFactor) + (node.overload * 2.0);
          
          rippleCtx.beginPath();
          rippleCtx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
          rippleCtx.fillStyle = baseColor;
          rippleCtx.globalAlpha = lightModeActive ? 0.35 : 0.2 + (node.charge * 0.6);
          rippleCtx.fill();

          rippleCtx.beginPath();
          rippleCtx.arc(node.x, node.y, Math.max(0.6, nodeRadius * 0.25), 0, Math.PI * 2);
          rippleCtx.fillStyle = lightModeActive ? baseColor : "#ffffff";
          rippleCtx.globalAlpha = 0.9;
          rippleCtx.fill();
        } else {
          // Idle ambient resting dots grid
          rippleCtx.beginPath();
          rippleCtx.arc(node.baseX, node.baseY, 0.7, 0, Math.PI * 2);
          rippleCtx.fillStyle = baseColor;
          rippleCtx.globalAlpha = lightModeActive ? 0.12 : 0.05;
          rippleCtx.fill();
        }
      });

      rippleAnimationId = requestAnimationFrame(animate);
    }

    animate();
  }

  function stopRipple() {
    cancelAnimationFrame(rippleAnimationId);
    rippleAnimationId = null;
    rippleCtx.clearRect(0, 0, rippleWidth, rippleHeight);
  }

  window.NoirRipple = {
    start: startRipple,
    stop: stopRipple
  };

  console.log("Surge Ripple Engine: Infinite Overload Physics Loaded.");
})();
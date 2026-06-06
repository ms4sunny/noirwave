// ===============================
// Clean 3-D Multi-Colored Moons
// NoirWave — Specular Vectors & Distinct Color Channels
// FIXED: Restored Proportional Mass-Based Revolving Speeds
// ===============================

(function () {
  let moonsAnimationId = null;

  // -------------------------------
  // Canvas Setup
  // -------------------------------
  const moonsCanvas = document.createElement("canvas");
  const moonsCtx = moonsCanvas.getContext("2d");

  moonsCanvas.id = "cursorMoonsCanvas";
  document.body.appendChild(moonsCanvas);

  moonsCanvas.style.position = "fixed";
  moonsCanvas.style.top = "0";
  moonsCanvas.style.left = "0";
  moonsCanvas.style.width = "100%";
  moonsCanvas.style.height = "100%";
  moonsCanvas.style.pointerEvents = "none";
  moonsCanvas.style.zIndex = "1";

  let moonsWidth, moonsHeight;

  function resizeMoons() {
    moonsWidth = moonsCanvas.width = window.innerWidth;
    moonsHeight = moonsCanvas.height = window.innerHeight;
  }
  resizeMoons();
  window.addEventListener("resize", resizeMoons);

  function getMoonsColor() {
    return getComputedStyle(document.body).getPropertyValue("--veil-color").trim() || 
           getComputedStyle(document.body).getPropertyValue("--accent-color").trim() || 
           "rgba(255, 255, 255, 0.8)";
  }

  // -------------------------------
  // Unified Input Tracking (Mouse + Touch)
  // -------------------------------
  const moonsMouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  };

  window.addEventListener("mousemove", e => {
    moonsMouse.x = e.clientX;
    moonsMouse.y = e.clientY;
  });

  window.addEventListener("touchstart", e => {
    if (e.touches.length > 0) {
      moonsMouse.x = e.touches[0].clientX;
      moonsMouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener("touchmove", e => {
    if (e.touches.length > 0) {
      moonsMouse.x = e.touches[0].clientX;
      moonsMouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  const MOON_COUNT = 3; 
  const moonDeck = [];
  const starDustPool = []; 

  function initMoons() {
    moonDeck.length = 0;
    starDustPool.length = 0;
    
    // Original exact mass metrics
    const masses = [12, 7, 3]; 

    for (let i = 0; i < MOON_COUNT; i++) {
      const angle = (i / MOON_COUNT) * Math.PI * 2;
      const currentMass = masses[i];
      const targetRadius = 110 - (currentMass * 5); 

      moonDeck.push({
        x: moonsMouse.x + Math.cos(angle) * targetRadius,
        y: moonsMouse.y + Math.sin(angle) * targetRadius,
        vx: -Math.sin(angle) * currentMass,
        vy: Math.cos(angle) * currentMass,
        mass: currentMass,
        baseRadius: targetRadius,
        // RESTORED: Speed scales directly with mass (12 is fastest, 3 is slowest)
        speedFactor: 3 + (currentMass * 0.6),
        id: i 
      });
    }
  }

  // -------------------------------
  // Animation System Loop
  // -------------------------------
  function startMoons() {
    if (moonsAnimationId) return;

    initMoons();

    function animate() {
      moonsCtx.clearRect(0, 0, moonsWidth, moonsHeight);
      const baseColor = getMoonsColor();

      // --- PHYSICS UPDATE ---
      moonDeck.forEach((moon) => {
        const dx = moonsMouse.x - moon.x;
        const dy = moonsMouse.y - moon.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;

        // Snappy vector pull to target cursor position
        const pullStrength = moon.speedFactor * 0.12;
        moon.vx += (dx / distance) * pullStrength;
        moon.vy += (dy / distance) * pullStrength;

        // FIXED CHANNELS: Perpendicular orbit speed is now strictly calculated 
        // using the moon's individual mass to bring back your unique rotational offsets!
        const perpendicularX = -dy / distance;
        const perpendicularY = dx / distance;
        
        // Multiplied by mass factor ratio to widen the performance gap between spheres
        const rotationDrive = 0.15 + (moon.mass * 0.025); 
        moon.vx += perpendicularX * (rotationDrive * 2.3);
        moon.vy += perpendicularY * rotationDrive; 

        const speed = Math.sqrt(moon.vx * moon.vx + moon.vy * moon.vy);
        moon.vx = (moon.vx / speed) * moon.speedFactor;
        moon.vy = (moon.vy / speed) * moon.speedFactor;

        moon.x += moon.vx;
        moon.y += moon.vy;

        // Faint, crisp stardust crumbs
        if (Math.random() < (moon.mass * 0.03)) {
          starDustPool.push({
            x: moon.x + (Math.random() - 0.5) * 2,
            y: moon.y + (Math.random() - 0.5) * 2,
            alpha: 0.5,
            decay: 0.02,
            size: 1.0
          });
        }
      });

      // --- RENDER STARDUST ---
      for (let i = starDustPool.length - 1; i >= 0; i--) {
        const p = starDustPool[i];
        p.alpha -= p.decay;
        if (p.alpha <= 0) {
          starDustPool.splice(i, 1);
          continue;
        }
        moonsCtx.beginPath();
        moonsCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        moonsCtx.fillStyle = baseColor;
        moonsCtx.globalAlpha = p.alpha;
        moonsCtx.fill();
      }

      // --- RENDER SHARP 3-D MOONS ---
      moonDeck.forEach((moon) => {
        const finalVisualRadius = 2.5 + (moon.mass * 0.6); 

        // Geometric connection line (very faint)
        moonsCtx.beginPath();
        moonsCtx.strokeStyle = baseColor;
        moonsCtx.globalAlpha = 0.04;
        moonsCtx.lineWidth = 1;
        moonsCtx.moveTo(moon.x, moon.y);
        moonsCtx.lineTo(moonsMouse.x, moonsMouse.y);
        moonsCtx.stroke();

        // 1. CHOOSE CRISP INDEPENDENT COLOR PROFILE PER MOON
        moonsCtx.save();
        moonsCtx.globalAlpha = 1.0; 

        if (moon.id === 0) {
          moonsCtx.fillStyle = baseColor;
        } else if (moon.id === 1) {
          moonsCtx.fillStyle = baseColor;
          moonsCtx.beginPath();
          moonsCtx.arc(moon.x, moon.y, finalVisualRadius, 0, Math.PI * 2);
          moonsCtx.fill();
          
          moonsCtx.fillStyle = "rgba(255, 255, 255, 0.35)"; 
        } else {
          moonsCtx.fillStyle = "rgba(0, 0, 0, 0.4)"; 
          moonsCtx.beginPath();
          moonsCtx.arc(moon.x, moon.y, finalVisualRadius, 0, Math.PI * 2);
          moonsCtx.fill();
          
          moonsCtx.fillStyle = baseColor;
          moonsCtx.globalAlpha = 0.65;
        }

        // Render the base body of the planet sphere cleanly
        moonsCtx.beginPath();
        moonsCtx.arc(moon.x, moon.y, finalVisualRadius, 0, Math.PI * 2);
        moonsCtx.fill();
        moonsCtx.restore();

        // 2. THE SPECULAR HIGHLIGHT VECTOR
        const highlightOffset = finalVisualRadius * 0.35;
        const highlightSize = Math.max(0.6, finalVisualRadius * 0.22);

        moonsCtx.beginPath();
        moonsCtx.arc(
          moon.x - highlightOffset, 
          moon.y - highlightOffset, 
          highlightSize, 
          0, 
          Math.PI * 2
        );
        moonsCtx.fillStyle = "#ffffff"; 
        moonsCtx.globalAlpha = 0.95;
        moonsCtx.fill();
      });

      moonsCtx.globalAlpha = 1.0;
      moonsAnimationId = requestAnimationFrame(animate);
    }

    animate();
  }

  function stopMoons() {
    cancelAnimationFrame(moonsAnimationId);
    moonsAnimationId = null;
    moonsCtx.clearRect(0, 0, moonsWidth, moonsHeight);
  }

  window.NoirMoons = {
    start: startMoons,
    stop: stopMoons
  };

  console.log("Moons Engine: Glossy Multi-Tone Spheres Enabled.");
})();
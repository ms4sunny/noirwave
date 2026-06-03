// clock-core.js
// Responsible only for drawing and updating the clocks.
// Exposes window.drawClock() so other code can call it immediately.

(function () {
  const canvas = document.getElementById('clockCanvas');
  if (!canvas) {
    console.warn('clock-core: canvas #clockCanvas not found');
    return;
  }
  const ctx = canvas.getContext('2d');
  const radius = canvas.width / 2;
  ctx.translate(radius, radius);
  const clockRadius = radius * 0.90;
  const widgetEl = document.querySelector('.clock-widget'); // scope for vars & style checks


  // draw functions
  function drawFace(ctx, radius) {
    const root = getComputedStyle(widgetEl || document.body);
    let bg = root.getPropertyValue('--clock-bg').trim() || '#ffffff';
    const border = root.getPropertyValue('--clock-border').trim() || '#1e90ff';

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);

    // If CSS var contains 'gradient', build a radial gradient manually
    if (bg.includes('gradient')) {
      const grad = ctx.createRadialGradient(0, 0, radius * 0.2, 0, 0, radius);
      // You can tweak these stops for richer glow
      grad.addColorStop(0, '#adb7e9ff');
      grad.addColorStop(0.5, '#78a2d5ff');
      grad.addColorStop(1, '#3e82eeff');

      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = bg;
    }

    ctx.fill();

    // Border
    ctx.strokeStyle = border;
    ctx.lineWidth = radius * 0.05;
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.05, 0, 2 * Math.PI);
    ctx.fillStyle = border;
    ctx.fill();
  }


  function drawNumbers(ctx, radius) {
    const root = getComputedStyle(widgetEl || document.body);
    const numbersColor = (root.getPropertyValue('--clock-numbers') || root.getPropertyValue('--text-color')).trim() || '#000';

    // if analogDark style active, add canvas shadow for glow
    const isAnalogDark = widgetEl && widgetEl.classList.contains('analogDark');

    ctx.save();
    if (isAnalogDark) {
      ctx.shadowColor = 'rgba(0,255,128,0.9)'; // luminous green
      ctx.shadowBlur = 8;
    } else {
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }

    ctx.font = `${radius * 0.15}px Poppins, sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = numbersColor;

    for (let num = 1; num <= 12; num++) {
      const ang = num * Math.PI / 6;
      ctx.rotate(ang);
      ctx.translate(0, -radius * 0.8);
      ctx.rotate(-ang);
      ctx.fillText(String(num), 0, 0);
      ctx.rotate(ang);
      ctx.translate(0, radius * 0.8);
      ctx.rotate(-ang);
    }
    ctx.restore();
  }

  function drawHand(ctx, pos, length, width, color) {
    ctx.save();
    // if analogDark, apply glow to hands too
    const isAnalogDark = widgetEl && widgetEl.classList.contains('analogDark');
    if (isAnalogDark) {
      ctx.shadowColor = 'rgba(0,255,128,0.9)';
      ctx.shadowBlur = 8;
    } else {
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }

    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.moveTo(0, 0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
    ctx.restore();
  }

  function drawTime(ctx, radius) {
    const now = new Date();
    let hour = now.getHours() % 12;
    let minute = now.getMinutes();
    let second = now.getSeconds();

    // read per-widget variables (preferred) then fallback
    const root = getComputedStyle(widgetEl || document.body);
    const hourColor = (root.getPropertyValue('--clock-hour') || '#111').trim();
    const minuteColor = (root.getPropertyValue('--clock-minute') || '#444').trim();
    const secondColor = (root.getPropertyValue('--clock-second') || 'red').trim();

    hour = (hour * Math.PI / 6) + (minute * Math.PI / (6 * 60)) + (second * Math.PI / (360 * 60));
    drawHand(ctx, hour, radius * 0.5, radius * 0.07, hourColor);

    minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
    drawHand(ctx, minute, radius * 0.75, radius * 0.05, minuteColor);

    second = (second * Math.PI / 30);
    drawHand(ctx, second, radius * 0.85, radius * 0.02, secondColor);
  }

  function drawClock() {
    // clear canvas while keeping origin center
    ctx.clearRect(-radius, -radius, canvas.width, canvas.height);
    drawFace(ctx, clockRadius);
    drawNumbers(ctx, clockRadius);
    drawTime(ctx, clockRadius);
  }

  // digital element (the HTML one), update function
  const digital = document.getElementById('digitalClock');
  function updateDigital() {
    if (!digital) return;
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    digital.textContent = `${h}:${m}:${s}`;
  }

  // public exposure so other scripts can force an immediate redraw
  window.drawClock = drawClock;
  window.updateDigitalClock = updateDigital;

  // run both once per second
  setInterval(() => {
    drawClock();
    updateDigital();
  }, 1000);

  // initial draw
  drawClock();
  updateDigital();
})();

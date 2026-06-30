// clock-styles.js
// Handles popup, style selection, explicit show/hide switching, and physics-safe absolute dragging.

(function () {
  console.log('Clock styles and drag engine loaded');

  const clockCanvas = document.getElementById('clockCanvas');
  const digitalClock = document.getElementById('digitalClock');
  const clockPopup = document.getElementById('clockStylePopup');
  const widget = document.querySelector('.clock-widget');

  if (!clockCanvas || !digitalClock || !clockPopup || !widget) {
    console.warn('clock-styles: required elements missing');
    return;
  }

  // --- 1. SMART CLICK-VS-DRAG STYLE PICKER TOGGLE ---
  let dragDistance = 0;
  let startX = 0;
  let startY = 0;

  function handleTrackStart(e) {
    let clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    let clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
    startX = clientX;
    startY = clientY;
    dragDistance = 0;
  }

  function handleTrackMove(e) {
    let clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    let clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
    const dx = clientX - startX;
    const dy = clientY - startY;
    dragDistance = Math.sqrt(dx * dx + dy * dy);
  }

  // Only toggle the style popup if the user clicked without dragging significantly
  function handleClockClick() {
    if (dragDistance < 5) {
      clockPopup.classList.toggle('hidden');
    }
  }

  [clockCanvas, digitalClock].forEach(el => {
    el.style.cursor = 'move'; // Change cursor to move indicating drag functionality
    
    // Mouse tracking for click filtering
    el.addEventListener('mousedown', handleTrackStart);
    el.addEventListener('mousemove', handleTrackMove);
    el.addEventListener('click', handleClockClick);

    // Touch tracking for click filtering
    el.addEventListener('touchstart', handleTrackStart, { passive: true });
    el.addEventListener('touchmove', handleTrackMove, { passive: true });
    el.addEventListener('touchend', handleClockClick);
  });


  // --- 2. ISOLATED CLOCK WIDGET DRAG ENGINE ---
  let isDragging = false;
  let initialX = 0;
  let initialY = 0;

  widget.style.position = "absolute";

  // Prevent landing directly on top of the weather widget on load
  // If no saved position exists, give it a slight initial offset (e.g., shifted right by 180px)
  if (!widget.style.left && !widget.style.top) {
    widget.style.left = "calc(50% - 250px)"; 
    widget.style.top = "30px";
  }

  function dragStart(e) {
    // Prevent dragging if clicking options panel buttons inside the widget
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('#clockStylePopup')) return;
    
    let clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    let clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
    
    initialX = clientX - widget.offsetLeft;
    initialY = clientY - widget.offsetTop;
    isDragging = true;
  }

  function drag(e) {
    if (!isDragging) return;
    
    // Check threshold before preventing default browser touch scrolling
    if (dragDistance > 2) {
      e.preventDefault();
    }
    
    let clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    let clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
    
    widget.style.left = `${clientX - initialX}px`;
    widget.style.top = `${clientY - initialY}px`;
  }

  function dragEnd() { 
    isDragging = false; 
  }

  // Mouse drag listeners
  widget.addEventListener("mousedown", dragStart);
  window.addEventListener("mousemove", drag, { passive: false });
  window.addEventListener("mouseup", dragEnd);

  // Touch drag listeners
  widget.addEventListener("touchstart", dragStart, { passive: true });
  window.addEventListener("touchmove", drag, { passive: false });
  window.addEventListener("touchend", dragEnd);


  // --- 3. LAYOUT & STYLE DROPDOWN CONTROLS ---
  const optionContainer = document.querySelector('.clock-style-options');
  if (optionContainer) {
    optionContainer.style.display = 'flex';
    optionContainer.style.flexDirection = 'row';
    optionContainer.style.gap = '0.6rem';
    optionContainer.style.justifyContent = 'center';
  }

  function clearWidgetStyles() {
    widget.classList.remove('analogClassic', 'analogMinimal', 'analogDark', 'digitalModern', 'digitalRetro', 'digitalNeon');
  }

  document.querySelectorAll('.clock-style-options button').forEach(btn => {
    btn.addEventListener('click', () => {
      const newStyle = btn.dataset.style;
      if (!newStyle) return;

      clearWidgetStyles();
      widget.classList.add(newStyle);
      widget.dataset.clockStyle = newStyle;

      if (newStyle.startsWith('digital')) {
        clockCanvas.classList.add('hidden');
        digitalClock.classList.remove('hidden');
      } else {
        clockCanvas.classList.remove('hidden');
        digitalClock.classList.add('hidden');

        if (typeof window.drawClock === 'function') {
          window.drawClock();
        }
      }

      clockPopup.classList.add('hidden');

      document.querySelectorAll('.clock-style-options button').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

})();
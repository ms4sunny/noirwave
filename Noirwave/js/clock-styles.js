// clock-styles.js
// Handles popup, style selection, and explicit show/hide switching.

(function () {
  console.log('Clock styles loaded');

  const clockCanvas = document.getElementById('clockCanvas');
  const digitalClock = document.getElementById('digitalClock'); // must match HTML id
  const clockPopup = document.getElementById('clockStylePopup');
  const widget = document.querySelector('.clock-widget');

  if (!clockCanvas || !digitalClock || !clockPopup || !widget) {
    console.warn('clock-styles: required elements missing');
    return;
  }

  // Make both clickable to open popup
  [clockCanvas, digitalClock].forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => {
      clockPopup.classList.toggle('hidden');
    });
  });

  // ensure popup buttons are horizontal by forcing layout here too
  const optionContainer = document.querySelector('.clock-style-options');
  if (optionContainer) {
    optionContainer.style.display = 'flex';
    optionContainer.style.flexDirection = 'row';
    optionContainer.style.gap = '0.6rem';
    optionContainer.style.justifyContent = 'center';
  }

  // helper: remove all style classes from widget
  function clearWidgetStyles() {
   widget.classList.remove('analogClassic', 'analogMinimal', 'analogDark', 'digitalModern', 'digitalRetro', 'digitalNeon');

  }

  // wire buttons
  document.querySelectorAll('.clock-style-options button').forEach(btn => {
    btn.addEventListener('click', () => {
      const newStyle = btn.dataset.style;
      if (!newStyle) return;

      // clear & add class to .clock-widget (scoped)
      clearWidgetStyles();
      widget.classList.add(newStyle);
      widget.dataset.clockStyle = newStyle;

      // show/hide clocks
      if (newStyle.startsWith('digital')) {
        clockCanvas.classList.add('hidden');
        digitalClock.classList.remove('hidden');
      } else {
        clockCanvas.classList.remove('hidden');
        digitalClock.classList.add('hidden');

        // force immediate redraw when coming back to analog
        if (typeof window.drawClock === 'function') {
          window.drawClock();
        }
      }

      // close popup
      clockPopup.classList.add('hidden');

      // button highlight
      document.querySelectorAll('.clock-style-options button').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

})();

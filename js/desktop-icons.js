// js/desktop-icons.js
// Modular Snap-to-Grid Icon Engine V3 (Infinite Spiral Matrix & Vertical Boundary Fix)

(function () {
  console.log("Desktop Icon Grid Engine V3 Loaded");

  const icons = document.querySelectorAll(".app-grid .app-icon");
  const gridContainer = document.querySelector(".app-grid");
  if (!icons.length || !gridContainer) return;

  const gridX = 90;  
  const gridY = 100; 

  const initialPositions = [];
  icons.forEach(icon => {
    initialPositions.push({
      left: icon.offsetLeft,
      top: icon.offsetTop
    });
  });

  // Align everything perfectly to the coordinate matrix on load
  icons.forEach((icon, index) => {
    icon.style.position = "absolute";
    const snappedInitX = Math.round(initialPositions[index].left / gridX) * gridX;
    const snappedInitY = Math.round(initialPositions[index].top / gridY) * gridY;
    
    icon.style.left = `${snappedInitX}px`;
    icon.style.top = `${snappedInitY}px`;
    icon.style.margin = "0"; 
    icon.style.zIndex = "2";  
  });

  function isCellOccupied(targetLeft, targetTop, currentIcon) {
    let occupied = false;
    icons.forEach(otherIcon => {
      if (otherIcon === currentIcon) return; 
      const otherLeft = Math.round(parseFloat(otherIcon.style.left));
      const otherTop = Math.round(parseFloat(otherIcon.style.top));
      
      if (otherLeft === targetLeft && otherTop === targetTop) {
        occupied = true;
      }
    });
    return occupied;
  }

  icons.forEach(icon => {
    let isDragging = false;
    let initialX = 0;
    let initialY = 0;
    
    let startX = 0;
    let startY = 0;
    let hasMovedSignificantly = false;

    function dragStart(e) {
      let clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
      let clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
      
      startX = clientX;
      startY = clientY;
      hasMovedSignificantly = false;

      initialX = clientX - icon.offsetLeft;
      initialY = clientY - icon.offsetTop;
      isDragging = true;
      icon.style.zIndex = "3";
    }

    function drag(e) {
      if (!isDragging) return;
      
      let clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
      let clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
      
      const moveDistance = Math.sqrt(Math.pow(clientX - startX, 2) + Math.pow(clientY - startY, 2));
      if (moveDistance > 5) {
        hasMovedSignificantly = true;
      }

      e.preventDefault();
      icon.style.left = `${clientX - initialX}px`;
      icon.style.top = `${clientY - initialY}px`;
    }

    function dragEnd(e) {
      if (!isDragging) return;
      isDragging = false;

      let snappedX = Math.round(parseFloat(icon.style.left) / gridX) * gridX;
      let snappedY = Math.round(parseFloat(icon.style.top) / gridY) * gridY;

      // --- NEW BULLETPROOF SPIRAL SEARCH ALGORITHM ---
      let targetX = snappedX;
      let targetY = snappedY;

      // Calculate maximum limits relative to parent container space
      const parentRect = gridContainer.getBoundingClientRect();
      const maxBoundaryX = window.innerWidth - icon.offsetWidth - parentRect.left;
      const minBoundaryY = -parentRect.top + 20; // Allows moving up past container limit

      if (isCellOccupied(targetX, targetY, icon)) {
        let found = false;
        // Spiral outwards: radius layer 1, layer 2, layer 3, etc.
        for (let radius = 1; radius < 10; radius++) {
          for (let dx = -radius; dx <= radius; dx++) {
            for (let dy = -radius; dy <= radius; dy++) {
              // Only check coordinates on the outer ring perimeter of the current radius layer
              if (Math.abs(dx) === radius || Math.abs(dy) === radius) {
                let checkX = snappedX + (dx * gridX);
                let checkY = snappedY + (dy * gridY);

                // Boundary verification
                if (checkX >= -parentRect.left && checkX <= maxBoundaryX && checkY >= minBoundaryY) {
                  if (!isCellOccupied(checkX, checkY, icon)) {
                    targetX = checkX;
                    targetY = checkY;
                    found = true;
                    break;
                  }
                }
              }
            }
            if (found) break;
          }
          if (found) break;
        }
      }

      // Smooth transition to grid coordinates
      icon.style.transition = "left 0.2s ease, top 0.2s ease";
      icon.style.left = `${targetX}px`;
      icon.style.top = `${targetY}px`;

      setTimeout(() => {
        icon.style.transition = "none";
        icon.style.zIndex = "2";
      }, 200);
    }

    icon.addEventListener("click", function (e) {
      if (hasMovedSignificantly) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    }, true); 

    icon.addEventListener("mousedown", dragStart);
    window.addEventListener("mousemove", drag, { passive: false });
    window.addEventListener("mouseup", dragEnd);

    icon.addEventListener("touchstart", dragStart, { passive: true });
    window.addEventListener("touchmove", drag, { passive: false });
    window.addEventListener("touchend", dragEnd);
  });
})();
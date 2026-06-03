// calculator.js — NoirWave mini-app calculator
console.log("Calculator JS loaded");

document.addEventListener("DOMContentLoaded", () => {
  const calculatorWidget = document.getElementById("calculatorWidget");
  const calculatorPopup = document.getElementById("calculatorPopup");
  const closeCalculator = document.getElementById("closeCalculator");
  const calcDisplay = document.getElementById("calcDisplay");
  const buttons = document.querySelectorAll(".calc-btn");

  if (!calculatorWidget || !calculatorPopup || !calcDisplay) {
    console.warn("calculator.js: required elements missing");
    return;
  }

  console.log("✅ Calculator elements found");

  // --- Toggle popup ---
  calculatorWidget.addEventListener("click", () => {
    calculatorPopup.classList.remove("hidden");
  });

  closeCalculator.addEventListener("click", () => {
    calculatorPopup.classList.add("hidden");
  });

  // --- Calculator logic ---
  let currentInput = "";
  let operator = "";
  let previousInput = "";

  function updateDisplay(value) {
    calcDisplay.value = value || "0";
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const value = btn.getAttribute("data-value");

      if (!value) return;

      if (value === "C") {
        currentInput = "";
        previousInput = "";
        operator = "";
        updateDisplay("0");
        return;
      }

      if (value === "=") {
        if (previousInput && operator && currentInput) {
          let result = 0;
          const prev = parseFloat(previousInput);
          const curr = parseFloat(currentInput);

          switch (operator) {
            case "+": result = prev + curr; break;
            case "-": result = prev - curr; break;
            case "×": result = prev * curr; break;
            case "÷": result = curr !== 0 ? prev / curr : "Error"; break;
          }

          updateDisplay(result);
          currentInput = result.toString();
          previousInput = "";
          operator = "";
        }
        return;
      }

      if (["+", "-", "×", "÷"].includes(value)) {
        if (currentInput === "") return;
        operator = value;
        previousInput = currentInput;
        currentInput = "";
        return;
      }

      // Append numbers or decimal
      currentInput += value;
      updateDisplay(currentInput);
    });
  });

  // Initialize display
  updateDisplay("0");
});

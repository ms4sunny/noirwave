// 🌦️ NoirWave Live Weather Widget
const apiKey = "f6ddf3df6a5f4ec9afc0013fa684adaf"; 

function fetchWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const temperature = Math.round(data.main.temp);
      const city = data.name;
      const condition = data.weather[0].description;
      const iconCode = data.weather[0].icon;
      let iconFile = "sun.png"; // default

      if (iconCode.includes("n")) {
        iconFile = "moon.png"; // night
      } else if (iconCode.startsWith("02") || iconCode.startsWith("03")) {
        iconFile = "cloud.png";
      } else if (iconCode.startsWith("09") || iconCode.startsWith("10")) {
        iconFile = "rain.png";
      } else if (iconCode.startsWith("11")) {
        iconFile = "storm.png";
      } else if (iconCode.startsWith("13")) {
        iconFile = "snow.png";
      }

      // Render your custom asset file cleanly
      document.getElementById("weather-icon").innerHTML = `
        <img src="assets/weather/${iconFile}" alt="Weather Icon">
      `;

      document.getElementById("temperature").textContent = `${temperature}°C`;
      document.getElementById("city").textContent = city;
      document.getElementById("condition").textContent = condition;
    })
    .catch(error => {
      console.error("Weather data error:", error);
      if (!document.getElementById("city").textContent) {
        document.getElementById("city").textContent = "Unable to load weather";
      }
    });
}

function getLocationAndWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeather(lat, lon);
      },
      error => {
        console.error("Geolocation error:", error);
        document.getElementById("city").textContent = "Location denied";
      }
    );
  } else {
    document.getElementById("city").textContent = "Geolocation not supported";
  }
}

// Run layout fetches on load
window.addEventListener("load", getLocationAndWeather);


// ===================================================
// DRAG & DROP PHYSICS ENGINE FOR WEATHER CARD
// ===================================================
window.addEventListener("DOMContentLoaded", () => {
  const weatherWidget = document.querySelector(".weather-widget");
  if (!weatherWidget) return;

  let isDragging = false;
  let currentX = 0, currentY = 0;
  let initialX = 0, initialY = 0;
  let xOffset = 0, yOffset = 0;

  function dragStart(e) {
    // Prevent dragging if clicking text strings or action updates
    if (e.target.closest('button') || e.target.closest('input')) return;

    let clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    let clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;

    initialX = clientX - xOffset;
    initialY = clientY - yOffset;
    isDragging = true;
  }

  function drag(e) {
    if (!isDragging) return;
    e.preventDefault();

    let clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    let clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

    currentX = clientX - initialX;
    currentY = clientY - initialY;
    xOffset = currentX;
    yOffset = currentY;

    // Shift coordinates fluidly across the screen space
    weatherWidget.style.transform = `translate(${currentX}px, ${currentY}px)`;
  }

  function dragEnd() {
    isDragging = false;
  }

  // Register Event Triggers
  weatherWidget.addEventListener("mousedown", dragStart);
  window.addEventListener("mousemove", drag, { passive: false });
  window.addEventListener("mouseup", dragEnd);

  weatherWidget.addEventListener("touchstart", dragStart, { passive: true });
  window.addEventListener("touchmove", drag, { passive: false });
  window.addEventListener("touchend", dragEnd);
});
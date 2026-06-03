// 🌦️ NoirWave Live Weather Widget
const apiKey = "f6ddf3df6a5f4ec9afc0013fa684adaf"; // <-- paste your OpenWeatherMap key here

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

document.getElementById("weather-icon").innerHTML = `
  <img src="assets/weather/${iconFile}" alt="Weather Icon">
`;



      document.getElementById("temperature").textContent = `${temperature}°C`;
      document.getElementById("city").textContent = city;
      document.getElementById("condition").textContent = condition;
      document.getElementById("weather-icon").innerHTML = `<img src="${iconUrl}" alt="Weather Icon">`;
    })
    .catch(error => {
  console.error("Weather data error:", error);
  // Optional: only show message if there's no data yet
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

// Run on load
window.addEventListener("load", getLocationAndWeather);

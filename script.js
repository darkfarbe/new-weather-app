// API

function search(city) {
  let apiKey = "fbde5cao1a5748d107tcc6736273f093";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function getForecast(coordinates) {
  let apiKey = "fbde5cao1a5748d107tcc6736273f093";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function getWeatherFromMyPosition(event) {
  let apiKey = "fbde5cao1a5748d107tcc6736273f093";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${event.coords.longitude}&lat=${event.coords.latitude}&key=${apiKey}`;
  axios.get(apiUrl).then(displayTemperature);
}

// EVENT LISTENERS

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

function getMyLocation(ev) {
  ev.preventDefault();
  let a = navigator.geolocation.getCurrentPosition(getWeatherFromMyPosition);
}

// FORMATTING
function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = date.getMinutes();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function displayTemperature(response) {
  // Get HTML Elemets
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");

  // Set HTML Elements values
  celsiusTemperature = response.data.temperature.current;
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.city;
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = Math.round(response.data.temperature.humidity);
  windElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate(response.data.time * 1000);
  iconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  iconElement.setAttribute("alt", response.data.condition.description);

  // Nextfunction
  getForecast(response.data.coordinates);
}

function displayForecast(response) {
  let forecast = response.data.daily; // returns array with forecast per day
  let forecastElement = document.querySelector("#forecast-temperature");
  let forecastHTML = `<div class="row justify-content-between">`;

  forecast.slice(1).forEach(function (forecastDay) {
    forecastHTML += `
      <div class="col-2 forecastDay">
      <div style="font-weight:bold">${
        shortDays[new Date(forecastDay.time * 1000).getDay()]
      }</div>
      <div class="weather-forecast-date">${Math.round(
        forecastDay.temperature.day
      )}°</div>

      <img
        src="${forecastDay.condition.icon_url}"
        alt=""
        width="45"
      />
      <div class="weather-forecast-temperature d-flex flex-column">
        <span class="max-temperature">Max: ${Math.round(
          forecastDay.temperature.maximum
        )}°</span>
        <span class="min-temperature">Min: ${Math.round(
          forecastDay.temperature.minimum
        )}°</span>
      </div>
    </div>`;
  });

  forecastHTML = forecastHTML + `</div>`;

  forecastElement.innerHTML = forecastHTML;
}

function showCelsiusTemp(event) {
  event.preventDefault(); // prevents the browser from sending submit data
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

// START UP

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

let celsiusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let myLocationButton = document.querySelector("#myLocation");
myLocationButton.addEventListener("click", getMyLocation);

search("New York");

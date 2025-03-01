let now = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
let day = days[now.getDay()];
let month = months[now.getMonth()];
let date = now.getDate();
let year = now.getFullYear();
document.getElementById("date").innerHTML = `${day}, ${date} ${month} ${year}`;

let hours = now.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
document.querySelector("#time").innerHTML = `${hours}:${minutes}`;

function getForecast(coordinates){
  let apiKey="0037126c84f0bf4c3edaf22e63429f61";
  let apiUrl=`https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function showWeather(response){
  let iconElement=document.querySelector("#icon");
  document.querySelector("#city").innerHTML=response.data.name;
  document.querySelector("#temp").innerHTML=Math.round(response.data.main.temp);
  document.querySelector("#description").innerHTML=response.data.weather[0].description;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(response.data.wind.speed);
  iconElement.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  celsiusTemp = response.data.main.temp;
  getForecast(response.data.coord);
}


function searchCity(city) {
  let apiKey="0037126c84f0bf4c3edaf22e63429f61";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
}

function search(event) {
  event.preventDefault();
  let city=document.querySelector("#city-input").value;
  searchCity(city);
}
let button = document.querySelector("#search-form");
button.addEventListener("click", search);

function showLocation(position) {
  let apiKey = "0037126c84f0bf4c3edaf22e63429f61";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showLocation);
}

function showFahrenheitTemp(event) {
event.preventDefault();
let temperatureElement=document.querySelector("#temp");
celsiusLink.classList.remove("active");
fahrenheitLink.classList.add("active");
let fahrenheitTemp=(temperatureElement.innerHTML * 1.8) + 32;
temperatureElement.innerHTML=Math.round(fahrenheitTemp);
}
function showCelsiusTemp(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
fahrenheitLink.classList.remove("active");
  let temperatureElement=document.querySelector("#temp");
  temperatureElement.innerHTML=Math.round(celsiusTemp);
}

function formatDay(timestamp){
let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast (response) {
  let forecast=response.data.daily;
  let forecastElement=document.querySelector("#weather-forecast");
  
  let forecastHTML=`<div class="row">`;   
  forecast.forEach(function(forecastDay,index) {
    if (index <5) {
    forecastHTML=
      forecastHTML+
              `
            <div class="col">
              <div class="data">${formatDay(forecastDay.dt)}</div>
              <img src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" alt="cloudy" width="50" />
              <br />
              ${Math.round(forecastDay.temp.max)}℃ <span class="night">${Math.round(forecastDay.temp.min)}℃</span>
            </div>
            `;
    }
  });
    forecastHTML=forecastHTML+`</div>`;
    forecastElement.innerHTML=forecastHTML;
   }

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

let celsiusLink=document.querySelector("#celsius-link");
celsiusLink.addEventListener("click",showCelsiusTemp);

let fahrenheitLink=document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click",showFahrenheitTemp);

searchCity("Lviv");

let changeThemeButtons = document.querySelectorAll('.changeTheme');
changeThemeButtons.forEach(button => {
button.addEventListener('click', function () { 
  let theme = this.dataset.theme;
  applyTheme(theme);
 });
});

function applyTheme(themeName) {
  document.querySelector('[title="theme"]').setAttribute('href', `theme-${themeName}.css`); 
  changeThemeButtons.forEach(button => {
    button.style.display = 'block';
  });
  document.querySelector(`[data-theme="${themeName}"]`).style.display = 'none'; 
  localStorage.setItem('theme', themeName);
}

let activeTheme = localStorage.getItem('theme');
if(activeTheme === null || activeTheme === 'light') { 
  applyTheme('light');
} else if (activeTheme === 'dark') { 
  applyTheme('dark');
}

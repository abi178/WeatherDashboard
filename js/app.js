let currentCity = "";

import { fetchWeather, fetchForecast, fetchWeatherByCoords } from "./api.js";

import {saveCity, loadCity, saveTheme, loadTheme, saveFavorite, loadFavorites} from "./storage.js";

const forecastContainer =
    document.getElementById("forecastContainer");

const themeToggle =
    document.getElementById("themeToggle");    

const cityInput =
    document.getElementById("cityInput");

const searchBtn =
    document.getElementById("searchBtn");

const loading =
    document.getElementById("loading");

const error =
    document.getElementById("error");

const cityName =
    document.getElementById("cityName");

const weatherIcon =
    document.getElementById("weatherIcon");

const temperature =
    document.getElementById("temperature");

const description =
    document.getElementById("description");

const humidity =
    document.getElementById("humidity");

const windSpeed =
    document.getElementById("windSpeed");

const saveFavoriteBtn =
    document.getElementById("saveFavoriteBtn");

const favoritesContainer =
    document.getElementById("favoritesContainer"); 
    
const locationBtn =
    document.getElementById("locationBtn");    


// DISPLAY WEATHER DATA

function displayWeather(data) {

    currentCity = data.name;

    cityName.textContent =
        data.name;

    weatherIcon.src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    weatherIcon.alt =
        data.weather[0].description;

    temperature.textContent =
        `Temperature: ${data.main.temp} °C`;

    description.textContent =
        `Weather: ${data.weather[0].description}`;

    humidity.textContent =
        `Humidity: ${data.main.humidity}%`;

    windSpeed.textContent =
        `Wind Speed: ${data.wind.speed} m/s`;    
}


function displayForecast(data){

    forecastContainer.innerHTML = "";

    const dailyForecasts =
        data.list.filter(item =>
            item.dt_txt.includes("12:00:00")
        );

    dailyForecasts.forEach(item => {

        const date =
            new Date(item.dt_txt);

        const day =
            date.toLocaleDateString("en-US", {
                weekday: "short"
            });

        const forecastCard = `

            <div class="forecast__card">

                <p class="forecast__day">
                    ${day}
                </p>

                <img
                    class="forecast__icon"
                    src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png"
                >

                <p class="forecast__temp">
                    ${Math.round(item.main.temp)} °C
                </p>

                <p class="forecast__description">
                    ${item.weather[0].description}
                </p>

            </div>

        `;

        forecastContainer.innerHTML +=
            forecastCard;

    });

}

// DISPLAY FAVORITES 
function displayFavorites(){

    favoritesContainer.innerHTML = "";

    const favorites =
        loadFavorites();

    favorites.forEach(city => {

        const cityBtn =
            document.createElement("button");

        cityBtn.className =
            "favorites__city";

        cityBtn.textContent =
            city;

        cityBtn.addEventListener(
            "click",
            () => getWeather(city)
        );

        favoritesContainer.appendChild(
            cityBtn
        );

    });

}


// GET WEATHER

async function getWeather(city) {

    try {

        loading.style.display = "block";

        error.textContent = "";

        const data =
            await fetchWeather(city);

        displayWeather(data);


        // FORECAST

        const forecastData =
            await fetchForecast(city);

        displayForecast(forecastData);


        saveCity(city);

    }

    catch(err) {

        error.textContent =
            err.message;

    }

    finally {

        loading.style.display = "none";

    }

}


// SEARCH BUTTON EVENT

searchBtn.addEventListener("click", () => {

    const city =
        cityInput.value.trim();

    if(city === "") {

        error.textContent =
            "Please enter a city name";

        return;

    }

    getWeather(city);

});


// ENTER KEY SUPPORT

cityInput.addEventListener("keydown", (event) => {

    if(event.key === "Enter") {

        const city =
            cityInput.value.trim();

        if(city === "") {

            error.textContent =
                "Please enter a city name";

            return;

        }

        getWeather(city);

    }

});


// LOAD SAVED CITY

window.addEventListener("load", async () => {

    const savedTheme =
    loadTheme();

    if(savedTheme === "dark"){
        document.body.classList.add("dark");

        themeToggle.textContent = "Light Mode";
    }

    const savedCity =
        loadCity();

    if(savedCity) {

        getWeather(savedCity);

    }

    displayFavorites();

});

// DARK MODE TOGGLE

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        saveTheme("dark");

        themeToggle.textContent =
            "Light Mode";

    }
    else{

        saveTheme("light");

        themeToggle.textContent =
            "Dark Mode";

    }

});

// SAVE FAVORITE CITY

saveFavoriteBtn.addEventListener("click", () => {

    if(currentCity){

        saveFavorite(currentCity);

        displayFavorites();

    }

});

// GEOLOCATION 

locationBtn.addEventListener("click", () => {

    navigator.geolocation.getCurrentPosition(

        async (position) => {

            try {

                const lat =
                    position.coords.latitude;

                const lon =
                    position.coords.longitude;

                const data =
                    await fetchWeatherByCoords(lat, lon);

                displayWeather(data);

                const forecastData =
                    await fetchForecast(data.name);

                displayForecast(forecastData);

            }

            catch(err){

                error.textContent =
                    err.message;

            }

        },

        () => {

            error.textContent =
                "Unable to access location";

        }

    );

});
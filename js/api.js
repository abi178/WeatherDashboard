const API_KEY = "47a643623c96ad4f3b460946dcf5783e";


// CURRENT WEATHER

export async function fetchWeather(city) {

    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    if(!response.ok){
        throw new Error("City not found");
    }

    return await response.json();
}


// 5-DAY FORECAST

export async function fetchForecast(city){

    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );

    if(!response.ok){
        throw new Error("Forecast not available");
    }

    return await response.json();
}

// GEOLOCATION 

export async function fetchWeatherByCoords(lat, lon){

    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    if(!response.ok){
        throw new Error("Location weather not found");
    }

    return await response.json();

}
const STORAGE_KEY = "weatherAppCity";

export function saveCity(city) {

    localStorage.setItem(STORAGE_KEY, city);

}

export function loadCity() {

    return localStorage.getItem(STORAGE_KEY);

}

export function saveTheme(theme){

    localStorage.setItem("theme", theme);

}

export function loadTheme(){

    return localStorage.getItem("theme");

}

// FAVORITE CITIES 

const FAVORITES_KEY = "favoriteCities";

export function saveFavorite(city){

    let favorites =
        loadFavorites();

    if(!favorites.includes(city)){

        favorites.push(city);

        localStorage.setItem(
            FAVORITES_KEY,
            JSON.stringify(favorites)
        );

    }

}

export function loadFavorites(){

    const favorites =
        localStorage.getItem(FAVORITES_KEY);

    return favorites
        ? JSON.parse(favorites)
        : [];

}
export const geoApiOptions = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'd6a6808d09msh1b865a4c6ae7f71p102392jsn82660be79506',
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
    }
};

export const GEO_API_URL = "https://wft-geo-db.p.rapidapi.com/v1/geo";

fetch('/cities', geoApiOptions)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
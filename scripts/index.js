// Register a listener for the DOMContentLoaded event. This is triggered when the HTML is loaded and the DOM is constructed.
// We are doing this because the script is loaded in the head of the document, so the DOM is not yet constructed when the script is executed.
document.addEventListener("DOMContentLoaded", (_event) => {
    let searchInput = document.querySelector('#cities');
    let searchButton = document.querySelector('#searchButton');

    //Issue 1
    function renderDatalist(data) {
        let datalist = document.createElement('datalist');
        datalist.id = 'cities-data';
        searchInput.setAttribute('list', datalist.id);

        let fragment = document.createDocumentFragment();

        for (let item of data) {
            let option = document.createElement('option');
            option.value = `${item.properties.city}, ${item.properties.country}`;  
            fragment.append(option);
        }

        datalist.append(fragment);
        searchInput.after(datalist);
    }
    searchInput.addEventListener('input', function(event) {
        let query = event.target.value;
        if(query.length < 3) return; 

        let apiURL = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=a40f770499084a08a51e8b6f668ffbf4`;

        fetch(apiURL)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw response;
            })
            .then(data => {
                renderDatalist(data.features); 
            })
            .catch(error => {
                console.error('Eroare la solicitarea API:', error);
            });
    });
    
    //Issue 2
    document.getElementById('searchForm').addEventListener('submit', function(e) {
        e.preventDefault();
    
      });
    
    function fetchWeatherData(city, apiKey) {
    
        let spinner = document.getElementById("spinner");
        let weatherCard = document.getElementById("weatherCard");
        let fav = document.getElementById("fav");
        
        let h2 = document.getElementById("h2");
        spinner.removeAttribute('hidden');
     
        return new Promise((resolve, reject) => {
           let url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&aqi=no`;
           let forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=1e1842a066264120879113102241603 &q=${encodeURIComponent(city)}&days=5&aqi=no&alerts=no`;

           fetch(url)
              .then(response => {
                 if (!response.ok) {
                    throw new Error('Eroare la solicitarea datelor meteo');
                 }
                 return response.json();
              })
              .then(data => {
                spinner.setAttribute('hidden', '');
                weatherCard.style.display = 'block'; 
                h2.style.display = 'block';
                forecast.style.display = 'flex';
                
                 resolve(data);
              })
              .catch(error => {
                spinner.setAttribute('hidden', '');
                weatherCard.style.display = 'block'; 
                 reject(error);
              });
              fetch(forecastUrl)
              .then(response => response.json())
              .then(data => {
                updateForecast(data.forecast.forecastday) 
              console.log(data);})
              .catch(error => console.error('Eroare:', error));
        });
      
     }
  
     const weatherIcons = {
        "Light rain": "assets/weather_conditions_icons/rain.png",
        "Moderate rain": "assets/weather_conditions_icons/rain.png",
        "Patchy rain possible":"assets/weather_conditions_icons/rain.png",
        "Heavy rain": "assets/weather_conditions_icons/rain.png",
        "Sunny": "assets/weather_conditions_icons/sun.png",
        "Cloudy": "assets/weather_conditions_icons/cloud.png",
        "Partly cloudy": "assets/weather_conditions_icons/cloud.png",
        "Light snow": "assets/weather_conditions_icons/snow.png",
        "Moderate snow": "assets/weather_conditions_icons/snow.png",
        "Windy":"assets/weather_conditions_icons/wind.png",
        "Clear": "assets/weather_conditions_icons/clear.png"
        
    };
    var daysOfWeek = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'];


    function getDayName(dateString) {
        var date = new Date(dateString);
        return daysOfWeek[date.getDay()];
    }
    function updateWeatherCard(data) {

        document.getElementById('cityName').textContent = data.location.name;
        document.getElementById('date').textContent =getDayName(data.location.localtime.split(" ")[0]);
        document.getElementById('country').textContent = data.location.country;
        document.getElementById('temperature').textContent = `${data.current.temp_c}°C`;
        document.getElementById('skyConditions').textContent = ` ${data.current.condition.text}`;
        document.getElementById('humidity').textContent = `${data.current.humidity}%`;
        document.getElementById('wind').textContent = `${data.current.wind_kph}km/h`;

        const condition = data.current.condition.text;
        const iconPath = weatherIcons[condition];
        document.getElementById('weatherIcon').src = iconPath || "assets/weather_conditions_icons/weatheer.png";
      
        updateHeartButtonState(data.location.name);

    }
    function updateForecast(forecastDays) {

        document.getElementById('forecastdate1').textContent =getDayName(forecastDays[1].date.split(" ")[0]);
        document.getElementById('forecastcondition1').textContent = forecastDays[1].day.condition.text;
        document.getElementById('maxTempforecast1').textContent = `MAX: ${forecastDays[1].day.maxtemp_c}°C`;
        document.getElementById('minTempforecast1').textContent = `MIN: ${forecastDays[1].day.mintemp_c}°C`;
        document.getElementById('precipforecast1').textContent = `PRECIP: ${forecastDays[1].day.totalprecip_mm} mm`;

        document.getElementById('forecastdate2').textContent =getDayName(forecastDays[2].date.split(" ")[0]);
        document.getElementById('forecastcondition2').textContent = forecastDays[2].day.condition.text;
        document.getElementById('maxTempforecast2').textContent = `MAX: ${forecastDays[2].day.maxtemp_c}°C`;
        document.getElementById('minTempforecast2').textContent = `MIN: ${forecastDays[2].day.mintemp_c}°C`;
        document.getElementById('precipforecast2').textContent = `PRECIP: ${forecastDays[2].day.totalprecip_mm} mm`;

        document.getElementById('forecastdate3').textContent =getDayName(forecastDays[3].date.split(" ")[0]);
        document.getElementById('forecastcondition3').textContent = forecastDays[3].day.condition.text;
        document.getElementById('maxTempforecast3').textContent = `MAX: ${forecastDays[3].day.maxtemp_c}°C`;
        document.getElementById('minTempforecast3').textContent = `MIN: ${forecastDays[3].day.mintemp_c}°C`;
        document.getElementById('precipforecast3').textContent = `PRECIP: ${forecastDays[3].day.totalprecip_mm} mm`;

        document.getElementById('forecastdate4').textContent =getDayName(forecastDays[4].date.split(" ")[0]);
        document.getElementById('forecastcondition4').textContent = forecastDays[4].day.condition.text;
        document.getElementById('maxTempforecast4').textContent = `MAX: ${forecastDays[4].day.maxtemp_c}°C`;
        document.getElementById('minTempforecast4').textContent = `MIN: ${forecastDays[4].day.mintemp_c}°C`;
        document.getElementById('precipforecast4').textContent = `PRECIP: ${forecastDays[4].day.totalprecip_mm} mm`;


        const condition1 = forecastDays[1].day.condition.text;
        const condition2 = forecastDays[2].day.condition.text;
        const condition3 = forecastDays[3].day.condition.text;
        const condition4 = forecastDays[4].day.condition.text;

        const iconPath1 = weatherIcons[condition1];
        const iconPath2 = weatherIcons[condition2];
        const iconPath3 = weatherIcons[condition3];
        const iconPath4 = weatherIcons[condition4];

        document.getElementById('weatherIconforecast1').src = iconPath1 || "assets/weather_conditions_icons/weatheer.png"; 
        document.getElementById('weatherIconforecast2').src = iconPath2 || "assets/weather_conditions_icons/weatheer.png"; 
        document.getElementById('weatherIconforecast3').src = iconPath3 || "assets/weather_conditions_icons/weatheer.png"; 
        document.getElementById('weatherIconforecast4').src = iconPath4 || "assets/weather_conditions_icons/weatheer.png"; 
    }
    
    
    document.querySelector('#searchButton').addEventListener('click', function() {
        let city = document.querySelector('#cities').value;
        let apiKey = '1e1842a066264120879113102241603';
    
        fetchWeatherData(city, apiKey)
            .then(data => {
                updateWeatherCard(data);
                const city = data.location.name;
                const weatherCondition = data.current.condition.text
                updateBackgroundImage(city, weatherCondition);
            })
            .catch(error => {
                console.error('Eroare:', error);
            });
    });
         document.querySelectorAll('.hidden').forEach(function(el) {
        el.classList.remove('hidden');
      });   

    //Issue 3

    function updateBackgroundImage(city, weatherCondition) {
        let url;
        let spinner = document.getElementById("spinner"); 
        spinner.removeAttribute('hidden'); 

        if (weatherCondition === 'snow' || weatherCondition === 'rain') {
            url = `https://api.pexels.com/v1/search?query=${city} ${weatherCondition}&per_page=1`;
        } else {
            url = `https://api.pexels.com/v1/search?query=${city}&per_page=1`;
        }
        console.log(`${city} ${weatherCondition}`)
        fetch(url, {
            headers: {
                'Authorization': '6AQivnA6qUagLW8zJ93A6MNZEWBrozog1b1SqQHOD72qeLoCw9URBdkv'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.photos.length > 0) {
                const imageUrl = data.photos[0].src.original;
                document.body.style.backgroundImage = `url(${imageUrl})`;
            }
            console.log(data);
            spinner.setAttribute('hidden', '');
        })
        .catch(error => {
            console.error('Error fetching image:', error);
            spinner.setAttribute('hidden', '');
        });
    }
    document.body.style.backgroundSize = 'cover'; 
    document.body.style.backgroundPosition = 'center'; 
    document.body.style.backgroundRepeat = 'no-repeat'; 

    //Issue 4

    function removeCityFromFavorites(cityToRemove) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const newFavorites = favorites.filter(city => city !== cityToRemove);
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
    }
    removeCityFromFavorites("Oraș");
    removeCityFromFavorites("Bucha");
    
    document.getElementById('favoriteButton').addEventListener('click', function() {
        let city = document.getElementById('cityName').textContent;
        toggleFavorite(city);
    });

    function updateHeartButtonState(city) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        let heartButton = document.getElementById('favoriteButton');
        if (favorites.includes(city)) {
            heartButton.classList.add('is-favorite');
        } else {
            heartButton.classList.remove('is-favorite');
        }
    }
    
    function toggleFavorite(city) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const index = favorites.indexOf(city);
        if (index > -1) {
            favorites.splice(index, 1); 
        } else {
            favorites.push(city);
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites(); 
        updateHeartButtonState(city); 
    }
    
    function displayFavorites() {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        let favoritesList = document.getElementById('favoritesList');
        
       
        favoritesList.innerHTML = '';
    
        favorites.forEach(city => {
            // Adăugați la lista de favorite
            let cityElement = document.createElement('li');
            cityElement.textContent = city;
            cityElement.onclick = function() {
                document.querySelector('#cities').value = city; 
                searchButton.click();
            };
            favoritesList.appendChild(cityElement);
    });
}

    displayFavorites();
    

});

// VARIABLES SEARCH
const button = document.getElementById("subBtn")
const searchBar = document.getElementById("searchBar")

// VARIABLES PAST SEARCH
const searchedCity = document.getElementById("searchedCity");
const historyArray = [];


// VARIABLES DISPLAY
const place = document.getElementById("place");
const placeDate = document.getElementById("date")
const weatherIcon = document.getElementById("weatherIcon");
const degrees = document.getElementById("degrees");
const humy = document.getElementById("hum");
const windspeed = document.getElementById("windy");
const UVIndex = document.getElementById("UV");
const UVCircle = document.querySelector(".uv-circle");
const backgroundElement = document.querySelector(".wrapper");

//VARIABLES 5 DAY DISPLAY
const dateFivep = document.getElementsByClassName("dateFive");
const weatherFivep = document.getElementsByClassName("weatherFive");
const tempFivep = document.getElementsByClassName("tempFive");
const humFivep = document.getElementsByClassName("humFive");

const cards = document.querySelectorAll(".fivedayCard");

const iconMap = {
    Thunderstorm: {
        background: 'src/assets/bg-thunderstorm.jpg',
        icon: 'src/assets/thunderstorm.svg'
    },
    Drizzle: {
        background: 'src/assets/bg-drizzle.jpg',
        icon: 'src/assets/drizzle.svg'
    },
    Rain: {
        background: 'src/assets/bg-rain.jpg',
        icon: 'src/assets/rain.svg'
    },
    Snow: {
        background: 'src/assets/bg-snow.jpg',
        icon: 'src/assets/snow.svg'
    },
    Atmosphere: {
        background: 'src/assets/bg-atmosphere.jpg',
        icon: 'src/assets/atmosphere.svg'
    },
    Clear: {
        background: 'src/assets/bg-clear.jpg',
        icon: 'src/assets/clear.svg'
    },
    Clouds: {
        background: 'src/assets/bg-clouds.jpg',
        icon: 'src/assets/clouds.svg'
    }

}

document.addEventListener("DOMContentLoaded", function () {
    // Handler when the DOM is fully loaded
    const savedCity = localStorage.getItem("city") || "Philadelphia"
    if (savedCity) {
        citySearch(savedCity);
        searchFiveDay(savedCity);
    }

    button.onclick = function () {
        event.preventDefault();
        const city = searchBar.value;
        citySearch(city);
        searchFiveDay(city);
    };

    /*searchedCity.onclick = function () {
        event.preventDefault();
        console.log('doop')
        const city = searchBar.value;
        citySearch(city);
        searchFiveDay(city);
    }*/

    console.log('yay')
});

function citySearch(city) {
    city = city.toLowerCase()
    console.log(city)

    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=974d902c878dcae370e669f524ad6ba0&units=imperial")
        .then(response => response.json())
        .then(data => {
            console.log(data)

            localStorage.setItem("city", city)

            const placeValue = data.name;
            const degreesValue = data.main.temp;
            const windValue = data.wind.speed;
            const humValue = data.main.humidity;

            const weatherIconValue = data.weather[0].icon;
            const weatherId=data.weather[0].id
            const weatherValue = data.weather[0].main

            const { background, icon } = iconMap[weatherValue] || {}

            


            place.innerHTML = placeValue;
            placeDate.innerHTML = new Date().toLocaleDateString()
            weatherIcon.src = icon //"http://openweathermap.org/img/wn/" + weatherIconValue + ".png";
            degrees.innerHTML = Math.floor(degreesValue) + "°";
            windspeed.innerHTML = "Wind Speed: " + windValue + " kph";
            humy.innerHTML = "Humidity: " + humValue + "%";
            backgroundElement.style.backgroundImage = `url('${background}')`
            console.log(backgroundElement)

            //UV INDEX
            const x = data["coord"]["lat"];
            const y = data["coord"]["lon"];

            fetch("https://api.openweathermap.org/data/2.5/uvi?appid=974d902c878dcae370e669f524ad6ba0&lat=" + x + "&lon=" + y + "")
                .then(response => response.json())
                .then(data => {
                    const UVValue = data.value;
                    UVIndex.innerHTML = UVValue;

                    //COLOR CHANGE
                    function updateBg() {
                        if (UVValue < 2) {
                            UVCircle.style.backgroundColor = "#00ff2a"
                            UVIndex.style.color = "#333333"
                        }
                        else if (UVValue < 6 && UVValue > 3) {
                            UVCircle.style.backgroundColor = "#ffff00"
                            UVIndex.style.color = "#333333"

                        } else if (UVValue < 8 && UVValue > 6) {
                            UVCircle.style.backgroundColor = "#ff8c00"
                            UVIndex.style.color = "#333333"
                        }
                        else if (UVValue < 11 && UVValue > 8) {
                            UVCircle.style.backgroundColor = "#ff0000"

                        }
                        else if (UVValue >= 11) {
                            UVCircle.style.backgroundColor = "#c300ff"
                            UVIndex.style.color = "#333333"
                        }
                    }
                    updateBg();
                })
            //--------------------------------------
            //PREVIOUS SEARCH LIST
            if (historyArray.indexOf(placeValue) === -1) {
                historyArray.push(placeValue)
                
                const button = document.createElement('h5')

                     
                button.onclick = () => {
                    citySearch(placeValue)
                    searchFiveDay(city)
                }

                button.innerText = placeValue
                searchedCity.prepend(button)
            }
        })

    searchFiveDay(city)
}


function searchFiveDay(city) {
    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=974d902c878dcae370e669f524ad6ba0&units=imperial")
        .then(response => response.json())
        .then(data => {
            if (data.cod != 200) {
                return console.log(data)
            }

            const days = data.list

            //LOOPING THROUGH THE DAYS. THE API HAS 40 SECTIONS—8 TIMES OF DAY FOR EACH OF 5 DAYS
            for (let i = 1; i < days.length; i += 8) {
                const day = days[i]
                const card = cards[(i - 1) / 8]

                const dateFiveValue = new Date(day.dt_txt)

                const dateString = dateFiveValue.toLocaleDateString()

                //const weatherFiveValue = day.weather[0].icon;
                const weatherValue = day.weather[0].main
                const { icon } = iconMap[weatherValue]

                const tempFiveValue = day.main.temp;

                const humFiveValue = day.main.humidity;

                const dateDisplay = card.querySelector(".dateFive")
                dateDisplay.textContent = dateString

                const weatherDisplay = card.querySelector(".weatherFive")
                weatherDisplay.src = icon

                const tempDisplay = card.querySelector(".tempFive")
                tempDisplay.textContent = "Temp: " + tempFiveValue + "° F"

                const humDisplay = card.querySelector(".humFive")
                humDisplay.textContent = "Humidity: " + humFiveValue + "%";
            }
        });
}


// 5 DAY TOGGLE

const upcomingWeatherToggle = document.querySelector('.show-upcoming-weather')

const upcomingWeather = document.querySelector('.upcoming-weather')
upcomingWeatherToggle.addEventListener("click", () => {
    upcomingWeather.classList.toggle('show-weather')
})



let lat;
let lon;
let iloscprevius=0;
let acctualDay = 0;
let actualCityName;
let weatherDayDate;
let showPositionVarible=1;
const allCityNames =[];
const actualCity = document.getElementById("actual-city")
const weatherDay = document.getElementById("weather-day")
const weatherDescription = document.getElementById("weather-description")
const weatherTemp = document.getElementById("weather-temp")
const weatherPressure = document.getElementById("weather-pressure")
const weatherHumidity = document.getElementById("weather-humidity")
const weatherWind = document.getElementById("weather-wind")
const favoriteBtn = document.getElementById("favorite-btn")

function getLocation()//funkcja pobierajaca lokalizacje
{
    acctualDay = 0
    iloscprevius = 0
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition)
    }
    else
    {
        alert("Twoja przeglądarka nie obsługuje geolokalizacji.")
    }
}

function showPosition(position)//funkcja pomocnicza do lokalizacji
{
    lat = position.coords.latitude
    lon = position.coords.longitude
    showPositionVarible=0;
    actualWeather(lat,lon)
}

async function actualWeather(lat, lon)//funkcja wyswietlajaca aktualny dzien
{
    if ((localStorage.getItem(`actual-day-name-${actualCityName}`)==null) || showPositionVarible==0)
    {
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pl&appid=749271a5704a54dbfffefca06adc13e2`
    const response = await fetch(apiUrl);
    const data = await response.json();
    if(showPositionVarible == 0)
    {
    actualCityName = data.name
    showPositionVarible = 1;
    checkFavoriteCity()
    }
    actualCity.textContent = actualCityName
    weatherDayDate = new Date()
    weatherDay.innerHTML = dayCorrect(weatherDayDate,0)
    weatherDescription.textContent = "Pogoda: " + data.weather[0].description
    weatherTemp.innerHTML = Math.round(data.main.temp) + "&#xB0 C"
    weatherPressure.textContent = "Ciśnienie: " + data.main.pressure + " hPa"
    weatherHumidity.textContent = "Wilgotność: " + data.main.humidity + " %"
    weatherWind.textContent = "Wiatr: " + data.wind.speed + " km/h"


    localStorage.setItem(`actual-day-name-${actualCityName}`,actualCityName)
    localStorage.setItem(`actual-day-description${actualCityName}`,data.weather[0].description)
    localStorage.setItem(`actual-day-temp-${actualCityName}`,Math.round(data.main.temp))
    localStorage.setItem(`actual-day-pressure-${actualCityName}`,data.main.pressure)
    localStorage.setItem(`actual-day-humidity-${actualCityName}`,data.main.humidity)
    localStorage.setItem(`actual-day-wind-${actualCityName}`,data.wind.speed)
    }
    else
    {
        weatherDayDate = new Date() //dodany 
        weatherDay.innerHTML = dayCorrect(weatherDayDate,0)
        actualCity.textContent = localStorage.getItem(`actual-day-name-${actualCityName}`)
        weatherDescription.textContent ="Pogoda: " + localStorage.getItem(`actual-day-description${actualCityName}`)
        weatherTemp.innerHTML = localStorage.getItem(`actual-day-temp-${actualCityName}`) + "&#xB0 C"
        weatherPressure.textContent = "Ciśnienie: " + localStorage.getItem(`actual-day-pressure-${actualCityName}`) + " hPa"
        weatherHumidity.textContent = "Wilgotność: " + localStorage.getItem(`actual-day-humidity-${actualCityName}`) + " %"
        weatherWind.textContent = "Wiatr: " + localStorage.getItem(`actual-day-wind-${actualCityName}`) + " km/h"
    }
}

async function previousWeather(lat, lon, time)//funkcja wyswietla poprzednie dni
{
    let previousToData = iloscprevius
    if(localStorage.getItem(`previous-day${previousToData}-temp-${actualCityName}`) == null)
    {
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&units=metric&lang=pl&dt=${time}&appid=749271a5704a54dbfffefca06adc13e2` //previous
    const response = await fetch(apiUrl);
    const data = await response.json();
    weatherDay.innerHTML = dayCorrect(weatherDayDate,acctualDay)
    weatherDescription.textContent = "Pogoda: " + data.current.weather[0].description
    weatherTemp.innerHTML = Math.round(data.current.temp) + "&#xB0 C "
    weatherPressure.textContent = "Ciśnienie: " + data.current.pressure + " hPa "
    weatherHumidity.textContent = "Wilgotność: " + data.current.humidity + " %"
    weatherWind.textContent = "Wiatr: " + data.current.wind_speed + " km/h"

    localStorage.setItem(`previous-day${previousToData}-description-${actualCityName}`,data.current.weather[0].description)
    localStorage.setItem(`previous-day${previousToData}-temp-${actualCityName}`,Math.round(data.current.temp))
    localStorage.setItem(`previous-day${previousToData}-pressure-${actualCityName}`,data.current.pressure)
    localStorage.setItem(`previous-day${previousToData}-humidity-${actualCityName}`,data.current.humidity)
    localStorage.setItem(`previous-day${previousToData}-wind-${actualCityName}`,data.current.wind_speed)
    }
    else
    {
        weatherDay.innerHTML = dayCorrect(weatherDayDate,acctualDay)
        weatherDescription.textContent ="Pogoda: " + localStorage.getItem(`previous-day${previousToData}-description-${actualCityName}`)
        weatherTemp.innerHTML = localStorage.getItem(`previous-day${previousToData}-temp-${actualCityName}`) + "&#xB0 C"
        weatherPressure.textContent = "Ciśnienie: " + localStorage.getItem(`previous-day${previousToData}-pressure-${actualCityName}`) + " hPa"
        weatherHumidity.textContent = "Wilgotność: " + localStorage.getItem(`previous-day${previousToData}-humidity-${actualCityName}`) + " %"
        weatherWind.textContent = "Wiatr: " + localStorage.getItem(`previous-day${previousToData}-wind-${actualCityName}`) + " km/h"
    }
}


function previousWeatherBtn()//funkcja przycisku poprzedniego dnia
{
    if(acctualDay<=-5)
   {
       acctualDay=-5;
   }
   else
   {
       acctualDay=acctualDay-1;
   }
   pickedDay()
}

function nextWeatherBtn()//funkcja przycisku nastepnego dnia
{
   if(acctualDay>=2)
    {
        acctualDay=2;
    }
    else
    {
        acctualDay=acctualDay+1;
    }
    pickedDay()
}

async function nextWeather(lat, lon, day) //funkcja wyswietlajaca przyszłe dni
{
    if (day == 1)
    {
        if(localStorage.getItem(`next-day1-temp-${actualCityName}`)==null)
        {
        let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=pl&appid=749271a5704a54dbfffefca06adc13e2` //next
        const response = await fetch(apiUrl);
        const data = await response.json();
        weatherDay.innerHTML = dayCorrect(weatherDayDate,1)
        weatherDescription.textContent = "Pogoda: " + data.list[5].weather[0].description
        weatherTemp.innerHTML = Math.round(data.list[5].main.temp) + "&#xB0 C"
        weatherPressure.textContent = "Ciśnienie: " + data.list[5].main.pressure + " hPa"
        weatherHumidity.textContent = "Wilgotność: " + data.list[5].main.humidity + " %"
        weatherWind.textContent = "Wiatr: " + data.list[5].wind.speed + " km/h"

        localStorage.setItem(`next-day1-description-${actualCityName}`,data.list[5].weather[0].description)
        localStorage.setItem(`next-day1-temp-${actualCityName}`,Math.round(data.list[5].main.temp))
        localStorage.setItem(`next-day1-pressure-${actualCityName}`,data.list[5].main.pressure)
        localStorage.setItem(`next-day1-humidity-${actualCityName}`,data.list[5].main.humidity)
        localStorage.setItem(`next-day1-wind-${actualCityName}`,data.list[5].wind.speed)
        }
        else
        {
        weatherDay.innerHTML = dayCorrect(weatherDayDate,1)
        weatherDescription.textContent = "Pogoda: " + localStorage.getItem(`next-day1-description-${actualCityName}`)
        weatherTemp.innerHTML = localStorage.getItem(`next-day1-temp-${actualCityName}`) + "&#xB0 C"
        weatherPressure.textContent = "Ciśnienie: " + localStorage.getItem(`next-day1-pressure-${actualCityName}`) + " hPa"
        weatherHumidity.textContent = "Wilgotność: " + localStorage.getItem(`next-day1-humidity-${actualCityName}`) + " %"
        weatherWind.textContent = "Wiatr: " + localStorage.getItem(`next-day1-wind-${actualCityName}`) + " km/h"
        }
    }
    else if(day == 2)
    {
        if(localStorage.getItem(`next-day2-temp-${actualCityName}`)== null)
        {
        let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=pl&appid=749271a5704a54dbfffefca06adc13e2` //next
        const response = await fetch(apiUrl);
        const data = await response.json();
        weatherDay.innerHTML = dayCorrect(weatherDayDate,2)
        weatherDescription.textContent = "Pogoda: " + data.list[8].weather[0].description
        weatherTemp.innerHTML = Math.round(data.list[8].main.temp) + "&#xB0 C"
        weatherPressure.textContent = "Ciśnienie: " + data.list[8].main.pressure + " hPa"
        weatherHumidity.textContent = "Wilgotność: " + data.list[8].main.humidity + " %"
        weatherWind.textContent = "Wiatr: " + data.list[8].wind.speed + " km/h"

        localStorage.setItem(`next-day2-description-${actualCityName}`,data.list[8].weather[0].description)
        localStorage.setItem(`next-day2-temp-${actualCityName}`,Math.round(data.list[8].main.temp))
        localStorage.setItem(`next-day2-pressure-${actualCityName}`,data.list[8].main.pressure)
        localStorage.setItem(`next-day2-humidity-${actualCityName}`,data.list[8].main.humidity)
        localStorage.setItem(`next-day2-wind-${actualCityName}`,data.list[8].wind.speed)
        }
        else
        {
        weatherDay.innerHTML = dayCorrect(weatherDayDate,2)
        weatherDescription.textContent = "Pogoda: " + localStorage.getItem(`next-day2-description-${actualCityName}`)
        weatherTemp.innerHTML = localStorage.getItem(`next-day2-temp-${actualCityName}`) + "&#xB0 C"
        weatherPressure.textContent = "Ciśnienie: " + localStorage.getItem(`next-day2-pressure-${actualCityName}`) + " hPa"
        weatherHumidity.textContent = "Wilgotność: " + localStorage.getItem(`next-day2-humidity-${actualCityName}`) + " %"
        weatherWind.textContent = "Wiatr: " + localStorage.getItem(`next-day2-wind-${actualCityName}`) + " km/h"
        }
    }
}




function startLoad()//funkcja startowa
{
        if(localStorage.getItem(`favorite-city`))
        {
            getLocationByName(localStorage.getItem(`favorite-city`))
        }
        else
        {
            getLocationByName("Warszawa")
        }
        onLoginFavoriteCity()
        timeUpdate()
}

async function getLocationByName(cityInput)//funkcja szuka i wywoluje miasto po nazwie
{
    let apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&appid=749271a5704a54dbfffefca06adc13e2`
    const response = await fetch(apiUrl);
    const data = await response.json();
    if(data.length == 0)
    {
        document.getElementById("weather-none").textContent = "Nie znaleziono miasta! Wpisz ponownie."
    }
    else
    {
    actualCityName = data[0].local_names.pl
    if(data[0].local_names.pl == undefined)
    {
        actualCityName = data[0].name
    }
    actualCity.textContent = actualCityName
    if(data.cod != "400")
    {
    lat = data[0].lat
    lon = data[0].lon
    actualWeather(lat,lon)
    document.getElementById("weather-none").textContent = ""
    checkFavoriteCity()
    }
    else
    {
        document.getElementById("weather-none").textContent = "Nie znaleziono miasta! Wpisz ponownie."
    }
    }
}

function getLocationByInput() //funkcja pobiera miasto z input
{
    acctualDay = 0
    iloscprevius = 0
    let cityInput = document.getElementById("city-input").value
    document.getElementById("city-input").value = ""
    getLocationByName(cityInput)
}

function pickedDay() //funkcja ustawiajaca dzien
{

    if(acctualDay==0) //pogoda teraźniejsza
    {
        actualWeather(lat,lon)
    }
    else if(acctualDay<0) //pogoda przeszła
    {
        let acctualDay2 = acctualDay*(-1);
        iloscprevius = acctualDay2 - 1
        let currentTime = new Date()
        currentTime = currentTime.getTime()
        currentTime = Math.round(currentTime/1000)
        let time = [currentTime-86400, currentTime-(86400*2), currentTime-(86400*3), currentTime-(86400*4), currentTime-(86400*5)]
        if(iloscprevius>=5)
        {
            iloscprevius=4
        }
        else
        {
            previousWeather(lat, lon, time[iloscprevius])
            iloscprevius = iloscprevius+1;
        }
    }
    else if(acctualDay>0) //pogoda przyszła
    {
        nextWeather(lat,lon,acctualDay)
    }
}


function timeUpdate() //funkcja ustawiajaca i sprawdzająca czy dane sa przedawnione 3h
{
    if(!localStorage.getItem("time-check"))
    {
    let setTime = new Date();
    setTime = setTime.getTime()
    setTime = Math.round(setTime/1000)
    localStorage.setItem("time-update",setTime)
    localStorage.setItem("time-check", 1)
    }
    else
    {
    let actualTime = new Date();
    actualTime = actualTime.getTime()
    actualTime = Math.round(actualTime/1000)
    if(actualTime - parseInt(localStorage.getItem("time-update"))>=10800)
    {
        localStorage.clear()
    }
    }
}


function dayCorrect(weatherDayDate,whatDay) //funkcja poprawiająca wyswietlanie daty
{
    weatherMonth = (weatherDayDate.getMonth()+1)
    weatherDate = weatherDayDate.getDate() + whatDay
    weatherFullYear = weatherDayDate.getFullYear()
    if(weatherDate <= 0)
    {
        if(!weatherMonth%2)
        {
            weatherMonth = weatherMonth -1
            weatherDate = 30
        }
        else if (weatherMonth == 2)
        {
            weatherMonth = weatherMonth -1
            weatherDate = 28
        }
        else
        {
            weatherMonth = weatherMonth -1
            weatherDate = 31
        }
        if(weatherMonth<=0)
        {
            weatherMonth = 12
        }
    }
    if(weatherDayDate.getMonth() < 10)
    {
        weatherMonth ="0" + weatherMonth
    }
    if(weatherDayDate.getDate() < 10) 
    {
        weatherDate = "0" + weatherDate
    }
    return weatherDate + "." + weatherMonth + "." + weatherFullYear
}

function setFavoriteCity() //funkcja ustawiajaca ulubione miasto
{
    if((! localStorage.getItem(`favorite-city`)) || (localStorage.getItem(`favorite-city`) != actualCityName))
    {
    favoriteBtn.style.backgroundImage = "url('favorite-icon-2.png')"
    localStorage.setItem(`favorite-city`,actualCityName);
    }
    else
    {
        favoriteBtn.style.backgroundImage = "url('favorite-icon-1.png')"
        localStorage.removeItem(`favorite-city`)
    }
}

function checkFavoriteCity() //funkcja sprawdzajaca ulubione miasto
{
    if(localStorage.getItem(`favorite-city`) == actualCityName)
    {
        favoriteBtn.style.backgroundImage = "url('favorite-icon-2.png')"
    }
    else
    {
        favoriteBtn.style.backgroundImage = "url('favorite-icon-1.png')"
    }

}

function onLoginFavoriteCity() //funkcja pomocnicz
{
    if(localStorage.getItem(`favorite-city`))
    {
        actualCityName= localStorage.getItem(`favorite-city`)
        getLocationByName(actualCityName)
    }
}
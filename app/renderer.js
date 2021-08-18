const path = require('path')
require('dotenv').config({ path: require('find-config')('.env') })
const fetch = require('node-fetch')

//Maps
const L = require('leaflet')
let map = L.map('mapid').setView([45.5017, -73.5673], 10);
let weatherLayers = []
let currentLayerIndex = 0

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//CurrentTime
function refreshTimer(func, refreshLength){
    setTimeout(func, refreshLength)
}

function displayCurrentTime(){
    document.getElementById('currentTime').innerHTML = new Date().toLocaleString()
    refreshTimer(displayCurrentTime, 1000);
}

displayCurrentTime()

//Current Weather
let currentTemp
let weather
let minTemp
let maxTemp
let pressure
let feltTemp
let humidity
let sunrise
let sunset
let windSpeed
let forecast

async function getCurrentWeatherData(){
    await fetch('https://api.openweathermap.org/data/2.5/weather?q=Montreal&appid='+process.env.OPEN_WEATHER_MAP_APIKEY+'&units=metric')
        .then((res) => res.json())
        .then((data) => {
            currentTemp = data.main.temp
            weather = data.weather['0'].main
            minTemp = data.main.temp_min
            maxTemp = data.main.temp_max
            pressure = data.main.pressure
            feltTemp = data.main.feels_like
            humidity = data.main.humidity
            sunrise = data.sys.sunrise
            sunset = data.sys.sunset
            windSpeed = data.wind.speed
        })
        .catch(error => console.warn(error))
}

async function getCurrentLayers(){
    weatherLayers[0] = L.tileLayer("https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid="+process.env.OPEN_WEATHER_MAP_APIKEY,
        {attribution: '&copy; <a href="https://www.openweathermap.org/copyright">OpenWeatherMap</a> contributors'})

    weatherLayers[1] = L.tileLayer("https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid="+process.env.OPEN_WEATHER_MAP_APIKEY,
        {attribution: '&copy; <a href="https://www.openweathermap.org/copyright">OpenWeatherMap</a> contributors'})

    weatherLayers[2] = L.tileLayer("https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid="+process.env.OPEN_WEATHER_MAP_APIKEY,
        {attribution: '&copy; <a href="https://www.openweathermap.org/copyright">OpenWeatherMap</a> contributors'})

    weatherLayers[3] = L.tileLayer("https://tile.openweathermap.org/map//pressure_new/{z}/{x}/{y}.png?appid="+process.env.OPEN_WEATHER_MAP_APIKEY,
        {attribution: '&copy; <a href="https://www.openweathermap.org/copyright">OpenWeatherMap</a> contributors'})

    weatherLayers[4] = L.tileLayer("https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid="+process.env.OPEN_WEATHER_MAP_APIKEY,
        {attribution: '&copy; <a href="https://www.openweathermap.org/copyright">OpenWeatherMap</a> contributors'})
}

async function displayCurrentWeather() {
    await getCurrentWeatherData()
    await getCurrentLayers()
    document.getElementById('weather').innerHTML = weather
    document.getElementById('currentTemperature').innerHTML = currentTemp + '°C'
    document.getElementById('feltTemp').innerHTML = feltTemp + '°C'
    document.getElementById('minMaxTemp').innerHTML = minTemp + '/' + maxTemp
    document.getElementById('pressure').innerHTML = pressure
    document.getElementById('humidity').innerHTML = humidity + '%'
    document.getElementById('windSpeed').innerHTML = windSpeed + 'km/h'
    document.getElementById('sunriseAndSunset').innerHTML =
        new Date(sunrise * 1000).toLocaleTimeString('fr-CA')
        + '/' +
        new Date(sunset * 1000).toLocaleTimeString('fr-CA')

    weatherLayers[currentLayerIndex].removeFrom(map)
    weatherLayers[currentLayerIndex].addTo(map)

    refreshTimer(displayCurrentWeather, 1800000) // 30 minutes refresh
}

displayCurrentWeather()

function previousLayer(){
    weatherLayers[currentLayerIndex].removeFrom(map)
    if (currentLayerIndex === 0)
        currentLayerIndex = weatherLayers.length - 1
    else
        currentLayerIndex--
    console.log(currentLayerIndex)
    weatherLayers[currentLayerIndex].addTo(map)
}

function nextLayer(){
    weatherLayers[currentLayerIndex].removeFrom(map)
    if (currentLayerIndex === weatherLayers.length - 1)
        currentLayerIndex = 0
    else
        currentLayerIndex++;
    console.log(currentLayerIndex)
    weatherLayers[currentLayerIndex].addTo(map)
}
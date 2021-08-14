require('dotenv').config()
const fetch = require('node-fetch')

//Maps
const L = require('leaflet')
let map = L.map('mapid').setView([45.5017, -73.5673], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.tileLayer("https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid="+process.env.OPEN_WEATHER_MAP_APIKEY,
    {attribution: '&copy; <a href="https://www.openweathermap.org/copyright">OpenWeatherMap</a> contributors'})
    .addTo(map)

//CurrentTime
function cooldown(func, cooldownLength){
    setTimeout(func, cooldownLength)
}

function displayCurrentTime(){
    document.getElementById('currentTime').innerHTML = new Date().toLocaleString()
    cooldown(displayCurrentTime, 1000);
}

displayCurrentTime()

//Current Weather
function getCurrentWeather(){
    fetch('https://api.openweathermap.org/data/2.5/weather?q=Montreal&appid='+process.env.OPEN_WEATHER_MAP_APIKEY+'&units=metric')
        .then(res => res.json())
        .then((out) => {
            console.log(out)
            // return out
        }).catch(error => console.warn(error))
}

function displayCurrentWeather(){
    getCurrentWeather()
}

displayCurrentWeather()

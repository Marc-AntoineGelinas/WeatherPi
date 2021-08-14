const L = require('leaflet')
let map = L.map('mapid').setView([45.528, -122.680], 13);
L.tileLayer("https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=process.env.OPEN_WEATHER_MAP_APIKEY",
    {attribution: '&copy; <a href="https://www.openweathermap.org/copyright">OpenWeatherMap</a> contributors'})
    .addTo(map)
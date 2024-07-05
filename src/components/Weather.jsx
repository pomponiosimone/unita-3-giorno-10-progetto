import React, { useEffect, useState } from 'react';
import search from '../assets/search.png'
import clear from '../assets/clear.png'
import humidity from '../assets/humidity.png'
import cloud from '../assets/cloud.png'
import drizzle from '../assets/drizzle.png'
import rain from '../assets/rain.png'
import snow from '../assets/snow.png'
import wind from '../assets/wind.png'
import './Weather.css'

const Weather = () => {
  const [weatherData, setWeatherData] = useState(false)
  const allIcons = {
    "01d": clear,
    "01n": clear,
    "02d": cloud,
    "02n": cloud,
    "03d": cloud,
    "03n": cloud,
    "04d": drizzle,
    "04n": drizzle,
    "09d": rain,
    "09n": rain,
    "10d": rain,
    "10n": rain,
    "13d": snow,
    "13n": snow,
  
  }
   const searchCity = async (city) => {
  try { const url = 'http://api.openweathermap.org/geo/1.0/direct?q=${city}&units=metric&appid=88d9d8245df34d4f71c2bfa0214624d9'
const response = await fetch( url)
const data = await response.json();
console.log(data)
const icon = allIcons[data.weather[0].icon] || clear_icon;
setWeatherData({
  humidity: data.main.humidity,
  windSpeed: data.wind.speed, 
  temperature: defaultMethod.floor(data.main.temp),
  location: data.name,
  icon: icon
})
  } catch (error) { }}
  
useEffect(() => {searchCity("New York")}, [])
  return (
    <div> 
      <div className="weather">
      
      <div className="search-bar">
      <input
        type="text"
        
      />
      <img src={search} alt="search" />
      </div>
      <img src={clear} alt="" className="weather-icon"/>
      <p className="temperature">{weatherData.temperature}gradi</p>
      <p className="location">{weatherData.location}</p>
      <div className="weather-data">
      <div className="col">
        <img src={humidity} alt="umidity"/>
<div>
<p>{weatherData.humidity}%</p>
<span>Umidità</span>
      </div>
    </div>
    <div className="col">
        <img src={wind} alt="umidity"/>
<div>
<p>{weatherData.windSpeed} km/h</p>
<span>Velocità vento</span>
      </div>
    </div>
    </div>
    </div>
    </div>
  )
}

export default Weather;
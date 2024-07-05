import React, { useEffect, useState, useRef } from 'react';
import search from '../assets/search.png';
import clear from '../assets/clear.png';
import humidity from '../assets/humidity.png';
import cloud from '../assets/cloud.png';
import drizzle from '../assets/drizzle.png';
import rain from '../assets/rain.png';
import snow from '../assets/snow.png';
import wind from '../assets/wind.png';
import './Weather.css';

const Weather = () => {
 
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null);
  
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
  };

  const searchCity = async (city) => {
    if(city === "") {
      alert("inserisci il nome di una città per visualizzare il meteo")
      return;
    }
    try {
      const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=88d9d8245df34d4f71c2bfa0214624d9`;
      const geoResponse = await fetch(geoUrl);
      const geoData = await geoResponse.json();

      if (geoData.length === 0) {
        console.error('City not found');
        return;
      }

      const { lat, lon } = geoData[0];
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=88d9d8245df34d4f71c2bfa0214624d9`;
      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();

      const icon = allIcons[weatherData.weather[0].icon] || clear;

      setWeatherData({
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        temperature: Math.floor(weatherData.main.temp),
        location: weatherData.name,
        icon: icon,
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  useEffect(() => {
    searchCity("Roma");
  }, []);

  return (
    <div>
      <div className="weather">
        <div className="search-bar">
          <input ref={inputRef} type="text" placeholder="Inserisci città" />
          <img src={search} alt="search" onClick={() => searchCity(inputRef.current.value)} />
        </div>
        {weatherData && (
          <>
            <img src={weatherData.icon} alt="weather-icon" className="weather-icon" />
            <p className="temperature">{weatherData.temperature}°C</p>
            <p className="location">{weatherData.location}</p>
            <div className="weather-data">
              <div className="col">
                <img src={humidity} alt="humidity" />
                <div>
                  <p>{weatherData.humidity}%</p>
                  <span>Umidità</span>
                </div>
              </div>
              <div className="col">
                <img src={wind} alt="wind" />
                <div>
                  <p>{weatherData.windSpeed} km/h</p>
                  <span>Velocità vento</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Weather;
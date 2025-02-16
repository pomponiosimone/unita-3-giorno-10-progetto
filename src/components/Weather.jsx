import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
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
  const [forecastData, setForecastData] = useState([]);
  const [showForecast, setShowForecast] = useState(false);
  const [error, setError] = useState(null);

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
    if (!city) {
      alert("Inserisci il nome di una città per visualizzare il meteo");
      return;
    }

    try {
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=88d9d8245df34d4f71c2bfa0214624d9`;
      const geoResponse = await fetch(geoUrl);
      const geoData = await geoResponse.json();

      if (geoData.length === 0) {
        alert('Città non trovata o inesistente');
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

      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=88d9d8245df34d4f71c2bfa0214624d9`;
      const forecastResponse = await fetch(forecastUrl);
      const forecastData = await forecastResponse.json();

      const processedForecast = forecastData.list.map(item => ({
        temperature: Math.floor(item.main.temp),
        icon: allIcons[item.weather[0].icon] || clear,
        time: new Date(item.dt_txt).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }),
      })).filter((_, index) => index % 8 === 0);

      setForecastData(processedForecast);
      setError(null);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Error fetching weather data');
    }
  };

  const toggleForecast = () => {
    setShowForecast(!showForecast);
  };

  useEffect(() => {
    searchCity("Londra");
  }, []);

  return (
    <div>
      <div className="weather">
        <div className="search-bar">
          <input ref={inputRef} type="text" placeholder="Inserisci città" />
          <img src={search} alt="search" onClick={() => searchCity(inputRef.current.value)} />
        </div>
        {error && <p className="error">{error}</p>}
        {weatherData && (
          <>
            <Link to={`/forecast/${weatherData.location}`} className="weather-link">
              <img src={weatherData.icon} alt="weather-icon" className="weather-icon" />
              <p className="temperature">{weatherData.temperature}°C</p>
              <p className="location">{weatherData.location}</p>
            </Link>
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
            <button onClick={toggleForecast}>{showForecast ? 'Chiudi previsioni' : 'Mostra previsioni prossimi 5 giorni'}</button>
            {showForecast && (
              <div className="forecast">
                {forecastData.map((forecast, index) => (
                  <div key={index} className="forecast-item">
                    <p>{forecast.time}</p>
                    <img src={forecast.icon} alt="forecast-icon" />
                    <p>{forecast.temperature}°C</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Weather;
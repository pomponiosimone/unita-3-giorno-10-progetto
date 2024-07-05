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
  const [showForecast, setShowForecast] = useState(false); // State to manage showing forecast

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
    if (city === "") {
      alert("Inserisci il nome di una città per visualizzare il meteo");
      return;
    }
    try {
      const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=397548b42e37257d1c589924b47426ae`;
      const geoResponse = await fetch(geoUrl);
      const geoData = await geoResponse.json();

      if (geoData.length === 0) {
        console.error('City not found');
        return;
      }

      const { lat, lon } = geoData[0];
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=397548b42e37257d1c589924b47426ae`;
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

      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=397548b42e37257d1c589924b47426ae`;
      const forecastResponse = await fetch(forecastUrl);
      const forecastData = await forecastResponse.json();

      const processedForecast = forecastData.list.map(item => ({
        temperature: Math.floor(item.main.temp / 10),
        icon: allIcons[item.weather[0].icon] || clear,
        time: new Date(item.dt_txt).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }), 
      })).filter((item, index) => index % 8 === 0); 

      setForecastData(processedForecast);

    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };
  

  const toggleForecast = () => {
    setShowForecast(!showForecast);
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
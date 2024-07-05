import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import clear from '../assets/clear.png';
import cloud from '../assets/cloud.png';
import drizzle from '../assets/drizzle.png';
import rain from '../assets/rain.png';
import snow from '../assets/snow.png';
import './ForecastDetails.css';

const ForecastDetails = () => {
  const { city } = useParams();
  const [forecastData, setForecastData] = useState([]);

  const weatherIcons = {
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

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=88d9d8245df34d4f71c2bfa0214624d9`;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        const groupedForecasts = {};
        forecastData.list.forEach(item => {
          const date = new Date(item.dt_txt);
          const formattedDate = `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`; 
          if (!groupedForecasts[formattedDate]) {
            groupedForecasts[formattedDate] = {
              temperature: Math.floor(item.main.temp / 10),
              icon: item.weather && item.weather[0] ? weatherIcons[item.weather[0].icon] || clear : clear,
              time: formattedDate,
            };
          }
        });

        const processedForecast = Object.values(groupedForecasts).slice(0, 5);

        while (processedForecast.length < 5) {
          const lastForecast = processedForecast[processedForecast.length - 1];
          processedForecast.push({...lastForecast});
        }

        setForecastData(processedForecast);
      } catch (error) {
        console.error('Error fetching forecast data:', error);
      }
    };

    fetchForecast();
  }, [city, weatherIcons]);

  return (
    <div className='container'>
      <h1 className="text-light">Previsioni per i prossimi giorni a {city}</h1>
      <div className="forecast">
        {forecastData.map((forecast, index) => (
          <div key={index} className="forecast-utility">
            <p>{forecast.time}</p>
            <img src={forecast.icon} alt="forecast-img" />
            <p>{forecast.temperature}°C</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastDetails;
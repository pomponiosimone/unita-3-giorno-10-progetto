import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ForecastDetails = () => {
  const { city } = useParams();
  const [forecastData, setForecastData] = useState(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        // Fetch forecast data based on the city parameter
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=88d9d8245df34d4f71c2bfa0214624d9`;
        const response = await fetch(forecastUrl);
        const data = await response.json();

        setForecastData(data);
      } catch (error) {
        console.error('Error fetching forecast data:', error);
      }
    };

    fetchForecast();
  }, [city]);

  return (
    <div>
      <h2>Forecast Details for {city}</h2>
      {forecastData && (
        <div>
          {forecastData.list.map((item, index) => (
            <div key={index}>
              <p>Date and Time: {item.dt_txt}</p>
              <p>Temperature: {item.main.temp}°C</p>
              <p>Humidity: {item.main.humidity}%</p>
              <p>Wind Speed: {item.wind.speed} km/h</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ForecastDetails;
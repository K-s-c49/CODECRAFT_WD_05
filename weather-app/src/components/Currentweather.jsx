
import React from 'react';

const CurrentWeather = ({ data, location }) => {
  // data is OpenWeather "current" object
  if (!data) return null;
  const icon = data.weather?.[0]?.icon;
  const description = data.weather?.[0]?.description;
  return (
    <div className="current-weather card">
      <h2>{location?.name || data.name}</h2>
      <div className="current-main">
        <div className="temp">{Math.round(data.main.temp)}°C</div>
        <div className="desc">
          {icon && <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt={description} />}
          <div>{description}</div>
        </div>
      </div>
      <div className="details">
        <div>Humidity: {data.main.humidity}%</div>
        <div>Wind: {data.wind.speed} m/s</div>
        <div>Feels like: {Math.round(data.main.feels_like)}°C</div>
      </div>
    </div>
  );
};

export default CurrentWeather;

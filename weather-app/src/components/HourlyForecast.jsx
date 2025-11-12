import React from 'react';

const HourlyForecast = ({ list }) => {
  if (!list || !list.length) return null;

  return (
    <div className="hourly card">
      <h3>Next 24 hours</h3>
      <div className="hourly-list">
        {list.slice(0, 8).map((item) => (
          <div key={item.dt} className="hour">
            <div className="hour-time">{new Date(item.dt * 1000).toLocaleString()}</div>
            <img src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt={item.weather[0].description} />
            <div>{Math.round(item.main.temp)}°C</div>
            <div className="small">{item.weather[0].description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;

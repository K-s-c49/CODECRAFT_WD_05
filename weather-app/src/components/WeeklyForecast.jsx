// client/src/components/WeeklyForecast.jsx
import React from 'react';

const WeeklyForecast = ({ list }) => {
  if (!list || !list.length) return null;

  // pick roughly one per day by index
  const daily = list.filter((_, i) => i % 8 === 0).slice(0, 5); // 5 days
  return (
    <div className="weekly card">
      <h3>Next Days</h3>
      <div className="weekly-list">
        {daily.map((item) => (
          <div key={item.dt} className="day">
            <div>{new Date(item.dt * 1000).toLocaleDateString()}</div>
            <img src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt={item.weather[0].description} />
            <div>{Math.round(item.main.temp)}°C</div>
            <div className="small">{item.weather[0].description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyForecast;

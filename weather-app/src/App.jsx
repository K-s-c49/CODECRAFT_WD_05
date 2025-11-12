// client/src/App.jsx
import { useEffect, useState } from 'react';
import './App.css';
import { getWeather } from './api.js';
import SearchBar from './components/Searchbar.jsx';
import CurrentWeather from './components/Currentweather.jsx';
import HourlyForecast from './components/HourlyForecast.jsx';
import WeeklyForecast from './components/WeeklyForecast.jsx';

function App() {
  const [city, setCity] = useState('Mumbai'); // default Indian city
  const [weatherData, setWeatherData] = useState(null); // { current, forecast }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // fetch by city or by coords
  const fetchByCity = async (c) => {
    setLoading(true);
    setError('');
    try {
      const data = await getWeather({ city: c });
      // data: { current, forecast }
      setWeatherData({
        current: data.current,
        forecast: data.forecast,
        location: { name: c }
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch weather');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchByCoords = async (lat, lon) => {
    setLoading(true);
    setError('');
    try {
      const data = await getWeather({ lat, lon });
      setWeatherData({
        current: data.current,
        forecast: data.forecast,
        location: { name: data.city?.name || data.current.name }
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch weather');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  // On initial load fetch default city
  useEffect(() => {
    fetchByCity(city);
  }, []);

  // Ask browser for location and fetch weather for that location
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser');
      return;
    }
    setError('');
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchByCoords(latitude, longitude);
      },
      (err) => {
        setLoading(false);
        setError('Permission denied or position unavailable');
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  };

  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>Indian Weather App</h1>
          {/* The requested quotation block shown in the app */}
          <blockquote className="quote">
            "Build a web page that fetches weather data from a weather API based on the user's location or a user-inputted location. Display the current weather conditions, temperature, and other relevant information."
          </blockquote>
        </header>

        <div className="controls">
          <SearchBar onSearch={fetchByCity} />
          <button onClick={handleUseMyLocation} className="loc-btn">Use my location</button>
        </div>

        {loading && <p className="status">Loading...</p>}
        {error && <p className="error">{error}</p>}

        {weatherData && (
          <>
            <CurrentWeather data={weatherData.current} location={weatherData.location} />
            <HourlyForecast list={weatherData.forecast.list} />
            <WeeklyForecast list={weatherData.forecast.list} />
          </>
        )}

        {!loading && !weatherData && !error && <p className="hint">Search for a city or click "Use my location".</p>}
      </div>
    </div>
  );
}

export default App;

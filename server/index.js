const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const OPENWEATHER_KEY = process.env.OPENWEATHER_KEY;

if (!OPENWEATHER_KEY) {
  console.error('Missing OPENWEATHER_KEY in .env');
  process.exit(1);
}

app.use(cors());
app.use(express.json());

app.get('/api/weather', async (req, res) => {
  try {
    const { city, lat, lon } = req.query;

    let latitude = lat;
    let longitude = lon;

    if (!city && !(lat && lon)) {
      return res.status(400).json({ error: 'Provide city or lat & lon' });
    }

    // If city provided: call geocoding API to get lat/lon
    if (city && !(lat && lon)) {
      const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${OPENWEATHER_KEY}`;
      const geoRes = await fetch(geoUrl);
      if (!geoRes.ok) {
        const text = await geoRes.text();
        return res.status(geoRes.status).json({ error: 'Geocoding failed', detail: text });
      }
      const geoData = await geoRes.json();
      if (!geoData || !geoData.length) {
        return res.status(404).json({ error: 'City not found' });
      }
      latitude = geoData[0].lat;
      longitude = geoData[0].lon;
    }

    // Call current weather and forecast in parallel
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPENWEATHER_KEY}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPENWEATHER_KEY}`;

    const [currentRes, forecastRes] = await Promise.all([fetch(currentUrl), fetch(forecastUrl)]);

    if (!currentRes.ok) {
      const text = await currentRes.text();
      return res.status(currentRes.status).json({ error: 'Current weather fetch failed', detail: text });
    }
    if (!forecastRes.ok) {
      const text = await forecastRes.text();
      return res.status(forecastRes.status).json({ error: 'Forecast fetch failed', detail: text });
    }

    const current = await currentRes.json();
    const forecast = await forecastRes.json();

    // Return both pieces combined
    res.json({ current, forecast });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Weather backend running on http://localhost:${PORT}`);
});

// client/src/api.js
export const getWeather = async ({ city, lat, lon }) => {
  const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  let url = new URL('/api/weather', base);

  if (city) {
    url.searchParams.set('city', city);
  } else {
    url.searchParams.set('lat', lat);
    url.searchParams.set('lon', lon);
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error: ${res.status} ${text}`);
  }
  return res.json(); // { current, forecast }
}

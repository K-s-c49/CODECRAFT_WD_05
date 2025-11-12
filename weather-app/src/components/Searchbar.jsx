import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!city.trim()) return;
    onSearch(city.trim());
    setCity('');
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <span className="search-icon">🔍</span>
      <input
        className="search-input"
        type="text"
        placeholder="Enter Indian city (e.g. Udaipur, Rajasthan)"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        required
      />
    </form>
  );
};

export default SearchBar;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import playersData from '../data/playersData.json';
import './SearchBar.css';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim().length > 1) {
      const filtered = playersData
        .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 6);
      setSuggestions(filtered);
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  }, [query]);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectPlayer = (player) => {
    setQuery(player.name);
    setShowDropdown(false);
    navigate('/predict', { state: { selectedPlayer: player } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      const matchedPlayer = playersData.find(
        p => p.name.toLowerCase() === query.toLowerCase()
      ) || suggestions[0];

      if (matchedPlayer) {
        navigate('/predict', { state: { selectedPlayer: matchedPlayer } });
      } else {
        navigate('/predict', { state: { searchQuery: query } });
      }
    } else {
      navigate('/predict');
    }
  };

  return (
    <div className="search-bar-wrapper" ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="search-bar-form">
        <div className="search-input-group">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search for a player (e.g., Bellingham, Saka, Gyökeres)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length > 1 && setShowDropdown(true)}
            aria-label="Search for a player"
          />
        </div>
        <button type="submit" className="btn-primary search-submit-btn">
          Get valuation <ArrowRight size={16} />
        </button>
      </form>

      {/* Autocomplete Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <ul className="search-dropdown">
          {suggestions.map((player) => (
            <li
              key={player.player_id || player.name}
              className="search-dropdown-item"
              onClick={() => handleSelectPlayer(player)}
            >
              <div className="dropdown-player-info">
                <span className="player-name">{player.name}</span>
                <span className="player-meta">
                  {player.league} • {player.position}
                </span>
              </div>
              <span className="player-val">
                €{(player.market_value / 1e6).toFixed(1)}M
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

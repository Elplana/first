import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import playersData from '../data/playersData.json';

export function PlayerSearch({ className = '' }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Suggested featured players when search input is empty
  const defaultSuggestions = playersData.filter(p => 
    ['Jude Bellingham', 'Bukayo Saka', 'Viktor Gyökeres', 'Erling Haaland', 'Kylian Mbappé', 'Pedri', 'Lamine Yamal'].includes(p.name)
  ).slice(0, 5);

  // Filter players based on input query
  const filteredPlayers = query.trim()
    ? playersData.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        (p.league && p.league.toLowerCase().includes(query.toLowerCase())) ||
        (p.position && p.position.toLowerCase() === query.toLowerCase())
      ).slice(0, 6)
    : defaultSuggestions;

  const handleSelectPlayer = (player) => {
    setQuery(player.name);
    setIsOpen(false);
    navigate(`/valuation?player=${encodeURIComponent(player.name)}`, {
      state: { selectedPlayer: player }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedIndex >= 0 && filteredPlayers[selectedIndex]) {
      handleSelectPlayer(filteredPlayers[selectedIndex]);
    } else if (query.trim()) {
      const matched = playersData.find(p => p.name.toLowerCase().includes(query.trim().toLowerCase()));
      if (matched) {
        handleSelectPlayer(matched);
      } else {
        navigate(`/valuation?player=${encodeURIComponent(query.trim())}`);
        setIsOpen(false);
      }
    } else {
      // Default fallback search if empty submit
      const defaultPlayer = playersData.find(p => p.name === 'Jude Bellingham') || playersData[0];
      handleSelectPlayer(defaultPlayer);
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true);
        setSelectedIndex(0);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredPlayers.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredPlayers.length - 1));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full max-w-[680px] ${className}`}>
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col sm:flex-row items-stretch border border-[#E8E8E8] bg-white rounded-none shadow-none focus-within:border-[#202020] transition-all"
        style={{ height: '60px' }}
      >
        {/* Input box with Search Icon */}
        <div className="relative flex-1 flex items-center h-full px-4 bg-white">
          <Search className="w-5 h-5 text-[#828282] flex-shrink-0 mr-3" aria-hidden="true" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search for a player (e.g., Bellingham, Saka, Gyökeres)"
            className="w-full h-full bg-transparent text-[16px] text-[#202020] placeholder:text-[#828282] placeholder:text-[16px] outline-none border-none font-sans"
            aria-label="Search for a player"
            aria-autocomplete="list"
            aria-expanded={isOpen}
          />
        </div>

        {/* Get Valuation Button */}
        <button
          type="submit"
          className="h-full w-full sm:w-[190px] flex-shrink-0 bg-[#202020] hover:bg-[#333333] text-white font-medium text-[15px] rounded-none flex items-center justify-center gap-2 group transition-colors duration-200 focus-visible:outline-none cursor-pointer border-none"
        >
          <span>Get valuation</span>
          <ArrowRight className="w-[16px] h-[16px] text-white transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </form>

      {/* Dynamic Autocomplete Dropdown */}
      {isOpen && filteredPlayers.length > 0 && (
        <ul
          className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#E8E8E8] rounded-none shadow-lg z-50 overflow-hidden list-none m-0 p-0 text-left"
          role="listbox"
        >
          {filteredPlayers.map((player, idx) => (
            <li
              key={player.player_id || idx}
              role="option"
              aria-selected={idx === selectedIndex}
              onClick={() => handleSelectPlayer(player)}
              onMouseEnter={() => setSelectedIndex(idx)}
              className={`px-4 py-3 cursor-pointer flex justify-between items-center text-left border-b border-[#F5F5F5] last:border-b-0 transition-colors duration-150 ${
                idx === selectedIndex ? 'bg-[#F5F5F5]' : 'hover:bg-[#F5F5F5]'
              }`}
            >
              <div className="flex flex-col">
                <span className="font-medium text-[#202020] text-[15px]">
                  {player.name}
                </span>
                <span className="text-[13px] text-[#828282]">
                  {player.league || 'European Top League'} • {player.position || 'Forward'}
                </span>
              </div>
              <span className="text-[13px] font-semibold text-[#202020] bg-[#EFEFEF] px-2.5 py-1 rounded-none border border-[#E8E8E8]">
                €{(player.market_value / 1e6).toFixed(1)}M
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Also export as SearchBar for backward compatibility
export { PlayerSearch as SearchBar };

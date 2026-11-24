import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ArrowUpRight } from 'lucide-react';
import playersData from '../data/playersData.json';
import './Players.css';

export function Players() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('ALL');
  const [selectedPosition, setSelectedPosition] = useState('ALL');
  const [sortBy, setSortBy] = useState('market_value');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const filteredPlayers = useMemo(() => {
    return playersData.filter((player) => {
      const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLeague = selectedLeague === 'ALL' || player.league === selectedLeague;
      const matchesPosition = selectedPosition === 'ALL' || player.position === selectedPosition;
      return matchesSearch && matchesLeague && matchesPosition;
    }).sort((a, b) => {
      let valA = a[sortBy] ?? 0;
      let valB = b[sortBy] ?? 0;
      if (typeof valA === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
  }, [searchTerm, selectedLeague, selectedPosition, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredPlayers.length / pageSize);
  const paginatedPlayers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPlayers.slice(start, start + pageSize);
  }, [filteredPlayers, currentPage]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleSelectPlayer = (player) => {
    navigate('/predict', { state: { selectedPlayer: player } });
  };

  return (
    <div className="players-page section-padding">
      <div className="container">
        {/* Page Header */}
        <div className="players-header border-bottom-mist">
          <div>
            <span className="micro-label">DATABASE OBSERVATORY</span>
            <h1 className="headline-hero players-title">
              European Player Database
            </h1>
          </div>
          <span className="players-count-badge">
            {filteredPlayers.length.toLocaleString()} Active Profiles
          </span>
        </div>

        {/* Filter Controls Bar */}
        <div className="filter-controls-bar margin-top-md">
          <div className="search-filter-input">
            <Search size={16} className="search-filter-icon" />
            <input
              type="text"
              placeholder="Search player name..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="editorial-input search-box-input"
            />
          </div>

          <div className="filter-select-group">
            <div className="filter-select-item">
              <Filter size={14} className="filter-icon" />
              <select
                value={selectedLeague}
                onChange={(e) => { setSelectedLeague(e.target.value); setCurrentPage(1); }}
                className="editorial-select filter-select"
              >
                <option value="ALL">All Leagues</option>
                <option value="Premier League">Premier League</option>
                <option value="LaLiga">LaLiga</option>
                <option value="Serie A">Serie A</option>
                <option value="Bundesliga">Bundesliga</option>
                <option value="Ligue 1">Ligue 1</option>
                <option value="Eredivisie">Eredivisie</option>
              </select>
            </div>

            <div className="filter-select-item">
              <select
                value={selectedPosition}
                onChange={(e) => { setSelectedPosition(e.target.value); setCurrentPage(1); }}
                className="editorial-select filter-select"
              >
                <option value="ALL">All Positions</option>
                <option value="F">Forwards (F)</option>
                <option value="M">Midfielders (M)</option>
                <option value="D">Defenders (D)</option>
                <option value="G">Goalkeepers (G)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Player Table */}
        <div className="table-responsive-wrapper margin-top-md">
          <table className="editorial-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} className="sortable">
                  Player Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('league')} className="sortable">
                  League {sortBy === 'league' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('position')} className="sortable">
                  Position {sortBy === 'position' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('market_value')} className="sortable text-right">
                  Market Value (€) {sortBy === 'market_value' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('rating')} className="sortable text-right">
                  Rating {sortBy === 'rating' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-right">Goals / Assists</th>
                <th className="text-right">Minutes</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPlayers.length > 0 ? (
                paginatedPlayers.map((player) => (
                  <tr key={player.player_id} className="table-row-hover">
                    <td className="font-weight-500">{player.name}</td>
                    <td><span className="badge-tag">{player.league}</span></td>
                    <td><span className="pos-code">{player.position}</span></td>
                    <td className="text-right font-display val-highlight">
                      €{(player.market_value / 1e6).toFixed(1)}M
                    </td>
                    <td className="text-right font-weight-500">{player.rating?.toFixed(2)}</td>
                    <td className="text-right">{player.goals} G / {player.assists} A</td>
                    <td className="text-right">{player.minutes_played}</td>
                    <td className="text-center">
                      <button
                        onClick={() => handleSelectPlayer(player)}
                        className="btn-primary btn-xs"
                      >
                        Evaluate <ArrowUpRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="empty-table-cell">
                    No players found matching current search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="pagination-bar border-top-mist margin-top-md">
            <span className="pagination-info">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredPlayers.length)} of {filteredPlayers.length}
            </span>
            <div className="pagination-buttons">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="btn-secondary btn-sm"
              >
                Previous
              </button>
              <span className="page-num-display">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="btn-secondary btn-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

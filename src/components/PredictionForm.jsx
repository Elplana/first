import React, { useState, useEffect } from 'react';
import { ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import playersData from '../data/playersData.json';
import './PredictionForm.css';

const DEFAULT_FORM_DATA = {
  playerName: '',
  league: 'Premier League',
  position: 'F',
  minutes_played: 2200,
  appearances: 26,
  matches_started: 24,
  rating: 7.4,
  goals: 14,
  assists: 6,
  expected_goals: 13.2,
  expected_assists: 5.1,
  total_shots: 68,
  shots_on_target: 28,
  tackles: 18,
  interceptions: 8,
  saves: 0,
  yellow_cards: 3,
  red_cards: 0
};

export function PredictionForm({ initialPlayer, onSubmit, isLoading }) {
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialPlayer) {
      setFormData({
        playerName: initialPlayer.name || '',
        league: initialPlayer.league || 'Premier League',
        position: initialPlayer.position || 'F',
        minutes_played: Number(initialPlayer.minutes_played) || 1800,
        appearances: Number(initialPlayer.appearances) || 20,
        matches_started: Number(initialPlayer.matches_started) || 18,
        rating: Number(initialPlayer.rating?.toFixed(2)) || 7.2,
        goals: Number(initialPlayer.goals) || 0,
        assists: Number(initialPlayer.assists) || 0,
        expected_goals: Number(initialPlayer.expected_goals?.toFixed(1)) || 0,
        expected_assists: Number(initialPlayer.expected_assists?.toFixed(1)) || 0,
        total_shots: Number(initialPlayer.total_shots) || 0,
        shots_on_target: Number(initialPlayer.shots_on_target) || 0,
        tackles: Number(initialPlayer.tackles) || 0,
        interceptions: Number(initialPlayer.interceptions) || 0,
        saves: Number(initialPlayer.saves) || 0,
        yellow_cards: Number(initialPlayer.yellow_cards) || 0,
        red_cards: Number(initialPlayer.red_cards) || 0,
      });
    }
  }, [initialPlayer]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let parsedVal = value;
    if (type === 'number') {
      parsedVal = value === '' ? '' : parseFloat(value);
    }
    setFormData((prev) => ({ ...prev, [name]: parsedVal }));

    // Clear error for field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (formData.rating < 1.0 || formData.rating > 10.0 || isNaN(formData.rating)) {
      newErrors.rating = 'Rating must be between 1.0 and 10.0';
    }
    if (formData.minutes_played < 0 || isNaN(formData.minutes_played)) {
      newErrors.minutes_played = 'Minutes played cannot be negative';
    }
    if (formData.appearances < 0 || isNaN(formData.appearances)) {
      newErrors.appearances = 'Appearances cannot be negative';
    }
    if (formData.goals < 0 || isNaN(formData.goals)) {
      newErrors.goals = 'Goals cannot be negative';
    }
    if (formData.assists < 0 || isNaN(formData.assists)) {
      newErrors.assists = 'Assists cannot be negative';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  const handleSelectPreset = (player) => {
    setFormData({
      playerName: player.name,
      league: player.league,
      position: player.position,
      minutes_played: Number(player.minutes_played),
      appearances: Number(player.appearances),
      matches_started: Number(player.matches_started),
      rating: Number(player.rating?.toFixed(2)),
      goals: Number(player.goals),
      assists: Number(player.assists),
      expected_goals: Number(player.expected_goals?.toFixed(1)),
      expected_assists: Number(player.expected_assists?.toFixed(1)),
      total_shots: Number(player.total_shots),
      shots_on_target: Number(player.shots_on_target),
      tackles: Number(player.tackles),
      interceptions: Number(player.interceptions),
      saves: Number(player.saves),
      yellow_cards: Number(player.yellow_cards),
      red_cards: Number(player.red_cards),
    });
    setErrors({});
  };

  const featuredPresetNames = ['Bukayo Saka', 'Viktor Gyökeres', 'Martin Odegaard', 'Declan Rice', 'Eberechi Eze'];
  const featuredPresets = playersData.filter(p => featuredPresetNames.includes(p.name)).slice(0, 5);

  return (
    <div className="prediction-form-card">
      <div className="form-header border-bottom-mist">
        <div>
          <span className="micro-label">MODEL INPUT PARAMETERS</span>
          <h2 className="form-title">
            {formData.playerName ? `Profile: ${formData.playerName}` : 'Configure Player Metrics'}
          </h2>
        </div>

        {/* Quick Presets */}
        <div className="preset-selector">
          <span className="preset-label"><Sparkles size={13} /> Sample Profiles:</span>
          <div className="preset-chips">
            {featuredPresets.map((p) => (
              <button
                key={p.name}
                type="button"
                className={`preset-chip ${formData.playerName === p.name ? 'active' : ''}`}
                onClick={() => handleSelectPreset(p)}
              >
                {p.name.split(' ')[1] || p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="prediction-form-grid">
        {/* Section 1: Context */}
        <div className="form-section">
          <h3 className="section-subheading">1. Context & Profile</h3>
          <div className="input-grid">
            <div className="input-field">
              <label htmlFor="league" className="field-label">League</label>
              <select
                id="league"
                name="league"
                value={formData.league}
                onChange={handleChange}
                className="editorial-select"
              >
                <option value="Premier League">Premier League</option>
                <option value="LaLiga">LaLiga</option>
                <option value="Serie A">Serie A</option>
                <option value="Bundesliga">Bundesliga</option>
                <option value="Ligue 1">Ligue 1</option>
                <option value="Eredivisie">Eredivisie</option>
                <option value="Liga Portugal">Liga Portugal</option>
                <option value="Super Lig">Super Lig</option>
              </select>
            </div>

            <div className="input-field">
              <label htmlFor="position" className="field-label">Position</label>
              <select
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="editorial-select"
              >
                <option value="F">Forward (F)</option>
                <option value="M">Midfielder (M)</option>
                <option value="D">Defender (D)</option>
                <option value="G">Goalkeeper (G)</option>
              </select>
            </div>

            <div className="input-field">
              <label htmlFor="rating" className="field-label">Average Rating (1.0–10.0)</label>
              <input
                id="rating"
                type="number"
                step="0.1"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className={`editorial-input ${errors.rating ? 'input-error' : ''}`}
              />
              {errors.rating && <span className="field-error">{errors.rating}</span>}
            </div>
          </div>
        </div>

        {/* Section 2: Playing Time */}
        <div className="form-section">
          <h3 className="section-subheading">2. Match Time & Involvement</h3>
          <div className="input-grid">
            <div className="input-field">
              <label htmlFor="minutes_played" className="field-label">Minutes Played</label>
              <input
                id="minutes_played"
                type="number"
                name="minutes_played"
                value={formData.minutes_played}
                onChange={handleChange}
                className={`editorial-input ${errors.minutes_played ? 'input-error' : ''}`}
              />
              {errors.minutes_played && <span className="field-error">{errors.minutes_played}</span>}
            </div>

            <div className="input-field">
              <label htmlFor="appearances" className="field-label">Appearances</label>
              <input
                id="appearances"
                type="number"
                name="appearances"
                value={formData.appearances}
                onChange={handleChange}
                className="editorial-input"
              />
            </div>

            <div className="input-field">
              <label htmlFor="matches_started" className="field-label">Matches Started</label>
              <input
                id="matches_started"
                type="number"
                name="matches_started"
                value={formData.matches_started}
                onChange={handleChange}
                className="editorial-input"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Attacking Output */}
        <div className="form-section">
          <h3 className="section-subheading">3. Attacking Performance</h3>
          <div className="input-grid">
            <div className="input-field">
              <label htmlFor="goals" className="field-label">Goals Scored</label>
              <input
                id="goals"
                type="number"
                name="goals"
                value={formData.goals}
                onChange={handleChange}
                className="editorial-input"
              />
            </div>

            <div className="input-field">
              <label htmlFor="assists" className="field-label">Assists</label>
              <input
                id="assists"
                type="number"
                name="assists"
                value={formData.assists}
                onChange={handleChange}
                className="editorial-input"
              />
            </div>

            <div className="input-field">
              <label htmlFor="expected_goals" className="field-label">Expected Goals (xG)</label>
              <input
                id="expected_goals"
                type="number"
                step="0.1"
                name="expected_goals"
                value={formData.expected_goals}
                onChange={handleChange}
                className="editorial-input"
              />
            </div>

            <div className="input-field">
              <label htmlFor="expected_assists" className="field-label">Expected Assists (xA)</label>
              <input
                id="expected_assists"
                type="number"
                step="0.1"
                name="expected_assists"
                value={formData.expected_assists}
                onChange={handleChange}
                className="editorial-input"
              />
            </div>

            <div className="input-field">
              <label htmlFor="total_shots" className="field-label">Total Shots</label>
              <input
                id="total_shots"
                type="number"
                name="total_shots"
                value={formData.total_shots}
                onChange={handleChange}
                className="editorial-input"
              />
            </div>

            <div className="input-field">
              <label htmlFor="shots_on_target" className="field-label">Shots on Target</label>
              <input
                id="shots_on_target"
                type="number"
                name="shots_on_target"
                value={formData.shots_on_target}
                onChange={handleChange}
                className="editorial-input"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Defensive & Disciplinary */}
        <div className="form-section">
          <h3 className="section-subheading">4. Defensive & Discipline</h3>
          <div className="input-grid">
            <div className="input-field">
              <label htmlFor="tackles" className="field-label">Tackles</label>
              <input
                id="tackles"
                type="number"
                name="tackles"
                value={formData.tackles}
                onChange={handleChange}
                className="editorial-input"
              />
            </div>

            <div className="input-field">
              <label htmlFor="interceptions" className="field-label">Interceptions</label>
              <input
                id="interceptions"
                type="number"
                name="interceptions"
                value={formData.interceptions}
                onChange={handleChange}
                className="editorial-input"
              />
            </div>

            {formData.position === 'G' && (
              <div className="input-field">
                <label htmlFor="saves" className="field-label">Saves</label>
                <input
                  id="saves"
                  type="number"
                  name="saves"
                  value={formData.saves}
                  onChange={handleChange}
                  className="editorial-input"
                />
              </div>
            )}

            <div className="input-field">
              <label htmlFor="yellow_cards" className="field-label">Yellow Cards</label>
              <input
                id="yellow_cards"
                type="number"
                name="yellow_cards"
                value={formData.yellow_cards}
                onChange={handleChange}
                className="editorial-input"
              />
            </div>

            <div className="input-field">
              <label htmlFor="red_cards" className="field-label">Red Cards</label>
              <input
                id="red_cards"
                type="number"
                name="red_cards"
                value={formData.red_cards}
                onChange={handleChange}
                className="editorial-input"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="form-submit-bar border-top-mist">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setFormData(DEFAULT_FORM_DATA)}
          >
            <RotateCcw size={14} /> Reset
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary form-submit-btn"
          >
            {isLoading ? 'Calculating valuation...' : 'Calculate Market Valuation'}
            {!isLoading && <ArrowRight size={16} />}
          </button>
        </div>
      </form>
    </div>
  );
}

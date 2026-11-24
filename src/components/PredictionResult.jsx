import React from 'react';
import { Link } from 'react-router-dom';
import { MetricCard } from './MetricCard';
import { ValuationChart } from './ValuationChart';
import { ArrowRight, RotateCcw, Database, BookOpen } from 'lucide-react';
import './PredictionResult.css';

export function PredictionResult({ result, formData, onReset }) {
  if (!result) return null;

  const rawVal = result.predicted_market_value_euros || 0;
  const formattedVal = result.formatted_market_value || `€${(rawVal / 1e6).toFixed(2)}M`;

  const per90Goals = formData.minutes_played > 0 
    ? ((formData.goals / formData.minutes_played) * 90).toFixed(2) 
    : '0.00';
  const per90Assists = formData.minutes_played > 0 
    ? ((formData.assists / formData.minutes_played) * 90).toFixed(2) 
    : '0.00';

  return (
    <div className="prediction-result-container">
      {/* Editorial Valuation Hero Box */}
      <div className="result-hero-box card-ash">
        <div className="result-header">
          <span className="micro-label">ESTIMATED MARKET VALUATION</span>
          <span className="result-badge">
            AI SNAPSHOT • {formData.league}
          </span>
        </div>

        <div className="result-value-display">
          <h2 className="result-formatted-value">
            {formattedVal}
            <span className="ember-dot" />
          </h2>
          <span className="result-value-sub">
            Model Prediction (Raw: €{rawVal.toLocaleString('en-US')})
          </span>
        </div>

        <div className="result-context-pills">
          <span className="badge-tag">{formData.league}</span>
          <span className="badge-tag">Position: {formData.position}</span>
          <span className="badge-tag">Rating: {formData.rating}/10</span>
          <span className="badge-tag">{formData.minutes_played.toLocaleString()} mins</span>
        </div>
      </div>

      {/* Grid: Supporting Metrics & Valuation Chart */}
      <div className="result-details-grid">
        <div className="result-metrics-column">
          <h3 className="section-subheading">Key Supporting Performance Drivers</h3>
          <div className="metrics-grid">
            <MetricCard 
              label="Goals Scored" 
              value={formData.goals} 
              subtext={`${per90Goals} per 90 mins`} 
              accent={true} 
            />
            <MetricCard 
              label="Assists" 
              value={formData.assists} 
              subtext={`${per90Assists} per 90 mins`} 
            />
            <MetricCard 
              label="Expected Goals (xG)" 
              value={formData.expected_goals} 
              subtext={`xG Diff: ${(formData.goals - formData.expected_goals).toFixed(1)}`} 
            />
            <MetricCard 
              label="Average Rating" 
              value={formData.rating} 
              subtext="Over last season" 
            />
            <MetricCard 
              label="Total Shots / Target" 
              value={`${formData.total_shots} / ${formData.shots_on_target}`} 
              subtext={`${formData.total_shots > 0 ? ((formData.shots_on_target/formData.total_shots)*100).toFixed(0) : 0}% Accuracy`} 
            />
            <MetricCard 
              label="Defensive Contributions" 
              value={`${formData.tackles + formData.interceptions}`} 
              subtext={`${formData.tackles} Tkl • ${formData.interceptions} Int`} 
            />
          </div>
        </div>

        <div className="result-chart-column">
          <ValuationChart 
            marketValue={rawVal} 
            position={formData.position} 
            league={formData.league} 
          />
        </div>
      </div>

      {/* Actions */}
      <div className="result-actions-bar border-top-mist">
        <button onClick={onReset} className="btn-secondary">
          <RotateCcw size={15} /> Predict another player
        </button>

        <div className="result-action-links">
          <Link to="/players" className="btn-secondary">
            <Database size={15} /> Explore player database
          </Link>
          <Link to="/methodology" className="btn-primary">
            <BookOpen size={15} /> Read methodology <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}

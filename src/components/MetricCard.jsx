import React from 'react';
import './MetricCard.css';

export function MetricCard({ label, value, subtext, accent }) {
  return (
    <div className={`metric-card ${accent ? 'metric-card-accent' : ''}`}>
      <span className="micro-label metric-label">{label}</span>
      <div className="metric-value-row">
        <span className="metric-value">{value}</span>
        {accent && <span className="ember-dot" />}
      </div>
      {subtext && <span className="metric-subtext">{subtext}</span>}
    </div>
  );
}

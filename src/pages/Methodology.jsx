import React from 'react';
import { Link } from 'react-router-dom';
import { SectionReveal } from '../components/SectionReveal';
import { ArrowUpRight, CheckCircle2, ShieldAlert, Cpu, BarChart2, Database, Sliders } from 'lucide-react';
import './Methodology.css';

export function Methodology() {
  return (
    <div className="methodology-page section-padding">
      <div className="container">
        {/* Page Header */}
        <div className="methodology-header border-bottom-mist">
          <div>
            <span className="micro-label">TECHNICAL DOCUMENTATION</span>
            <h1 className="headline-hero methodology-title">
              Model Architecture & Methodology
            </h1>
          </div>
          <Link to="/predict" className="btn-primary">
            Test Engine <ArrowUpRight size={15} />
          </Link>
        </div>

        {/* Introduction Overview */}
        <SectionReveal>
          <div className="methodology-intro-box card-ash margin-top-lg">
            <h2 className="section-title">Valuation Engine Overview</h2>
            <p className="intro-lead-text margin-top-xs">
              FootballIQ employs machine learning models trained on high-granularity European player performance data to estimate a player's fair market valuation. The model learns non-linear relationships between position, league context, age, playing time, and 26 attacking and defensive per-90 metrics.
            </p>
          </div>
        </SectionReveal>

        {/* 4 Methodology Columns */}
        <div className="methodology-grid margin-top-lg">
          {/* Column 1: Data Preprocessing */}
          <SectionReveal delay={100}>
            <div className="methodology-card card-fog">
              <div className="methodology-card-icon"><Database size={24} /></div>
              <h3 className="card-heading">1. Data Sources & Preprocessing</h3>
              <p className="card-text">
                Dataset comprised of 3,670 player season profiles across top European leagues (Premier League, LaLiga, Serie A, Bundesliga, Ligue 1, Eredivisie, Liga Portugal, Super Lig).
              </p>
              <ul className="methodology-bullet-list">
                <li><CheckCircle2 size={14} /> Missing values imputed via position-group median</li>
                <li><CheckCircle2 size={14} /> Outliers bounded to valid domain ranges</li>
                <li><CheckCircle2 size={14} /> One-hot encoding for league and position</li>
              </ul>
            </div>
          </SectionReveal>

          {/* Column 2: Target Transformation */}
          <SectionReveal delay={200}>
            <div className="methodology-card card-fog">
              <div className="methodology-card-icon"><Sliders size={24} /></div>
              <h3 className="card-heading">2. Target Log Transformation</h3>
              <p className="card-text">
                European football market values follow a log-normal distribution with extreme upper outliers (e.g. €180M+ marquee players).
              </p>
              <div className="formula-box">
                <code>y_log = log(market_value + 1)</code>
              </div>
              <p className="card-text">
                Inference predictions are converted back via <code>exp(pred) - 1</code>, preventing structural bias toward mid-tier values.
              </p>
            </div>
          </SectionReveal>

          {/* Column 3: Feature Engineering */}
          <SectionReveal delay={300}>
            <div className="methodology-card card-fog">
              <div className="methodology-card-icon"><Cpu size={24} /></div>
              <h3 className="card-heading">3. Feature Engineering</h3>
              <p className="card-text">
                Raw volume totals fluctuate with playing time. The engine calculates per-90 normalized metrics for consistent cross-player comparison:
              </p>
              <ul className="methodology-bullet-list">
                <li><CheckCircle2 size={14} /> Goals & Assists per 90 (N90 = Mins / 90)</li>
                <li><CheckCircle2 size={14} /> Expected Goals (xG) & Expected Assists (xA)</li>
                <li><CheckCircle2 size={14} /> Shot accuracy (Shots on Target / Total Shots)</li>
                <li><CheckCircle2 size={14} /> Defensive actions: Tackles & Interceptions per 90</li>
              </ul>
            </div>
          </SectionReveal>

          {/* Column 4: Validation */}
          <SectionReveal delay={400}>
            <div className="methodology-card card-fog">
              <div className="methodology-card-icon"><BarChart2 size={24} /></div>
              <h3 className="card-heading">4. Model Evaluation & Metrics</h3>
              <p className="card-text">
                Candidate models were evaluated using 5-Fold Stratified Cross Validation. Metrics achieved on validation splits:
              </p>
              <div className="metrics-summary-table">
                <div className="summary-row">
                  <span>R² Score (Log Target)</span>
                  <span className="summary-val font-display">0.8420</span>
                </div>
                <div className="summary-row">
                  <span>Mean Absolute Error</span>
                  <span className="summary-val font-display">€6.3M</span>
                </div>
                <div className="summary-row">
                  <span>Cross-Val Folds</span>
                  <span className="summary-val font-display">5 Folds</span>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>

        {/* Analytical Notice & Limitations */}
        <SectionReveal delay={500}>
          <div className="analytical-notice-box card-ivory margin-top-lg border-top-mist border-bottom-mist">
            <div className="notice-icon-col">
              <ShieldAlert size={24} className="notice-icon" />
            </div>
            <div className="notice-text-col">
              <h3 className="notice-title">Analytical Interpretation & Limitations</h3>
              <p className="notice-text">
                FootballIQ estimates a player's <strong>current market value from a performance snapshot</strong>. Valuations do not account for contract expiration dates, release clauses, agent negotiations, or emergency transfer window inflation. The engine should be interpreted as an objective statistical benchmark, not a guaranteed transfer fee.
              </p>
            </div>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}

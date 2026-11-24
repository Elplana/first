import React from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { SectionReveal } from '../components/SectionReveal';
import { ArrowUpRight, Cpu, Layers, BarChart3, Search, Database } from 'lucide-react';
import playersData from '../data/playersData.json';
import './Home.css';

export function Home() {
  const featuredPlayers = playersData.slice(0, 4);

  return (
    <div className="home-page">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. How FootballIQ Works Section */}
      <section id="how-it-works" className="section-padding bg-fog border-top-mist border-bottom-mist">
        <div className="container">
          <SectionReveal>
            <div className="section-header text-center">
              <span className="micro-label">THE VALUATION PROCESS</span>
              <h2 className="section-title margin-top-sm">
                From performance snapshot to valuation.
              </h2>
            </div>
          </SectionReveal>

          <div className="process-grid margin-top-lg">
            <SectionReveal delay={100}>
              <div className="process-card card-ash">
                <div className="process-num">01</div>
                <div className="process-icon"><Database size={22} /></div>
                <h3 className="process-title">Statistical Snapshot</h3>
                <p className="process-desc">
                  Captures over 26 core per-90 metrics including xG, xA, key passes, shot creation, tackles, and league difficulty factors.
                </p>
              </div>
            </SectionReveal>

            <SectionReveal delay={200}>
              <div className="process-card card-ash">
                <div className="process-num">02</div>
                <div className="process-icon"><Cpu size={22} /></div>
                <h3 className="process-title">Machine Learning Inference</h3>
                <p className="process-desc">
                  Evaluated through a trained machine learning pipeline trained across 3,670 European player seasons across top leagues.
                </p>
              </div>
            </SectionReveal>

            <SectionReveal delay={300}>
              <div className="process-card card-ash">
                <div className="process-num">03</div>
                <div className="process-icon"><BarChart3 size={22} /></div>
                <h3 className="process-title">Precision Output</h3>
                <p className="process-desc">
                  Outputs estimated raw market valuation in Euros (€), along with contextual percentile benchmarks and position comparisons.
                </p>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* 3. Featured Player Sample Valuations */}
      <section className="section-padding">
        <div className="container">
          <SectionReveal>
            <div className="section-header-flex">
              <div>
                <span className="micro-label">SAMPLE OBSERVATIONS</span>
                <h2 className="section-title margin-top-sm">Featured Player Valuations</h2>
              </div>
              <Link to="/players" className="btn-secondary">
                View database ({playersData.length.toLocaleString()} players) <ArrowUpRight size={15} />
              </Link>
            </div>
          </SectionReveal>

          <div className="featured-players-grid margin-top-lg">
            {featuredPlayers.map((player, idx) => (
              <SectionReveal key={player.player_id} delay={idx * 100}>
                <div className="player-val-card card-ash">
                  <div className="player-card-header">
                    <span className="player-league-badge">{player.league}</span>
                    <span className="micro-label">{player.position}</span>
                  </div>

                  <h3 className="player-card-name">{player.name}</h3>

                  <div className="player-card-metrics">
                    <div className="metric-item">
                      <span className="metric-item-label">Goals / Assists</span>
                      <span className="metric-item-val">{player.goals} G / {player.assists} A</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-item-label">Minutes</span>
                      <span className="metric-item-val">{player.minutes_played}</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-item-label">Match Rating</span>
                      <span className="metric-item-val">{player.rating?.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="player-card-footer border-top-mist">
                    <div className="player-val-box">
                      <span className="micro-label">VALUATION</span>
                      <span className="player-val-num">€{(player.market_value / 1e6).toFixed(1)}M</span>
                    </div>
                    <Link
                      to="/predict"
                      state={{ selectedPlayer: player }}
                      className="btn-primary btn-sm"
                    >
                      Evaluate <ArrowUpRight size={13} />
                    </Link>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Methodology Brief Section */}
      <section className="section-padding bg-ivory border-top-mist border-bottom-mist">
        <div className="container">
          <SectionReveal>
            <div className="editorial-callout-grid">
              <div className="callout-left">
                <span className="micro-label">MODEL TRANSPARENCY</span>
                <h2 className="section-title margin-top-sm">
                  Built on rigorous cross-validation and feature engineering.
                </h2>
              </div>
              <div className="callout-right">
                <p className="editorial-lead-text">
                  FootballIQ avoids black-box heuristics. Our pipeline transforms raw stats into log-normalized targets to eliminate extreme valuation distortion, maintaining low Mean Absolute Error across all European positions.
                </p>
                <div className="callout-actions margin-top-md">
                  <Link to="/methodology" className="btn-primary">
                    Read detailed methodology <ArrowUpRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* 5. Minimal CTA Section */}
      <section className="section-padding text-center">
        <div className="container">
          <SectionReveal>
            <div className="cta-box card-ash">
              <span className="micro-label">TRY THE VALUATION ENGINE</span>
              <h2 className="section-title margin-top-sm">
                Evaluate any player in seconds.
              </h2>
              <p className="cta-desc margin-top-xs">
                Select from 3,670 European player profiles or input custom metrics to compute instantaneous market estimates.
              </p>
              <div className="cta-buttons margin-top-md">
                <Link to="/predict" className="btn-primary btn-lg">
                  Launch Valuation Engine <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}

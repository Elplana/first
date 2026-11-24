import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export function Footer() {
  return (
    <footer className="footer-container border-top-mist">
      <div className="container footer-content">
        <div className="footer-top-grid">
          {/* Brand & Purpose */}
          <div className="footer-brand-col">
            <Link to="/" className="footer-brand">
              <img
                src="/assets/footballiq-logo.svg"
                onError={(e) => { e.target.src = '/footballiq-logo.svg'; }}
                alt="FootballIQ Logo"
                className="h-[24px] w-auto"
              />
            </Link>
            <p className="footer-tagline">
              European Player Market Value Predictor. An editorial football data publication & AI-powered valuation engine.
            </p>
            <div className="footer-status-pill">
              <span className="status-dot"></span>
              <span>FastAPI Backend Online • Model v1.0</span>
            </div>
          </div>

          {/* Navigation Column 1 */}
          <div className="footer-links-col">
            <span className="micro-label footer-col-heading">NAVIGATION</span>
            <ul className="footer-nav-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/predict">Valuation Engine</Link></li>
              <li><Link to="/players">Player Database</Link></li>
              <li><Link to="/methodology">Methodology</Link></li>
            </ul>
          </div>

          {/* Navigation Column 2 */}
          <div className="footer-links-col">
            <span className="micro-label footer-col-heading">LEAGUES COVERED</span>
            <ul className="footer-nav-list text-muted">
              <li>Premier League</li>
              <li>LaLiga</li>
              <li>Serie A</li>
              <li>Bundesliga</li>
              <li>Ligue 1 & Eredivisie</li>
            </ul>
          </div>

          {/* Legal / Disclaimer */}
          <div className="footer-links-col">
            <span className="micro-label footer-col-heading">ANALYTICAL NOTICE</span>
            <p className="footer-disclaimer">
              FootballIQ estimates a player's current market value based on performance metrics and league context. Valuations are analytical model estimates, not guaranteed transfer values.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar border-top-mist">
          <span className="footer-copyright">
            © {new Date().getFullYear()} FootballIQ. Built for modern football analytics.
          </span>
          <span className="footer-tech-stack">
            React • Vite • FastAPI • Machine Learning
          </span>
        </div>
      </div>
    </footer>
  );
}

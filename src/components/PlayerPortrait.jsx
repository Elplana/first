import React, { useEffect, useState } from 'react';
import './PlayerPortrait.css';

export function PlayerPortrait() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Subtle parallax shift up to -40px on desktop
      if (window.innerWidth >= 1024) {
        const offset = Math.min(window.scrollY * 0.15, 40);
        setScrollY(offset);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="player-portrait-container">
      {/* Subtle Warm Halo */}
      <div className="portrait-warm-halo" />

      {/* Editorial Dotted Texture Overlay (Behind & Framing) */}
      <div className="portrait-dotted-grid" />

      {/* Editorial Micro Annotation */}
      <div className="portrait-annotation">
        <span className="micro-label">PROFILE / REF 2026.09</span>
        <span className="annotation-tag">AGE 22 • ATTACKER</span>
      </div>

      {/* Main Grayscale Player Image with subtle parallax */}
      <div 
        className="portrait-image-wrapper"
        style={{ transform: `translateY(-${scrollY}px)` }}
      >
        <img 
          src="/player_portrait.png" 
          alt="European Football Player Editorial Portrait" 
          className="portrait-img"
        />
      </div>

      {/* Bottom Editorial Watermark Annotation */}
      <div className="portrait-footer-tag">
        <span className="micro-label">DATA SNAPSHOT</span>
        <span className="footer-tag-value">SERIE A / PL / LALIGA</span>
      </div>
    </div>
  );
}

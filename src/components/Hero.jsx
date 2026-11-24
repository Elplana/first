import React, { useState, useEffect, useRef } from 'react';
import { PlayerSearch } from './PlayerSearch';
import './Hero.css';

export function Hero() {
  const [scrollState, setScrollState] = useState({
    scale: 1.0,
    opacity: 1.0,
    blur: 0.0,
    translateY: 0
  });

  const animFrameId = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (animFrameId.current) return;

      animFrameId.current = requestAnimationFrame(() => {
        animFrameId.current = null;
        const scrollY = window.scrollY;
        const maxScroll = 450;
        const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

        // Piecewise keyframe interpolation matching timeline spec (0%, 25%, 50%, 75%, 100%)
        let scale, opacity, blur, translateY;

        if (progress <= 0.25) {
          const t = progress / 0.25;
          scale = 1.0 - t * (1.0 - 0.92);
          opacity = 1.0 - t * (1.0 - 0.95);
          blur = 0.0 + t * 0.5;
          translateY = -t * 12;
        } else if (progress <= 0.50) {
          const t = (progress - 0.25) / 0.25;
          scale = 0.92 - t * (0.92 - 0.80);
          opacity = 0.95 - t * (0.95 - 0.82);
          blur = 0.5 + t * (2.0 - 0.5);
          translateY = -12 - t * 16;
        } else if (progress <= 0.75) {
          const t = (progress - 0.50) / 0.25;
          scale = 0.80 - t * (0.80 - 0.68);
          opacity = 0.82 - t * (0.82 - 0.60);
          blur = 2.0 + t * (4.0 - 2.0);
          translateY = -28 - t * 16;
        } else {
          const t = (progress - 0.75) / 0.25;
          scale = 0.68 - t * (0.68 - 0.55);
          opacity = 0.60 - t * (0.60 - 0.30);
          blur = 4.0 + t * (7.0 - 4.0);
          translateY = -44 - t * 16;
        }

        setScrollState({ scale, opacity, blur, translateY });
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  return (
    <section className="hero-editorial-container" aria-label="Hero Section">
      {/* LAYER 1 — Background Stadium Atmosphere */}
      <div className="hero-background-layer">
        <img
          src="/hero-player.png"
          onError={(e) => { e.target.src = '/assets/hero-player.png'; }}
          alt="FootballIQ Stadium Background"
          className="hero-background-img"
        />
        <div className="hero-bg-top-fade" />
        <div className="hero-bg-bottom-fade" />
      </div>

      {/* LAYER 2 — Soft Atmospheric Fog / Halo Layer */}
      <div className="hero-halo-layer" />

      {/* LAYER 3 — Typography Layer (Headline & Label) */}
      <div className="hero-typography-layer">
        <div className="hero-eyebrow-label animate-hero-eyebrow">
          <span>AI-POWERED PLAYER VALUATION</span>
          <span className="hero-ember-dot" aria-hidden="true" />
        </div>

        <h1 className="hero-headline-h1 animate-hero-headline">
          Know what a player is worth.
        </h1>

        {/* LAYER 5 — Search UI Component */}
        <div className="hero-ui-layer animate-hero-search">
          <PlayerSearch />
        </div>
      </div>

      {/* LAYER 4 — Isolated Player Cutout Layer (Emerges over headline & recedes into background on scroll) */}
      <div
        className="hero-player-layer"
        style={{
          transform: `translate3d(0, ${scrollState.translateY.toFixed(1)}px, 0) scale(${scrollState.scale.toFixed(3)})`,
          opacity: scrollState.opacity.toFixed(3),
          filter: `grayscale(100%) contrast(106%) blur(${scrollState.blur.toFixed(1)}px)`,
          WebkitFilter: `grayscale(100%) contrast(106%) blur(${scrollState.blur.toFixed(1)}px)`,
        }}
      >
        <img
          src="/assets/hero-player-cutout.png"
          onError={(e) => { e.target.src = '/hero-player.png'; }}
          alt="Jude Bellingham FootballIQ Cutout"
          className="hero-player-cutout-img"
        />
      </div>
    </section>
  );
}

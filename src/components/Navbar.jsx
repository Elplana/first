import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'How it works', path: '#how-it-works', isAnchor: true },
    { label: 'Player Database', path: '/players' },
    { label: 'Methodology', path: '/methodology' },
    { label: 'Valuation Engine', path: '/predict' },
  ];

  const handleNavClick = (e, item) => {
    if (item.isAnchor && location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById('how-it-works');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full h-[72px] bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E8E8E8] transition-all">
      <div className="max-w-[1290px] mx-auto px-6 h-full flex items-center justify-between">
        
        {/* Left: SVG Logo Mark "FootballIQ" */}
        <Link
          to="/"
          className="flex items-center text-decoration-none focus-visible:outline-none"
          aria-label="FootballIQ Home Page"
        >
          <img
            src="/assets/footballiq-logo.svg"
            onError={(e) => { e.target.src = '/footballiq-logo.svg'; }}
            alt="FootballIQ Logo"
            className="h-[26px] w-auto"
          />
        </Link>

        {/* Center: Desktop Nav Links (Hidden on ≤1024px) */}
        <nav
          className="hidden lg:flex items-center gap-[36px]"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => {
            const isActive =
              !item.isAnchor &&
              (location.pathname === item.path ||
                (item.path === '/' && location.pathname === '/'));

            if (item.isAnchor) {
              return (
                <a
                  key={item.label}
                  href={item.path}
                  onClick={(e) => handleNavClick(e, item)}
                  className="text-[14px] font-normal text-[#828282] hover:text-[#202020] transition-colors duration-150 text-decoration-none"
                >
                  {item.label}
                </a>
              );
            }

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`text-[14px] transition-colors duration-150 text-decoration-none relative py-1 ${
                  isActive
                    ? 'text-[#202020] font-medium'
                    : 'text-[#828282] hover:text-[#202020] font-normal'
                }`}
              >
                {item.label}
                {/* Active Link Ember Orange Underline */}
                {isActive && (
                  <span
                    className="absolute left-0 bottom-[-24px] w-full h-[2px] bg-[#FF682C]"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Get Started Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <Link
            to="/predict"
            className="h-[46px] px-5 bg-[#202020] hover:bg-[#333333] text-white text-[14px] font-medium rounded-none inline-flex items-center justify-center gap-2 group transition-colors duration-200 text-decoration-none border-none"
          >
            <span>Get started</span>
            <ArrowUpRight className="w-[15px] h-[15px] text-white transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          {/* Hamburger Drawer Toggle (Only ≤1024px) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#202020] hover:bg-[#F5F5F5] transition-colors"
            aria-label="Toggle navigation drawer"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer (≤1024px) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFFFF] border-b border-[#E8E8E8] px-6 py-6 shadow-lg transition-all">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => {
              const isActive = !item.isAnchor && location.pathname === item.path;
              if (item.isAnchor) {
                return (
                  <a
                    key={item.label}
                    href={item.path}
                    onClick={(e) => handleNavClick(e, item)}
                    className="text-[15px] text-[#828282] hover:text-[#202020] py-2 border-b border-[#F5F5F5]"
                  >
                    {item.label}
                  </a>
                );
              }
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-[15px] py-2 border-b border-[#F5F5F5] flex items-center justify-between ${
                    isActive ? 'text-[#202020] font-semibold' : 'text-[#828282]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#FF682C]" />}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}

import React from 'react'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer-section" id="footer">
      <div id="experience" className="contact-anchor" />

      {/* Background Image with White Saturation Atmosphere */}
      <div className="footer-bg" role="img" aria-label="Mount Bromo Landscape" />
      <div className="footer-white-overlay" />
      <div className="footer-top-fade" />

      {/* Minimal Footer Content */}
      <div className="footer-content">
        <div className="footer-top-brand">
          <a href="#hero" className="footer-logo">
            Bromo
          </a>
          <span className="footer-tagline">East Java &middot; 2,329 M</span>
        </div>

        {/* Centerpiece Hero Title */}
        <div className="footer-center">
          <h2 className="footer-title">BROMO</h2>
          <p className="footer-subtitle">Tengger Semeru National Park</p>

          {/* Simple Navigation Bar matching Navbar */}
          <div className="footer-nav">
            <div className="nav-items">
              <a href="#hikes">Expedition</a>
              <a href="#about">About</a>
              <a href="#experience">Contact</a>
            </div>
          </div>
        </div>

        {/* Bottom Minimal Row */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Bromo Tengger Semeru. All rights reserved.</p>
          <a href="#hero" className="back-to-top">
            Back to top &uarr;
          </a>
        </div>
      </div>
    </footer>
  )
}

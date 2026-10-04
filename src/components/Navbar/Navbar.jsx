import React from 'react'
import './Navbar.css'

export default function Navbar() {
  return (
    <nav id="navbar">
      <div className="nav-logo">
        <a href="#hero">
         Bromo
        </a>
      </div>

      <div className="nav-items">
        <a href="#hikes">Expedition</a>
        <a href="#about">About</a>
        <a href="#experience">Contact</a>
      </div>
    </nav>
  )
}

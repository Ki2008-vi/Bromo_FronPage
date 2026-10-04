import React from 'react'
import './Testimonial.css'

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sarah Lindqvist',
    location: 'Stockholm, Sweden',
    trip: 'Mount Rinjani Summit Expedition',
    rating: 5,
    quote: 'Summiting Rinjani at dawn was the most profound outdoor experience of my life. The Travelung crew treated us like family, the meals were astonishingly tasty at 2,600m, and the safety measures were flawless.',
    avatar: '/img-1.jpg'
  },
  {
    id: 2,
    name: 'Marcus Holloway',
    location: 'Melbourne, Australia',
    trip: 'Patagonia W-Trek Explorer',
    rating: 5,
    quote: 'As a solo traveler, I was hesitant about booking an alpine trek alone. The small group dynamic was unbelievable—we bonded instantly, and our guide Alex knew every granite ridge and weather shift by heart.',
    avatar: '/img-2.jpg'
  },
  {
    id: 3,
    name: 'Devin Kowalski',
    location: 'Toronto, Canada',
    trip: 'Mount Semeru Mahameru Climb',
    rating: 5,
    quote: 'Top-tier equipment, genuinely warm porters who were respected and well-compensated, and an unforgettable sunrise above the clouds. Travelung is in a class of its own for high-altitude trekking.',
    avatar: '/img-5.jpg'
  }
]

export default function Testimonial() {
  return (
    <section className="section-wrapper" id="testimonials">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">HIKER VOICES</div>
          <h2 className="section-title">Tested On The Peaks, Loved By Adventurers</h2>
          <p className="section-subtitle">
            Read authentic reviews from hikers who ventured into the wilderness with us and returned transformed.
          </p>
        </div>

        <div className="testimonials-grid">
          {TESTIMONIALS.map(t => (
            <article className="testimonial-card" key={t.id}>
              <div className="stars-row" aria-label={`${t.rating} out of 5 stars`}>
                {'★'.repeat(t.rating)}
              </div>
              <blockquote className="testimonial-quote">
                "{t.quote}"
              </blockquote>
              <div className="testimonial-author-row">
                <img src={t.avatar} alt={t.name} className="author-avatar" loading="lazy" />
                <div className="author-info">
                  <h5>{t.name}</h5>
                  <span>{t.location} • <strong style={{ color: 'var(--emerald-400)' }}>{t.trip}</strong></span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

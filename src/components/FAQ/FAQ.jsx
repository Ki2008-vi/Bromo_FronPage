import React, { useState } from 'react'
import './FAQ.css'

const FAQ_ITEMS = [
  {
    question: 'What level of physical fitness is required to join an expedition?',
    answer: 'Our treks range from beginner-friendly (moderate walking on established paths like Mount Bromo) to challenging technical ascents (Mount Semeru or Dolomites High Route). Each hike listing clearly indicates the required stamina, elevation gain, and daily walking duration. For intermediate treks, being able to jog 5km or hike with a light daypack for 4–5 hours is recommended.'
  },
  {
    question: 'What happens if bad weather hits while on the mountain?',
    answer: 'Safety is our absolute highest priority. Our guides continuously monitor satellite barometric trends and regional forecasts via Garmin inReach. In the event of high winds, lightning, or severe storms, our leaders make conservative turnaround decisions. If a summit push is postponed, alternative scenic routes or safe shelter protocols are implemented immediately.'
  },
  {
    question: 'Can dietary requirements and food allergies be accommodated?',
    answer: 'Absolutely. We regularly cater to vegetarian, vegan, halal, gluten-free, and nut-allergy requirements. During the booking confirmation, you will submit a dietary preference form so our trail chef can prepare dedicated menus and sanitize cooking gear accordingly.'
  },
  {
    question: 'What gear do I need to bring vs. what is provided?',
    answer: 'We provide heavy camping equipment: 4-season geodesic tents, thermal ground mats, sub-zero sleeping bags, cooking equipment, dining shelters, and first-aid kits. You will need personal trekking attire: broken-in hiking boots, moisture-wicking base layers, an insulated down jacket, waterproof shell, headlamp, and personal toiletries.'
  },
  {
    question: 'How do mountain porters assist, and is there a luggage weight limit?',
    answer: 'Our professional porters carry all communal basecamp gear, tents, food, and water. In addition, every hiker is allocated up to 10kg of personal gear carried by our porter squad. You only carry a light daypack (3–5kg) with your water, rain jacket, camera, and trail snacks.'
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }

  return (
    <section className="section-wrapper" id="faq" style={{ background: 'rgba(255, 255, 255, 0.015)' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-badge">FREQUENTLY ASKED QUESTIONS</div>
          <h2 className="section-title">Everything You Need To Know</h2>
          <p className="section-subtitle">
            Have questions about preparation, mountain gear, or trail safety? Here are answers to our most common inquiries.
          </p>
        </div>

        <div className="faq-container">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <div 
                className={`faq-item ${isOpen ? 'active' : ''}`} 
                key={index}
              >
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => toggleItem(index)}
                  aria-expanded={isOpen}
                  id={`faq-btn-${index}`}
                >
                  <span>{item.question}</span>
                  <span className="faq-toggle-icon">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="faq-answer" id={`faq-answer-${index}`}>
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

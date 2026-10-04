import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './FAQNEW.css'

gsap.registerPlugin(ScrollTrigger)

const DEFAULT_FAQ_DATA = [
  {
    id: 1,
    question: 'When is the best time to see the Bromo sunrise?',
    answers: [
      'Between April and October during the dry season.',
      'Skies are crisp and clear, creating that famous ethereal sea of clouds drifting across the caldera.',
      'Morning temperatures can drop down to 5°C, so bring warm layers and a windbreaker.',
    ],
  },
  {
    id: 2,
    question: 'How physically demanding is the hike to the crater rim?',
    answers: [
      'It is very beginner-friendly and accessible for all ages.',
      'You cross the flat Sea of Sand on foot or horseback, followed by 253 concrete steps with sturdy railings to the top.',
      'The walk takes around 20 to 30 minutes at a relaxed, comfortable pace.',
    ],
  },
  {
    id: 3,
    question: 'Do I need a 4x4 Jeep to navigate the caldera?',
    answers: [
      'Yes, ordinary vehicles cannot cross the vast shifting sand dunes.',
      'Our classic Land Cruisers handle the rugged terrain from your lodge up to Penanjakan and King Kong Hill.',
      'Every transfer, driver, and national park permit is fully arranged in advance.',
    ],
  },
  {
    id: 4,
    question: 'What is the cultural significance of Mount Bromo?',
    answers: [
      'Bromo is deeply sacred to the indigenous Hindu Tengger community.',
      'During the annual Yadnya Kasada ceremony, villagers hike the crater at midnight to cast rice, fruit, and livestock into the volcano.',
      'Our local Tengger guides introduce you to ancient highland traditions and heritage throughout the trek.',
    ],
  },
  {
    id: 5,
    question: 'What essential gear should I pack for the expedition?',
    answers: [
      'Warm layered clothing, a windproof jacket, sturdy shoes, and gloves.',
      'A headlamp is useful for early dawn walks, plus a neck gaiter or mask to filter airborne volcanic ash.',
      'We supply thermal blankets, trekking poles, hot mountain tea, and certified emergency kits.',
    ],
  },
]

export default function FAQNEW({ items = DEFAULT_FAQ_DATA }) {
  const faqRef = useRef(null)

  useEffect(() => {
    const faqElement = faqRef.current
    if (!faqElement) return

    let triggers = []
    let timelines = []

    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve()

    fontsReady.then(() => {
      if (!faqElement) return

      const messages = faqElement.querySelectorAll('.faq-message')
      const isMobile = window.innerWidth <= 768
      const padX = isMobile ? '1.5rem' : '2rem'
      const padY = isMobile ? '1.25rem' : '1.5rem'

      // Pass 1: Reset styles to read natural dimensions without layout thrashing
      messages.forEach((message) => {
        const faqRow = message.parentElement
        message.style.width = 'auto'
        message.style.height = 'auto'
        message.style.padding = ''
        message.style.borderRadius = ''
        gsap.set(message, { clearProps: 'transform,scale' })
        if (faqRow) faqRow.style.minHeight = ''
      })

      // Pass 2: Batch all layout reads
      const measurements = []
      messages.forEach((message) => {
        measurements.push({
          width: message.offsetWidth,
          height: message.offsetHeight,
        })
      })

      // Pass 3: Apply initial GSAP state and build timelines
      messages.forEach((message, idx) => {
        const faqRow = message.parentElement
        const typingIndicator = message.querySelector('.typing-indicator')
        const messageCopy = message.querySelectorAll('.faq-content p')
        const { width: expandedWidth, height: expandedHeight } = measurements[idx]

        message.style.width = `${expandedWidth}px`
        if (faqRow) faqRow.style.minHeight = `${expandedHeight}px`

        gsap.set(message, {
          width: 64,
          height: 64,
          borderRadius: '50%',
          padding: 0,
          scale: 0,
        })

        let collapseWhenDone = false

        const enterTimeline = gsap.timeline({ paused: true })
        enterTimeline.to(message, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        })
        timelines.push(enterTimeline)

        const expandTimeline = gsap.timeline({
          paused: true,
          onReverseComplete: () => {
            if (collapseWhenDone) {
              collapseWhenDone = false
              enterTimeline.reverse()
            }
          },
        })
        timelines.push(expandTimeline)

        expandTimeline
          .to(typingIndicator, {
            autoAlpha: 0,
            duration: 0.2,
          })
          .to(message, {
            width: expandedWidth,
            borderRadius: '2rem',
            paddingLeft: padX,
            paddingRight: padX,
            duration: 0.4,
            ease: 'power3.inOut',
          })
          .to(
            message,
            {
              height: expandedHeight,
              paddingTop: padY,
              paddingBottom: padY,
              duration: 0.4,
              ease: 'power3.inOut',
            },
            '-=0.2'
          )
          .to(
            messageCopy,
            {
              opacity: 1,
              duration: 0.3,
              stagger: 0.05,
            },
            '-=0.25'
          )

        const stEnter = ScrollTrigger.create({
          trigger: message,
          start: 'top 85%',
          onEnter: () => {
            collapseWhenDone = false
            enterTimeline.play()
          },
          onLeaveBack: () => {
            if (expandTimeline.progress() > 0) {
              collapseWhenDone = true
            } else {
              enterTimeline.reverse()
            }
          },
        })
        triggers.push(stEnter)

        const stExpand = ScrollTrigger.create({
          trigger: message,
          start: 'top 75%',
          onEnter: () => expandTimeline.play(),
          onLeaveBack: () => expandTimeline.reverse(),
        })
        triggers.push(stExpand)
      })

      ScrollTrigger.refresh()
    })

    return () => {
      triggers.forEach((trigger) => trigger.kill())
      timelines.forEach((tl) => tl.kill())
    }
  }, [items])

  return (
    <section className="faq" id="faq" ref={faqRef}>
      <h1>QUESTION ABOUT BROMO</h1>

      <div className="faq-container">
        {items.map((item) => (
          <div className="faq-item" key={item.id}>
            {/* Question bubble */}
            <div className="faq-row faq-question-slot">
              <div className="faq-question faq-message">
                <div className="typing-indicator" aria-hidden="true">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="faq-content">
                  <p>{item.question}</p>
                </div>
              </div>
            </div>

            {/* Answer bubble */}
            <div className="faq-row faq-answer-slot">
              <div className="faq-answer faq-message">
                <div className="typing-indicator" aria-hidden="true">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="faq-content">
                  {item.answers.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

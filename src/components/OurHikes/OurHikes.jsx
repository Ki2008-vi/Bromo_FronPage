import React, { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './OurHikes.css'

gsap.registerPlugin(ScrollTrigger)

const BROMO_IMAGES = [
  '/bromo1.jpg',
  '/bromo2.jpg',
  '/bromo3.jpg',
  '/bromo4.jpg',
  '/bromo5.jpg',
  '/bromopeople.jpg',
  '/bromo7.jpg',
  '/bromo8.jpg',
  '/bromo9.jpg',
  '/bromo10.jpg',
]

export default function OurHikes() {
  const showreelSecRef = useRef(null)
  const containerRef = useRef(null)
  const [currentFrame, setCurrentFrame] = useState(0)
  const frameInterval = 800 // ms per frame

  // Preload images for buttery smooth cycling
  useEffect(() => {
    BROMO_IMAGES.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [])

  useEffect(() => {
    const section = showreelSecRef.current
    const container = containerRef.current
    if (!section || !container) return

    // Frame cycling timeline looping continuously - paused until in view
    const frameTimeline = gsap.timeline({ repeat: -1, paused: true })
    for (let i = 0; i < BROMO_IMAGES.length; i++) {
      frameTimeline.add(() => {
        setCurrentFrame(i)
      }, i * (frameInterval / 1000))
    }

    // Only run frame cycling when section is visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            frameTimeline.play()
          } else {
            frameTimeline.pause()
          }
        })
      },
      { threshold: 0.1 }
    )
    observer.observe(section)

    const mm = gsap.matchMedia()

    mm.add('(min-width: 1000px)', () => {
      const scrollTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${window.innerHeight * 2}px`,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          const progress = self.progress

          const scaleValue = gsap.utils.mapRange(0, 1, 0.75, 1, progress)
          const borderRadiusValue =
            progress <= 0.5 ? gsap.utils.mapRange(0, 0.5, 2, 0, progress) : 0

          gsap.set(container, {
            scale: scaleValue,
            borderRadius: `${borderRadiusValue}rem`,
          })
        },
      })

      return () => {
        scrollTrigger.kill()
      }
    })

    mm.add('(max-width: 999px)', () => {
      gsap.set(section, { clearProps: 'all' })
      gsap.set(container, { clearProps: 'all' })
    })

    return () => {
      observer.disconnect()
      frameTimeline.kill()
      mm.revert()
    }
  }, [])

  return (
    <section className="showreel" id="hikes" ref={showreelSecRef}>
      <div className="showreel-container" ref={containerRef}>
        <img
          src={BROMO_IMAGES[currentFrame]}
          alt={`Mount Bromo Showreel frame ${currentFrame + 1}`}
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>
  )
}

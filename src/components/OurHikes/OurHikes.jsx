import React, { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './OurHikes.css'

gsap.registerPlugin(ScrollTrigger)

const BROMO_IMAGES = [
  '/optimized/bromo1.jpg',
  '/optimized/bromo2.jpg',
  '/optimized/bromo3.jpg',
  '/optimized/bromo4.jpg',
  '/optimized/bromo5.jpg',
  '/optimized/bromopeople.jpg',
  '/optimized/bromo7.jpg',
  '/optimized/bromo8.jpg',
  '/optimized/bromo9.jpg',
  '/optimized/bromo10.jpg',
  '/optimized/bromo6.jpg',
]

export default function OurHikes() {
  const showreelSecRef = useRef(null)
  const containerRef = useRef(null)
  const [currentFrame, setCurrentFrame] = useState(0)
  const frameInterval = 1000 // ms per frame

  // Preload and decode images for buttery smooth cycling
  useEffect(() => {
    BROMO_IMAGES.forEach((src) => {
      const img = new Image()
      img.src = src
      if (img.decode) {
        img.decode().catch(() => {})
      }
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
    // Ensure the last frame stays visible for the full frameInterval before looping
    frameTimeline.set({}, {}, BROMO_IMAGES.length * (frameInterval / 1000))

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
        {BROMO_IMAGES.map((src, index) => (
          <img
            key={src}
            src={src}
            alt={`Mount Bromo Showreel frame ${index + 1}`}
            className={`showreel-frame ${index === currentFrame ? 'active' : ''}`}
            decoding="async"
          />
        ))}
      </div>
    </section>
  )
}

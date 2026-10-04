import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import SplitText from 'gsap/SplitText'
import CustomEase from 'gsap/CustomEase'
import './Hero.css'

gsap.registerPlugin(CustomEase, SplitText)

CustomEase.create('hop', '0.9, 0, 0.1, 1')
CustomEase.create('glide', '0.8, 0, 0.2, 1')

export default function Hero() {
  const containerRef = useRef(null)

  useEffect(() => {
    let isMounted = true
    let ctx

    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve()

    fontsReady.then(() => {
      if (!isMounted) return

      ctx = gsap.context(() => {
        const introImages = document.querySelectorAll('.intro-img')
        if (!introImages.length) return

        const introImgScale = 0.2
        const introImgGap = 40
        const introImgRotations = [-15, 5, -7.5, 10, -2.5]

        const introImgScaledWidth = window.innerWidth * introImgScale
        const introImgRowWidth = introImgScaledWidth * 5 + introImgGap * 4
        const introImgCenteredX = (window.innerWidth - introImgRowWidth) / 2
        const introImgOffScreenX = introImgCenteredX - window.innerWidth * 1.3

        introImages.forEach((img, i) => {
          const centeredX =
            introImgCenteredX +
            i * (introImgScaledWidth + introImgGap) +
            introImgScaledWidth / 2 -
            window.innerWidth / 2

          const offScreenX =
            introImgOffScreenX +
            i * (introImgScaledWidth + introImgGap) +
            introImgScaledWidth / 2 -
            window.innerWidth / 2

          gsap.set(img, {
            scale: introImgScale,
            x: offScreenX,
            rotation: introImgRotations[i],
            borderRadius: '2.5rem',
          })

          img.dataset.centeredX = centeredX
        })

        SplitText.create('nav a, .hero-header h1, .hero-social p, .hero-social a', {
          type: 'lines',
          linesClass: 'line',
          mask: 'lines',
          autoSplit: true,
        })

        gsap.set('.line', { y: '125%' })

        const tl = gsap.timeline({ delay: 1 })

        tl.to('.preloader', {
          scaleX: 1,
          duration: 1.5,
          ease: 'glide',
          onComplete: () => {
            gsap.set('.preloader', { transformOrigin: 'right' })
          },
        })

        tl.to('.preloader', {
          scaleX: 0,
          duration: 1.25,
          ease: 'hop',
        })

        tl.to(
          '.preloader-overlay',
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
            duration: 1,
            ease: 'hop',
            onComplete: () => {
              const overlay = containerRef.current?.querySelector('.preloader-overlay')
              if (overlay) {
                overlay.style.pointerEvents = 'none'
                overlay.style.display = 'none'
              }
            },
          },
          '<0.75',
        )

        introImages.forEach((img) => {
          tl.to(
            img,
            {
              x: parseFloat(img.dataset.centeredX),
              duration: 1.5,
              ease: 'glide',
            },
            '<0.025',
          )
        })

        tl.to(
          '.intro-img:nth-child(1), .intro-img:nth-child(2)',
          { x: '-100vw', duration: 1.5, ease: 'glide' },
          'spread',
        )
        tl.to(
          '.intro-img:nth-child(4), .intro-img:nth-child(5)',
          { x: '100vw', duration: 1.5, ease: 'glide' },
          'spread',
        )

        tl.to(
          '.hero-img',
          {
            scale: 1,
            x: 0,
            rotation: 0,
            borderRadius: 0,
            duration: 1.5,
            ease: 'glide',
          },
          '<',
        )

        // Free up GPU compositing memory for offscreen intro images
        tl.set('.intro-img:not(.hero-img)', { display: 'none' })

        tl.to(
          'nav .line',
          {
            y: '0%',
            duration: 1,
            stagger: 0.1,
            ease: 'power3.out',
          },
          '<1',
        )

        tl.to(
          '.hero-header .line',
          {
            y: '0%',
            duration: 1,
            stagger: 0.1,
            ease: 'power3.out',
          },
          '<',
        )

        tl.to(
          '.hero-social .line',
          {
            y: '0%',
            duration: 1,
            stagger: 0.1,
            ease: 'power3.out',
          },
          '<0.25',
        )
      })
    })

    return () => {
      isMounted = false
      if (ctx) ctx.revert()
    }
  }, [])

  return (
    <div ref={containerRef}>
      <div className="preloader-overlay">
        <div className="preloader"></div>
      </div>

      <section className="hero">
        <div className="intro-img"><img src="/bromo5.jpg" alt="Mount Bromo Caldera" /></div>
        <div className="intro-img"><img src="/bromo2.jpg" alt="Mount Bromo Panoramic View" /></div>
        <div className="intro-img hero-img"><img src="/bromo1.jpg" alt="Mount Bromo Sunrise" fetchPriority="high" /></div>
        <div className="intro-img"><img src="/bromo3.jpg" alt="Mount Bromo Peak" /></div>
        <div className="intro-img"><img src="/bromo4.jpg" alt="Mount Bromo Mist" /></div>

        <div className="hero-content">
          <div className="hero-header">
            <h1>
             Bromo <br />
             Tengger Semeru
            </h1>
          </div>

          <div className="hero-social">
            <p>Explore the Beauty, Conquer the Peak <br /> Experience the Harmony of Nature in <br></br> The Mountain Climbing Area</p>
            <a href="mailto:info@foundryandform.com">infobromo.com</a>
            <a href="#hikes">View Enquiries</a>
          </div>
        </div>
      </section>
    </div>
  )
}

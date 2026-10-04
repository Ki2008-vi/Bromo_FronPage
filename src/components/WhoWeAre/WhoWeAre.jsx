import React, { useEffect, useRef, useState } from 'react'
import {
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  Vector2,
  ShaderMaterial,
  Mesh,
  PlaneGeometry,
  Texture,
  LinearFilter,
  ClampToEdgeWrapping,
} from 'three'
import gsap from 'gsap'
import SplitText from 'gsap/SplitText'
import { vertexShader, fragmentShader } from './shaders.js'
import { slides } from './slides.js'
import './WhoWeAre.css'

gsap.registerPlugin(SplitText)

export default function WhoWeAre() {
  const sliderRef = useRef(null)
  const slidesHostRef = useRef(null)
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  // Use a ref to store mutable transition function so clicks and controls can invoke it
  const transitionRef = useRef(null)

  useEffect(() => {
    let isDisposed = false
    let rippleTween = null
    let isTransitioning = false
    let currentIndex = 0
    let currentSplits = []
    let isVisible = false

    const slider = sliderRef.current
    const slidesHost = slidesHostRef.current
    if (!slider || !slidesHost) return

    // Setup Three.js scene, camera, renderer
    const scene = new Scene()
    const camera = new OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.01, 10)
    camera.position.z = 1

    const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)

    const canvasElement = renderer.domElement
    canvasElement.className = 'slider-canvas'
    slider.prepend(canvasElement)

    const rippleConfig = {
      waveFreq: 25.0,
      wavePow: 0.035,
      waveWidth: 0.5,
      falloff: 10.0,
      boostStrength: 0.5,
      crossfadeWidth: 0.05,
      duration: 3.0,
      endValue: 1.0,
      ease: 'power2.out',
    }

    const uniforms = {
      uTexCurrent: { value: null },
      uTexNext: { value: null },
      uProgress: { value: 0.0 },
      uResolution: { value: new Vector2() },
      uImageRes: { value: new Vector2(1500, 964) },
      uWaveFreq: { value: rippleConfig.waveFreq },
      uWavePow: { value: rippleConfig.wavePow },
      uWaveWidth: { value: rippleConfig.waveWidth },
      uFalloff: { value: rippleConfig.falloff },
      uBoostStrength: { value: rippleConfig.boostStrength },
      uCrossfadeWidth: { value: rippleConfig.crossfadeWidth },
      uMobile: { value: window.innerWidth <= 1000 ? 1.0 : 0.0 },
    }

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
    })

    const plane = new Mesh(new PlaneGeometry(1, 1), material)
    scene.add(plane)

    function render() {
      if (isDisposed || !isVisible) return
      renderer.render(scene, camera)
    }

    // Observer to only perform rendering when the section is in view
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const wasVisible = isVisible
          isVisible = entry.isIntersecting
          if (!wasVisible && isVisible) {
            render()
          }
        })
      },
      { threshold: 0.05 }
    )
    visibilityObserver.observe(slider)

    function getMaxCornerDist(width, height) {
      const ratio = height / (width || 1)
      const cx = 0.5
      const cy = 0.5 * ratio
      return Math.sqrt(cx * cx + cy * cy)
    }

    function handleResize() {
      if (!slider || isDisposed) return
      const width = slider.clientWidth || window.innerWidth
      const height = slider.clientHeight || window.innerHeight
      if (width === 0 || height === 0) return

      renderer.setSize(width, height)
      uniforms.uResolution.value.set(width, height)
      uniforms.uMobile.value = window.innerWidth <= 1000 ? 1.0 : 0.0
      rippleConfig.endValue = getMaxCornerDist(width, height) + rippleConfig.waveWidth
      rippleConfig.duration = window.innerWidth <= 1000 ? 1.5 : 3.0
      render()
    }

    window.addEventListener('resize', handleResize)
    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(slider)
    handleResize()

    function splitTitle(container) {
      if (!container) return null
      const heading = container.querySelector('.slide-title h1')
      if (!heading) return null

      return SplitText.create(heading, {
        type: 'words, chars',
        mask: 'chars',
        wordsClass: 'word',
        charsClass: 'char',
      })
    }

    function splitDescription(container) {
      if (!container) return []
      const paragraphs = container.querySelectorAll('.slide-description p')
      const allLines = []
      const splits = []

      paragraphs.forEach((p) => {
        const split = SplitText.create(p, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'line',
        })
        splits.push(split)
        if (split && split.lines) {
          allLines.push(...split.lines)
        }
      })

      return { allLines, splits }
    }

    function buildSlideContent(slide) {
      const el = document.createElement('div')
      el.className = 'slide-content'
      el.style.opacity = '0'

      el.innerHTML = `
        <div class="slide-title">
          <h1>${slide.title}</h1>
        </div>
        <div class="slide-description">
          <p>${slide.description}</p>
        </div>
      `

      return el
    }

    function animateTextOut(container) {
      const titleSplit = splitTitle(container)
      const { allLines, splits } = splitDescription(container)

      const tl = gsap.timeline()

      if (titleSplit && titleSplit.chars) {
        tl.to(titleSplit.chars, {
          y: '-100%',
          duration: 0.6,
          stagger: 0.02,
          ease: 'power2.inOut',
        })
      }

      if (allLines.length > 0) {
        tl.to(
          allLines,
          { y: '-100%', duration: 0.6, stagger: 0.02, ease: 'power2.inOut' },
          0.1
        )
      }

      return { tl, splits: [titleSplit, ...splits].filter(Boolean) }
    }

    function animateTextIn(container) {
      const titleSplit = splitTitle(container)
      const { allLines, splits } = splitDescription(container)
      currentSplits = [titleSplit, ...splits].filter(Boolean)

      const chars = titleSplit ? titleSplit.chars : []

      if (chars.length) gsap.set(chars, { y: '100%' })
      if (allLines.length) gsap.set(allLines, { y: '100%' })
      gsap.set(container, { opacity: 1 })

      const tl = gsap.timeline()

      if (chars.length) {
        tl.to(chars, {
          y: '0%',
          duration: 0.5,
          stagger: 0.02,
          ease: 'power2.inOut',
        })
      }

      if (allLines.length) {
        tl.to(
          allLines,
          { y: '0%', duration: 0.5, stagger: 0.05, ease: 'power2.out' },
          0.1
        )
      }

      return tl
    }

    // Load textures
    const textures = []

    function createSafeTexture(image, maxSize) {
      let source = image
      if (image && (image.naturalWidth > maxSize || image.naturalHeight > maxSize)) {
        const canvas = document.createElement('canvas')
        const scale = Math.min(
          maxSize / image.naturalWidth,
          maxSize / image.naturalHeight
        )
        canvas.width = Math.round(image.naturalWidth * scale)
        canvas.height = Math.round(image.naturalHeight * scale)
        const ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
        source = canvas
      }

      const texture = new Texture(source)
      texture.image = source
      texture.minFilter = LinearFilter
      texture.magFilter = LinearFilter
      texture.wrapS = ClampToEdgeWrapping
      texture.wrapT = ClampToEdgeWrapping
      texture.needsUpdate = true
      return texture
    }

    async function initSlider() {
      const maxTexSize = renderer.capabilities?.maxTextureSize || 4096

      for (const slide of slides) {
        try {
          const img = await new Promise((resolve, reject) => {
            const image = new Image()
            image.crossOrigin = 'anonymous'
            image.onload = () => resolve(image)
            image.onerror = (err) => reject(err)
            image.src = slide.image
          })
          if (isDisposed) return
          const texture = createSafeTexture(img, Math.min(maxTexSize, 4096))
          textures.push(texture)
        } catch (err) {
          console.error('Failed loading slide image', slide.image, err)
        }
      }

      if (isDisposed || textures.length === 0) return

      if (textures[0]?.image) {
        const firstImg = textures[0].image
        uniforms.uImageRes.value.set(
          firstImg.naturalWidth || firstImg.width || 1500,
          firstImg.naturalHeight || firstImg.height || 964
        )
      }

      uniforms.uTexCurrent.value = textures[0]
      uniforms.uTexNext.value = textures[1] || textures[0]

      handleResize()

      // Build and mount initial slide
      slidesHost.innerHTML = ''
      const initialSlide = buildSlideContent(slides[0])
      slidesHost.appendChild(initialSlide)

      // Wait for fonts if available before splitting
      const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve()
      fontsReady.then(() => {
        if (isDisposed) return
        const initialTitle = splitTitle(initialSlide)
        const { allLines, splits } = splitDescription(initialSlide)
        currentSplits = [initialTitle, ...splits].filter(Boolean)

        gsap.set(initialSlide, { opacity: 1 })

        if (initialTitle && initialTitle.chars) {
          gsap.fromTo(
            initialTitle.chars,
            { y: '100%' },
            { y: '0%', duration: 0.8, stagger: 0.025, ease: 'power2.out' }
          )
        }

        if (allLines.length) {
          gsap.fromTo(
            allLines,
            { y: '100%' },
            { y: '0%', duration: 0.8, stagger: 0.025, ease: 'power2.out', delay: 0.2 }
          )
        }

        setIsLoaded(true)
        render()
      })

      render()
    }

    initSlider()

    function transition(targetIndex = null) {
      if (isTransitioning || textures.length < 2 || isDisposed) return
      isTransitioning = true

      if (rippleTween) {
        rippleTween.kill()
        uniforms.uProgress.value = 0.0
        rippleTween = null
      }

      const nextIndex =
        targetIndex !== null
          ? targetIndex % slides.length
          : (currentIndex + 1) % slides.length

      const currentSlide = slidesHost.querySelector('.slide-content')
      const { tl: exitTimeline, splits: exitingSplits } = currentSlide
        ? animateTextOut(currentSlide)
        : { tl: gsap.timeline(), splits: [] }

      uniforms.uTexCurrent.value = textures[currentIndex]
      uniforms.uTexNext.value = textures[nextIndex]
      uniforms.uProgress.value = 0.0

      if (textures[nextIndex]?.image) {
        const nextImg = textures[nextIndex].image
        uniforms.uImageRes.value.set(
          nextImg.naturalWidth || nextImg.width || 1500,
          nextImg.naturalHeight || nextImg.height || 964
        )
      }

      let clickUnlocked = false

      rippleTween = gsap.to(uniforms.uProgress, {
        value: rippleConfig.endValue,
        duration: rippleConfig.duration,
        ease: rippleConfig.ease,
        delay: 0.3,
        onUpdate() {
          render()
          if (!clickUnlocked && uniforms.uProgress.value > 0.7) {
            clickUnlocked = true
            currentIndex = nextIndex
            setActiveSlideIndex(nextIndex)
            isTransitioning = false
          }
        },
        onComplete() {
          uniforms.uTexCurrent.value = textures[currentIndex]
          uniforms.uProgress.value = 0.0
          render()
          rippleTween = null

          if (!clickUnlocked) {
            currentIndex = nextIndex
            setActiveSlideIndex(nextIndex)
            isTransitioning = false
          }
        },
      })

      exitTimeline.then(() => {
        if (isDisposed) return
        exitingSplits.forEach((s) => s?.revert && s.revert())
        if (currentSlide && currentSlide.parentNode) {
          currentSlide.remove()
        }

        const nextSlide = buildSlideContent(slides[nextIndex])
        slidesHost.appendChild(nextSlide)

        requestAnimationFrame(() => {
          if (isDisposed) return
          animateTextIn(nextSlide)
        })
      })
    }

    transitionRef.current = transition

    const handleSliderClick = (e) => {
      // Don't trigger if user clicked an interactive control
      if (e.target.closest('button') || e.target.closest('a')) return
      transition()
    }

    slider.addEventListener('click', handleSliderClick)

    return () => {
      isDisposed = true
      visibilityObserver.disconnect()
      window.removeEventListener('resize', handleResize)
      resizeObserver.disconnect()
      slider.removeEventListener('click', handleSliderClick)

      if (rippleTween) rippleTween.kill()

      currentSplits.forEach((s) => s?.revert && s.revert())

      plane.geometry.dispose()
      material.dispose()
      textures.forEach((t) => t.dispose())
      renderer.dispose()

      if (canvasElement && canvasElement.parentNode) {
        canvasElement.parentNode.removeChild(canvasElement)
      }
    }
  }, [])

  return (
    <section className="whoweare-section" id="about">
      <div className="slider" ref={sliderRef}>
        {/* Dynamic slide text is mounted inside this host */}
        <div className="slide-content-host" ref={slidesHostRef}></div>

        {/* Ambient Top Bar with subtle mix-blend */}
        <div className="slider-top-bar">
          <div className="slider-badge">
            Bromo Tengger Semeru
          </div>
          <div className="slider-counter">
            <span className="counter-current">
              {String(activeSlideIndex + 1).padStart(2, '0')}
            </span>
            <span className="counter-divider">/</span>
            <span className="counter-total">
              {String(slides.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Bottom Interactive Bar */}
        <div className="slider-bottom-bar">
          <div className="slider-hint">
            <span>Click anywhere to ripple transition</span>
          </div>

          <div className="slider-nav-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`nav-dot ${i === activeSlideIndex ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  transitionRef.current && transitionRef.current(i)
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

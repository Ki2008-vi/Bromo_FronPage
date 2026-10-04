import React, { useEffect, useRef } from 'react'
import { ReactLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './App.css'

import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import WhoWeAre from './components/WhoWeAre/WhoWeAre'
import OurHikes from './components/OurHikes/OurHikes'
import FAQNEW from './components/FAQNEW/FAQNEW'
import Footer from './components/Footer/Footer'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const lenisRef = useRef(null)

  useEffect(() => {
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }

    const lenisInstance = lenisRef.current?.lenis
    if (lenisInstance) {
      lenisInstance.on('scroll', ScrollTrigger.update)
    }

    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(update)
      if (lenisInstance) {
        lenisInstance.off('scroll', ScrollTrigger.update)
      }
    }
  }, [])

  return (
    <ReactLenis root ref={lenisRef} autoRaf={false}>
      <div className="app-container">
        <Navbar />
        <main>
          <Hero />
          <WhoWeAre />
          <OurHikes />
          <FAQNEW />
        </main>
        <Footer />
      </div>
    </ReactLenis>
  )
}

export default App

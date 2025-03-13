import React from 'react'
import HeroSection from '../components/forHome/HeroSection'
import StepsContainer from '../components/forHome/StepsContainer'
import Services from '../components/forHome/Services'
import Carousel from '../components/forHome/carousel'
function Home() {
  return (
    <div>
      <HeroSection></HeroSection>
      <StepsContainer></StepsContainer>
      <Services></Services>
      <Carousel></Carousel>
    </div>
  )
}

export default Home

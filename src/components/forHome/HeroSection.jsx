import React from 'react'
import Progress from './progress'
import CreateaccBtn from './CreateaccBtn'
import GetStartedBtn from '../forHeader/getStartedBtn'
import image from '../../assets/Blog post-bro.svg'
import './HeroSection.css'
import Header from '../forHeader/header'
import image2 from '../../assets/7273 2.png'
function HeroSection() {
    return (
      <div className="hero-container">
        <Header></Header>
        <br />
        <div className="hero-content">

          <div className="leftCorner">
          <img src={image2} alt="Decorative Graphic" className="corner-image" />
            <h1 className="HeroTitle">Start with ICTGraphic</h1>
            <p className="HeroSubTitle">
              Are you tired of searching continuously for a simple <br />
              ICT term just to find some definition? Well, IctGraphic <br />
              is a life changer! +100 ICT terms in one place. Click <br />
              the button, fill the level’s bar, and start the journey.
            </p>
            <div className="button-group">
              <GetStartedBtn className="get-started-btn" displayedText="get started"></GetStartedBtn>
              <CreateaccBtn className="create-acc-btn" />
            </div>
          </div>
          <img src="your-image-url.png" alt="Top Right Design" className="top-right-image" />
          <div className="rightCorner">
            <img src={image} alt="Illustration" className="broImg" />
          </div>
        </div>
        <Progress />
      </div>
    );
  }
  
export default HeroSection
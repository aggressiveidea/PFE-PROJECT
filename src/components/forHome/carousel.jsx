import React, { useState } from "react";
import CarouselItem from "./carouselItem";
import { ChevronLeft, ChevronRight, Circle } from "lucide-react";
import image1 from "../../assets/undraw_community_fv55.svg";
import image2 from "../../assets/undraw_search-engines_k649.svg";
import image3 from "../../assets/undraw_books_2j5v.svg";
import "./HeroSection.css";
import image from '../../assets/7273 2.png'
const Carousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const items = [
    {
      title: "Community",
      description:
        "A rich community where you can enjoy and grow while learning more about the newest ICT terms",
      icon: image1,
    },
    {
      title: "easy search",
      description:
        "We provided you with all types of research to make it easier for you finding whataver you're searching for",
      icon: image2,
    },
    {
      title: "Dictionary support",
      description:
        "Well do you have the dictionary but you don't feel like searching for the page, we got you!",
      icon: image3,
    },
  ];

  const updateIndex = (newIndex) => {
    if (newIndex < 0) newIndex = items.length - 1;
    else if (newIndex >= items.length) newIndex = 0;
    setActiveIndex(newIndex);
  };

  return (
   <div className="fully-container">
     <img src={image} alt="Decorative Graphic" className="corner-image2" />
    <div className="service-text">
       <h1>Our services</h1>
       <p>we made sure our clients feel comfortable and <br /> have a unique experience <br /> by providing a set of terms and <br /> also services</p>
    </div>
    <div className="carousel-wrapper">
      <div className="carousel">
        <div className="inner" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
          {items.map((item, index) => (
            <CarouselItem key={index} item={item} />
          ))}
        </div>
      </div>

      <div className="carousel-buttons">

        <button className="button-arrow" onClick={() => updateIndex(activeIndex - 1)}>
          <ChevronLeft size={40} color="#fff" />
        </button>

        <div className="indicators">
          {items.map((_, index) => (
            <button key={index} className="indicator-buttons" onClick={() => updateIndex(index)}>
              <Circle size={12} fill={index === activeIndex ? "#fff" : "#617d98"} />
            </button>
          ))}
        </div>

        <button className="button-arrow" onClick={() => updateIndex(activeIndex + 1)}>
          <ChevronRight size={40} color="#fff" />
        </button>
      </div>
    </div>
   </div>
  );
};

export default Carousel;

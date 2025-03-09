import React from 'react';
import './HeroSection.css';
import bg from '../../assets/Union (3).png';
import cloud from '../../assets/Vector (3).png';

function SkyBg() {
  return (
    <div className="sky-container">
    {/* hadi lazm tdi kaml al div's width */}
      <img src={bg} alt="Background" className="sky-bg" />

      <img src={cloud} alt="Cloud" className="cloud cloud-1" />
      <img src={cloud} alt="Cloud" className="cloud cloud-2" />
      <img src={cloud} alt="Cloud" className="cloud cloud-3" />
      <img src={cloud} alt="Cloud" className="cloud cloud-4" />
      <img src={cloud} alt="Cloud" className="cloud cloud-5" />
      <img src={cloud} alt="Cloud" className="cloud cloud-6" />
      <img src={cloud} alt="Cloud" className="cloud cloud-7" />
    </div>
  );
}

export default SkyBg;

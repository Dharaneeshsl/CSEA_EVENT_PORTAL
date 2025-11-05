import React, { useState, useEffect } from 'react';
import './StrangerThingsIntro.css';

const StrangerThingsIntro = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Total animation duration: 10 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        onComplete();
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) {
    return null;
  }

  // Letters with alternating directions for build-in
  const topLetters = ['C', 'S', 'E', 'A', ' ', 'E', 'V', 'E', 'N', 'T'];
  const bottomLetters = ['P', 'O', 'R', 'T', 'A', 'L'];

  return (
    <div className="stranger-things-intro">
      {/* Film Grain */}
      <div className="film-grain"></div>
      
      {/* Fog/Mist Layer */}
      <div className="fog-layer"></div>
      
      {/* Vignette */}
      <div className="vignette-overlay"></div>
      
      {/* Chromatic Aberration Effect */}
      <div className="chromatic-aberration"></div>
      
      {/* Main Container */}
      <div className="intro-container">
        <div className="text-content">
          {/* Top line: CSEA EVENT */}
          <div className="text-line text-top">
            {topLetters.map((letter, index) => (
              letter === ' ' ? (
                <span key={index} className="letter-spacer"></span>
              ) : (
                <span
                  key={index}
                  className="letter"
                  data-index={index}
                  data-direction={index % 2 === 0 ? 'left' : 'right'}
                >
                  {letter}
                </span>
              )
            ))}
          </div>
          
          {/* Bottom line: PORTAL */}
          <div className="text-line text-bottom">
            {bottomLetters.map((letter, index) => (
              <span
                key={index}
                className={`letter portal-letter ${letter === 'O' ? 'portal-o' : ''}`}
                data-index={index + topLetters.length}
                data-direction={index % 2 === 0 ? 'left' : 'right'}
              >
                {letter}
              </span>
            ))}
          </div>
        </div>
        
        {/* Multi-layer Glow */}
        <div className="glow-outer"></div>
        <div className="glow-inner"></div>
        
        {/* Lens Flare */}
        <div className="lens-flare"></div>
        
        {/* Letter Reflections */}
        <div className="letter-reflections">
          <div className="reflection-top">CSEA EVENT</div>
          <div className="reflection-bottom">PORTAL</div>
        </div>
      </div>
      
      {/* Portal Mask - O expands to fill screen */}
      <div className="portal-mask"></div>
    </div>
  );
};

export default StrangerThingsIntro;

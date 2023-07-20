import React, { useRef } from 'react';
import Cards from '../Cards/Cards';

const ScrollingCards = () => {
  const containerRef = useRef(null);

  const handleDotClick = (index) => {
    const container = containerRef.current;
    const cardWidth = container.querySelector('.card').offsetWidth;
    container.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="cards-container" ref={containerRef}>
        {/* Your card components go here */}
        <Cards type="tea"/>
        <Cards type="tea"/>
        <Cards type="tea"/>
        <Cards type="tea" />
        <Cards type="tea" />
      </div>
      <div className="dots-container">
        <div className="dot active" onClick={() => handleDotClick(0)} />
        <div className="dot" onClick={() => handleDotClick(1)} />
        <div className="dot" onClick={() => handleDotClick(2)} />
      </div>
    </div>
  );
};

export default ScrollingCards;

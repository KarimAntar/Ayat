import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';
import { prayers } from './data/prayers';
import './index.css';

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    hiddenRight: {
      x: "100%",
      opacity: 0,
    },
    hiddenLeft: {
      x: "-100%",
      opacity: 0,
    },
    visible: {
      x: "0",
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    },
    exitRight: {
      x: "100%",
      opacity: 0,
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    },
    exitLeft: {
      x: "-100%",
      opacity: 0,
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < prayers.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'Space') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const currentSlide = prayers[currentIndex];

  return (
    <div className="app-container" {...handlers} dir="rtl">
      <div className="islamic-pattern"></div>
      
      <AnimatePresence initial={false} mode='wait'>
        <motion.div
          key={currentIndex}
          className="slide"
          variants={slideVariants}
          initial={direction === 1 ? 'hiddenRight' : 'hiddenLeft'}
          animate="visible"
          exit={direction === 1 ? 'exitLeft' : 'exitRight'}
        >
          <h1 className="slide-title">{currentSlide.title}</h1>
          <h3 className="slide-subtitle">{currentSlide.subtitle}</h3>
          <div className="slide-content">
            {currentSlide.content}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="nav-controls" dir="ltr">
        <button 
          className="nav-btn" 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
          aria-label="Previous Slide"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="progress-dots">
          {prayers.map((_, idx) => (
            <div 
              key={idx} 
              className={`dot ${idx === currentIndex ? 'active' : ''}`}
            />
          ))}
        </div>

        <button 
          className="nav-btn" 
          onClick={handleNext} 
          disabled={currentIndex === prayers.length - 1}
          aria-label="Next Slide"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}

export default App;

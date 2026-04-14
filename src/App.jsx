import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';
import { prayers } from './data/prayers';
import WeatherBackground from './components/WeatherBackground';
import './index.css';

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const lastScrollTime = React.useRef(0);

  const slideVariants = {
    hiddenRight: {
      x: 50,
      opacity: 0,
    },
    hiddenLeft: {
      x: -50,
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exitRight: {
      x: 50,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    },
    exitLeft: {
      x: -50,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn"
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

    const handleWheel = (e) => {
      const slideContent = e.target.closest('.slide-content');
      // If we are hovering over text that is natively scrollable because it's too long, prioritize vertical text scrolling
      if (slideContent && slideContent.scrollHeight > slideContent.clientHeight) {
        return; 
      }

      const now = Date.now();
      if (now - lastScrollTime.current > 800) { // 800ms cooldown to prevent aggressive trackpad skipping
        if (e.deltaY > 30) {
          handleNext();
          lastScrollTime.current = now;
        } else if (e.deltaY < -30) {
          handlePrev();
          lastScrollTime.current = now;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [currentIndex]);

  const currentSlide = prayers[currentIndex];

  const renderVerseNumbers = (text) => {
    if (!text) return text;
    // Split text by the precise verse numbering structure ﴿...﴾
    const parts = text.split(/(﴿[٠١٢٣٤٥٦٧٨٩]+﴾)/g);
    return parts.map((part, index) => {
      // Check if this part string is a verse number
      if (part.match(/^﴿[٠١٢٣٤٥٦٧٨٩]+﴾$/)) {
        return <span key={index} className="verse-number">{part}</span>;
      }
      return part;
    });
  };

  return (
    <div className="app-container" {...handlers} dir="rtl">
      <WeatherBackground />
      
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
            {renderVerseNumbers(currentSlide.content)}
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

      <a 
        href="https://karims.dev" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="copyright-badge"
        dir="ltr"
      >
        © {new Date().getFullYear()} Karim Development
      </a>
    </div>
  );
}

export default App;

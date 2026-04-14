import React from 'react';
import { motion } from 'framer-motion';
import './WeatherBackground.css';

const Cloud = ({ delay, duration, y, scale, opacity }) => (
  <motion.svg
    className="sky-cloud"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 50"
    initial={{ x: '110vw' }}
    animate={{ x: '-30vw' }}
    transition={{
      repeat: Infinity,
      duration: duration,
      delay: delay,
      ease: "linear"
    }}
    style={{ top: y, scale: scale, opacity: opacity }}
  >
    <path d="M 25 35 A 15 15 0 0 1 25 10 A 15 15 0 0 1 45 10 A 20 20 0 0 1 80 15 A 15 15 0 0 1 80 40 Z" fill="#ffffff" />
  </motion.svg>
);

const Star = ({ top, left, delay, duration }) => (
  <motion.div
    className="sky-star"
    style={{ top, left }}
    animate={{ opacity: [0.2, 1, 0.2] }}
    transition={{ repeat: Infinity, duration: duration, delay: delay }}
  />
);

const WeatherBackground = () => {
  return (
    <div className="weather-background theme-night">
      
      {/* Light Source (Moon) */}
      <motion.div 
        className="celestial-body"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      />

      {/* Stars if Night */}
      <div className="stars-container">
        {[...Array(30)].map((_, i) => (
          <Star 
            key={i} 
            top={`${Math.random() * 80}%`} 
            left={`${Math.random() * 100}%`} 
            delay={Math.random() * 5} 
            duration={2 + Math.random() * 3} 
          />
        ))}
      </div>

      {/* Floating Clouds */}
      <Cloud delay={0} duration={60} y="5%" scale={1.5} opacity={0.2} />
      <Cloud delay={15} duration={80} y="15%" scale={1} opacity={0.15} />
      <Cloud delay={30} duration={50} y="2%" scale={0.8} opacity={0.1} />
      <Cloud delay={5} duration={90} y="25%" scale={2} opacity={0.05} />
      
      {/* Overlays for religious vibe */}
      <div className="islamic-texture"></div>
    </div>
  );
};

export default WeatherBackground;

import React, { useState, useEffect } from 'react';
import EditableText from './EditableText';

const HeroSection = () => {
  const [heroTitle, setHeroTitle] = useState("Happy Birthday!");
  const [heroSubtitle, setHeroSubtitle] = useState("Celebrating another amazing year of memories");

  // Load saved title and subtitle from localStorage
  useEffect(() => {
    const savedTitle = localStorage.getItem('hero-title');
    const savedSubtitle = localStorage.getItem('hero-subtitle');
    if (savedTitle) {
      setHeroTitle(savedTitle);
    }
    if (savedSubtitle) {
      setHeroSubtitle(savedSubtitle);
    }
  }, []);

  const handleScrollClick = () => {
    const firstSection = document.querySelector('.memory-section');
    if (firstSection) {
      firstSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleTitleSave = (newTitle) => {
    setHeroTitle(newTitle);
    localStorage.setItem('hero-title', newTitle);
  };

  const handleSubtitleSave = (newSubtitle) => {
    setHeroSubtitle(newSubtitle);
    localStorage.setItem('hero-subtitle', newSubtitle);
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <EditableText
          text={heroTitle}
          onSave={handleTitleSave}
          element="h1"
          className="hero-title"
          placeholder="Click to add a title..."
        />
        <EditableText
          text={heroSubtitle}
          onSave={handleSubtitleSave}
          element="p"
          className="hero-subtitle"
          placeholder="Click to add a subtitle..."
        />
        <div className="scroll-indicator" onClick={handleScrollClick}>
          <span>Scroll to explore</span>
          <div className="scroll-arrow">↓</div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

import React, { useState, useEffect } from 'react';
import EditableText from './EditableText';
import { getLocalStorageItem, setLocalStorageItem } from '../utils/localStorageEnhanced';

const HeroSection = () => {
  const [heroTitle, setHeroTitle] = useState("Happy Birthday!");
  const [heroSubtitle, setHeroSubtitle] = useState("Celebrating another amazing year of memories");

  // Load saved title and subtitle from localStorage
  useEffect(() => {
    try {
      const savedTitle = getLocalStorageItem('hero-title');
      const savedSubtitle = getLocalStorageItem('hero-subtitle');
      
      if (savedTitle) {
        setHeroTitle(savedTitle);
        console.log('Loaded saved hero title:', savedTitle);
      }
      if (savedSubtitle) {
        setHeroSubtitle(savedSubtitle);
        console.log('Loaded saved hero subtitle:', savedSubtitle);
      }
    } catch (error) {
      console.error('Error loading hero section from localStorage:', error);
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

  const handleTitleSave = async (newTitle) => {
    try {
      setHeroTitle(newTitle);
      await setLocalStorageItem('hero-title', newTitle);
      console.log('Saved hero title:', newTitle);
    } catch (error) {
      console.error('Error saving hero title to localStorage:', error);
    }
  };

  const handleSubtitleSave = async (newSubtitle) => {
    try {
      setHeroSubtitle(newSubtitle);
      await setLocalStorageItem('hero-subtitle', newSubtitle);
      console.log('Saved hero subtitle:', newSubtitle);
    } catch (error) {
      console.error('Error saving hero subtitle to localStorage:', error);
    }
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

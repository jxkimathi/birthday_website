import React, { useState, useEffect, useRef } from 'react';
import PhotoContainer from './PhotoContainer';
import EditableText from './EditableText';
import { getLocalStorageItem, setLocalStorageItem } from '../utils/localStorage';

const MemorySection = ({ id, title, text, photo, reverse, onTextUpdate }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentText, setCurrentText] = useState(text);
  const [currentTitle, setCurrentTitle] = useState(title);
  const sectionRef = useRef(null);

  // Load saved text and title from localStorage on component mount
  useEffect(() => {
    try {
      const savedText = getLocalStorageItem(`memory-text-${id}`);
      const savedTitle = getLocalStorageItem(`memory-title-${id}`);
      
      if (savedText) {
        setCurrentText(savedText);
        console.log(`Loaded saved text for memory ${id}:`, savedText.substring(0, 50) + '...');
      }
      if (savedTitle) {
        setCurrentTitle(savedTitle);
        console.log(`Loaded saved title for memory ${id}:`, savedTitle);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }, [id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsActive(true);
        }
      },
      {
        threshold: window.innerWidth <= 768 ? 0.1 : 0.3,
        rootMargin: window.innerWidth <= 768 ? '0px 0px -20px 0px' : '0px 0px -50px 0px'
      }
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  const handleTextSave = (newText) => {
    try {
      setCurrentText(newText);
      setLocalStorageItem(`memory-text-${id}`, newText);
      console.log(`Saved text for memory ${id}:`, newText.substring(0, 50) + '...');
      if (onTextUpdate) {
        onTextUpdate(id, newText);
      }
    } catch (error) {
      console.error('Error saving text to localStorage:', error);
    }
  };

  const handleTitleSave = (newTitle) => {
    try {
      setCurrentTitle(newTitle);
      setLocalStorageItem(`memory-title-${id}`, newTitle);
      console.log(`Saved title for memory ${id}:`, newTitle);
    } catch (error) {
      console.error('Error saving title to localStorage:', error);
    }
  };

  return (
    <section 
      ref={sectionRef}
      className={`memory-section ${reverse ? 'reverse' : ''} ${isActive ? 'active' : ''}`} 
      data-photo={photo}
    >
      <div className="content-wrapper">
        <div className="text-content">
          <div className="text-blur-wrapper">
            <EditableText
              text={currentTitle}
              onSave={handleTitleSave}
              element="h2"
              placeholder="Click to add a title..."
            />
            <EditableText
              text={currentText}
              onSave={handleTextSave}
              element="p"
              placeholder="Click to add your memory..."
            />
          </div>
        </div>
        <PhotoContainer 
          photoId={`photo${id}.jpg`}
          src={`images/${photo}`}
          alt={title}
        />
      </div>
    </section>
  );
};

export default MemorySection;

import React, { useState, useEffect, useRef } from 'react';
import PhotoContainer from './PhotoContainer';
import EditableText from './EditableText';

const MemorySection = ({ id, title, text, photo, reverse, onTextUpdate }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentText, setCurrentText] = useState(text);
  const [currentTitle, setCurrentTitle] = useState(title);
  const sectionRef = useRef(null);

  // Load saved text and title from localStorage on component mount
  useEffect(() => {
    const savedText = localStorage.getItem(`memory-text-${id}`);
    const savedTitle = localStorage.getItem(`memory-title-${id}`);
    if (savedText) {
      setCurrentText(savedText);
    }
    if (savedTitle) {
      setCurrentTitle(savedTitle);
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
    setCurrentText(newText);
    localStorage.setItem(`memory-text-${id}`, newText);
    if (onTextUpdate) {
      onTextUpdate(id, newText);
    }
  };

  const handleTitleSave = (newTitle) => {
    setCurrentTitle(newTitle);
    localStorage.setItem(`memory-title-${id}`, newTitle);
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

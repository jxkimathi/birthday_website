import React, { useState, useEffect, useRef } from 'react';
import EditableText from './EditableText';
import { getLocalStorageItem, setLocalStorageItem } from '../utils/localStorage';

const BirthdayMessage = () => {
  const [isActive, setIsActive] = useState(false);
  const [messageText, setMessageText] = useState(
    "May this new year of your life be filled with love, laughter, adventure, and all the happiness your heart can hold. You deserve nothing but the best, today and always."
  );
  const [messageTitle, setMessageTitle] = useState("Wishing You the Happiest Birthday!");
  const sectionRef = useRef(null);

  // Load saved message and title from localStorage on component mount
  useEffect(() => {
    try {
      const savedMessage = getLocalStorageItem('birthday-message-text');
      const savedTitle = getLocalStorageItem('birthday-message-title');
      
      if (savedMessage) {
        setMessageText(savedMessage);
        console.log('Loaded saved birthday message:', savedMessage.substring(0, 50) + '...');
      }
      if (savedTitle) {
        setMessageTitle(savedTitle);
        console.log('Loaded saved birthday message title:', savedTitle);
      }
    } catch (error) {
      console.error('Error loading birthday message from localStorage:', error);
    }
  }, []);

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

  const handleMessageSave = (newText) => {
    try {
      setMessageText(newText);
      setLocalStorageItem('birthday-message-text', newText);
      console.log('Saved birthday message:', newText.substring(0, 50) + '...');
    } catch (error) {
      console.error('Error saving birthday message to localStorage:', error);
    }
  };

  const handleTitleSave = (newTitle) => {
    try {
      setMessageTitle(newTitle);
      setLocalStorageItem('birthday-message-title', newTitle);
      console.log('Saved birthday message title:', newTitle);
    } catch (error) {
      console.error('Error saving birthday message title to localStorage:', error);
    }
  };

  return (
    <section 
      ref={sectionRef}
      className={`birthday-message ${isActive ? 'active' : ''}`}
    >
      <div className="message-content">
        <div className="text-blur-wrapper">
          <EditableText
            text={messageTitle}
            onSave={handleTitleSave}
            element="h2"
            placeholder="Click to add a title..."
          />
          <EditableText
            text={messageText}
            onSave={handleMessageSave}
            element="p"
            placeholder="Click to add your birthday message..."
          />
          <div className="birthday-animation">🎉🎂🎈</div>
        </div>
      </div>
    </section>
  );
};

export default BirthdayMessage;

import React, { useState, useEffect, useRef } from 'react';
import EditableText from './EditableText';
import { getLocalStorageItem, setLocalStorageItem } from '../utils/localStorageEnhanced';

const BirthdayMessage = () => {
  const [isActive, setIsActive] = useState(false);
  const [messageText, setMessageText] = useState(
    "My love, As you turn a year older I wish you the best. May God favour you in everything that you do. May he guide you and protect you in all your endevours. I pray that as you step into this new year you may get to learn more about yourself. That everyday you may get closer to your destiny. May your blessings be doubled and may you overcome any obstacle thrown your way. I pray that 22 brings you joy, peace, love and abundance. May all your wishes come true. Happy Happy Birthday my love. I thank God for bringing you to me💗"
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

  const handleMessageSave = async (newText) => {
    try {
      setMessageText(newText);
      await setLocalStorageItem('birthday-message-text', newText);
      console.log('Saved birthday message:', newText.substring(0, 50) + '...');
    } catch (error) {
      console.error('Error saving birthday message to localStorage:', error);
    }
  };

  const handleTitleSave = async (newTitle) => {
    try {
      setMessageTitle(newTitle);
      await setLocalStorageItem('birthday-message-title', newTitle);
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

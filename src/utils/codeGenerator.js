// Code generation utility to update source files with new defaults
import { generateUpdatedDefaults, generateMemoryDataCode, generateHeroSectionDefaults, generateBirthdayMessageDefaults } from './defaultsManager';

// Generate the complete App.js content with updated memory data
export const generateAppJsContent = () => {
  const memoryData = generateMemoryDataCode();
  
  const appJsTemplate = `import React, { useEffect, useState } from 'react';
import './App.css';
import HeroSection from './components/HeroSection';
import MemorySection from './components/MemorySection';
import BirthdayMessage from './components/BirthdayMessage';
import FloatingEmojis from './components/FloatingEmojis';
import DebugPanel from './components/DebugPanel';
import { initializeEnhancedStorage } from './utils/enhancedStorage';

function App() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Initialize enhanced storage on app load
  useEffect(() => {
    const initializeData = async () => {
      try {
        await initializeEnhancedStorage();
        console.log('✅ Enhanced storage initialized');
      } catch (error) {
        console.warn('⚠️ Enhanced storage initialization failed, using localStorage only:', error);
      } finally {
        setIsDataLoaded(true);
      }
    };

    initializeData();
  }, []);

  // Show loading state while data is being initialized
  if (!isDataLoaded) {
    return (
      <div className="App">
        <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Loading birthday memories...</h2>
          <p>Syncing data from server...</p>
        </div>
      </div>
    );
  }

  const memoryData = ${JSON.stringify(memoryData, null, 4)};

  return (
    <div className="App">
      <FloatingEmojis />
      <DebugPanel />
      <div className="container">
        <HeroSection />
        
        {memoryData.map((memory) => (
          <MemorySection 
            key={memory.id}
            id={memory.id}
            title={memory.title}
            text={memory.text}
            photo={memory.photo}
            reverse={memory.reverse}
          />
        ))}
        
        <BirthdayMessage />
      </div>
    </div>
  );
}

export default App;
`;

  return appJsTemplate;
};

// Generate the complete HeroSection.js content with updated defaults
export const generateHeroSectionContent = () => {
  const defaults = generateHeroSectionDefaults();
  
  const heroSectionTemplate = `import React, { useState, useEffect } from 'react';
import EditableText from './EditableText';
import { getLocalStorageItem, setLocalStorageItem } from '../utils/localStorageEnhanced';

const HeroSection = () => {
  const [heroTitle, setHeroTitle] = useState("${defaults.heroTitle}");
  const [heroSubtitle, setHeroSubtitle] = useState("${defaults.heroSubtitle}");

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
          placeholder="Click to edit the title..."
        />
        <EditableText
          text={heroSubtitle}
          onSave={handleSubtitleSave}
          element="p"
          className="hero-subtitle"
          placeholder="Click to edit the subtitle..."
        />
        <div className="scroll-indicator" onClick={handleScrollClick}>
          <div className="scroll-arrow">↓</div>
          <span>Scroll to explore memories</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
`;

  return heroSectionTemplate;
};

// Generate the complete BirthdayMessage.js content with updated defaults
export const generateBirthdayMessageContent = () => {
  const defaults = generateBirthdayMessageDefaults();
  
  const birthdayMessageTemplate = `import React, { useState, useEffect, useRef } from 'react';
import EditableText from './EditableText';
import { getLocalStorageItem, setLocalStorageItem } from '../utils/localStorageEnhanced';

const BirthdayMessage = () => {
  const [isActive, setIsActive] = useState(false);
  const [messageText, setMessageText] = useState(
    "${defaults.messageText}"
  );
  const [messageTitle, setMessageTitle] = useState("${defaults.messageTitle}");
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
      className={\`birthday-message \${isActive ? 'active' : ''}\`}
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
`;

  return birthdayMessageTemplate;
};

// Function to generate all updated files and display them
export const generateAllUpdatedCode = () => {
  const updates = {
    'App.js': generateAppJsContent(),
    'HeroSection.js': generateHeroSectionContent(), 
    'BirthdayMessage.js': generateBirthdayMessageContent(),
    metadata: {
      timestamp: new Date().toISOString(),
      defaults: generateUpdatedDefaults()
    }
  };
  
  console.log('🔧 Generated updated source code with current values as defaults:');
  console.log('Copy and paste these into your source files to make changes permanent:');
  console.log('');
  
  Object.entries(updates).forEach(([filename, content]) => {
    if (filename !== 'metadata') {
      console.log(`📄 === ${filename} ===`);
      console.log(content);
      console.log('');
    }
  });
  
  console.log('📊 Metadata:', updates.metadata);
  
  return updates;
};

// Function to create downloadable files (for browsers that support it)
export const downloadUpdatedFiles = () => {
  const updates = generateAllUpdatedCode();
  
  try {
    Object.entries(updates).forEach(([filename, content]) => {
      if (filename !== 'metadata') {
        const blob = new Blob([content], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `updated-${filename}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    });
    
    console.log('✅ Files prepared for download');
    return true;
  } catch (error) {
    console.error('❌ Error creating download files:', error);
    return false;
  }
};

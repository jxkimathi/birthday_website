import React, { useEffect, useRef, useCallback } from 'react';

// Constants moved outside component to avoid re-creation on every render
const celebrationEmojis = [
  '🎉', '🎊', '🎂', '🎈', '🎁', '✨', '🌟', '💫', '🎀', '🎪',
  '🎭', '🎨', '🎵', '🎶', '💖', '💝', '🥳', '🎊', '🎉', '✨'
];

const birthdayEmojis = ['🎂', '🎉', '🎊', '🥳', '🎈', '🎁'];
const animationTypes = ['floatAround', 'floatSideways', 'floatDiagonal'];
const sizeClasses = ['small', '', 'large'];

const FloatingEmojis = () => {
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  const createFloatingEmoji = useCallback(() => {
    if (!containerRef.current) return;

    const emoji = document.createElement('div');
    
    // 30% chance for special birthday emoji
    const isBirthdayEmoji = Math.random() < 0.3;
    const selectedEmoji = isBirthdayEmoji ? 
      birthdayEmojis[Math.floor(Math.random() * birthdayEmojis.length)] :
      celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)];
    
    const sizeClass = sizeClasses[Math.floor(Math.random() * sizeClasses.length)];
    emoji.className = `floating-emoji ${sizeClass}`;
    
    // Add special styling for birthday emojis
    if (isBirthdayEmoji) {
      emoji.className += ' birthday';
      if (Math.random() < 0.5) {
        emoji.className += ' pulse';
      }
    }
    
    emoji.textContent = selectedEmoji;
    
    // Random positioning and animation
    const animationType = animationTypes[Math.floor(Math.random() * animationTypes.length)];
    const duration = 15 + Math.random() * 10; // 15-25 seconds
    const delay = Math.random() * 2; // 0-2 seconds delay
    
    // Set random positions and movement
    if (animationType === 'floatAround') {
      const randomX = (Math.random() - 0.5) * 100; // -50vw to +50vw
      emoji.style.left = Math.random() * 100 + 'vw';
      emoji.style.setProperty('--random-x', randomX + 'vw');
    } else if (animationType === 'floatSideways') {
      const randomY = Math.random() * 80 + 10; // 10vh to 90vh
      const randomYEnd = Math.random() * 80 + 10;
      emoji.style.setProperty('--random-y', randomY + 'vh');
      emoji.style.setProperty('--random-y-end', randomYEnd + 'vh');
    }
    
    emoji.style.animation = `${animationType} ${duration}s linear infinite`;
    emoji.style.animationDelay = delay + 's';
    
    containerRef.current.appendChild(emoji);
    
    // Remove emoji after animation completes
    setTimeout(() => {
      if (emoji.parentNode) {
        emoji.parentNode.removeChild(emoji);
      }
    }, (duration + delay + 1) * 1000);
  }, []);

  const createSpecialBirthdayBurst = useCallback(() => {
    if (!containerRef.current) return;

    const emoji = document.createElement('div');
    emoji.className = 'floating-emoji large birthday pulse';
    emoji.textContent = birthdayEmojis[Math.floor(Math.random() * birthdayEmojis.length)];
    
    // Start from center and float outward
    emoji.style.left = '50vw';
    emoji.style.top = '50vh';
    emoji.style.animation = 'floatAround 15s linear forwards';
    emoji.style.setProperty('--random-x', (Math.random() - 0.5) * 200 + 'vw');
    
    containerRef.current.appendChild(emoji);
    
    setTimeout(() => {
      if (emoji.parentNode) {
        emoji.parentNode.removeChild(emoji);
      }
    }, 15000);
  }, []);

  useEffect(() => {
    // Create initial batch of emojis
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        createFloatingEmoji();
      }, i * 1000);
    }
    
    // Welcome burst of birthday emojis
    setTimeout(() => {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          createSpecialBirthdayBurst();
        }, i * 200);
      }
    }, 2000);
    
    // Continue creating emojis at regular intervals
    intervalRef.current = setInterval(() => {
      createFloatingEmoji();
    }, 3000);
    
    // Add scroll listener for extra emojis
    let scrollTimeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (Math.random() < 0.3) { // 30% chance on scroll
          createFloatingEmoji();
        }
      }, 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [createFloatingEmoji, createSpecialBirthdayBurst]);

  return <div ref={containerRef} className="floating-emojis" id="floatingEmojis"></div>;
};

export default FloatingEmojis;

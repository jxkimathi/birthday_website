import React, { useState, useEffect } from 'react';

const PhotoContainer = ({ photoId, src, alt }) => {
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    // Load saved photo from localStorage
    const savedPhoto = localStorage.getItem(photoId);
    if (savedPhoto) {
      setCurrentSrc(savedPhoto);
    }
  }, [photoId]);

  const createCelebrationParticles = (container) => {
    const particles = ['🎉', '🎊', '✨', '🌟', '💫', '🎈'];
    const containerRect = container.getBoundingClientRect();
    
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.className = 'celebration-particle';
        particle.textContent = particles[Math.floor(Math.random() * particles.length)];
        particle.style.cssText = `
          position: fixed;
          left: ${containerRect.left + containerRect.width / 2}px;
          top: ${containerRect.top + containerRect.height / 2}px;
          font-size: 24px;
          pointer-events: none;
          z-index: 1000;
          animation: celebrationFloat 2s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
          if (document.body.contains(particle)) {
            document.body.removeChild(particle);
          }
        }, 2000);
      }, i * 150);
    }
  };

  const triggerPhotoUpload = (event) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
    fileInput.onchange = function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(readEvent) {
          setCurrentSrc(readEvent.target.result);
          
          // Add visual feedback
          const container = event.currentTarget;
          container.style.transform = 'scale(1.05)';
          container.style.boxShadow = '0 20px 60px rgba(255, 215, 0, 0.6), 0 0 40px var(--glow-color)';
          
          // Create celebration particles
          createCelebrationParticles(container);
          
          // Reset visual feedback after animation
          setTimeout(() => {
            container.style.transform = '';
            container.style.boxShadow = '';
          }, 800);
          
          // Store the image data
          localStorage.setItem(photoId, readEvent.target.result);
        };
        reader.readAsDataURL(file);
      }
      
      // Remove the temporary input
      document.body.removeChild(fileInput);
    };
    
    // Add to body and trigger click
    document.body.appendChild(fileInput);
    fileInput.click();
  };

  return (
    <div className="photo-container" onClick={triggerPhotoUpload}>
      <img src={currentSrc} alt={alt} className="memory-photo" />
    </div>
  );
};

export default PhotoContainer;

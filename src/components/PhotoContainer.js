import React, { useState, useEffect } from 'react';

const PhotoContainer = ({ photoId, src, alt }) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    // Load saved photo from localStorage
    const savedPhoto = localStorage.getItem(photoId);
    if (savedPhoto) {
      setCurrentSrc(savedPhoto);
    }
    
    // Check if this photo is set as default
    const defaultPhoto = localStorage.getItem(`default-${photoId}`);
    setIsDefault(!!defaultPhoto);
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
    event.stopPropagation();
    const container = event.currentTarget; // Store the container reference immediately
    
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
          
          // Add visual feedback using the stored container reference
          if (container) {
            container.style.transform = 'scale(1.05)';
            container.style.boxShadow = '0 20px 60px rgba(255, 215, 0, 0.6), 0 0 40px var(--glow-color)';
            
            // Create celebration particles
            createCelebrationParticles(container);
            
            // Reset visual feedback after animation
            setTimeout(() => {
              if (container) {
                container.style.transform = '';
                container.style.boxShadow = '';
              }
            }, 800);
          }
          
          // Store the image data
          localStorage.setItem(photoId, readEvent.target.result);
        };
        reader.readAsDataURL(file);
      }
      
      // Remove the temporary input
      if (document.body.contains(fileInput)) {
        document.body.removeChild(fileInput);
      }
    };
    
    // Add to body and trigger click
    document.body.appendChild(fileInput);
    fileInput.click();
  };

  const handleRightClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Only show context menu if there's a custom photo uploaded
    const savedPhoto = localStorage.getItem(photoId);
    if (savedPhoto) {
      setContextMenuPosition({ x: event.clientX, y: event.clientY });
      setShowContextMenu(true);
    }
  };

  const handleSetAsDefault = () => {
    const savedPhoto = localStorage.getItem(photoId);
    if (savedPhoto) {
      // Store in a special defaults key
      const defaultKey = `default-${photoId}`;
      localStorage.setItem(defaultKey, savedPhoto);
      
      // Also store metadata about which photos have been set as defaults
      const defaultPhotos = JSON.parse(localStorage.getItem('default-photos') || '{}');
      defaultPhotos[photoId] = {
        timestamp: new Date().toISOString(),
        originalSrc: src
      };
      localStorage.setItem('default-photos', JSON.stringify(defaultPhotos));
      
      // Update state to show visual indicator
      setIsDefault(true);
      
      // Show success feedback
      alert('✅ Photo set as default! This photo will now be the default for all users.');
      console.log(`Photo ${photoId} set as default`);
    }
    setShowContextMenu(false);
  };

  const handleResetToOriginal = () => {
    // Remove custom photo and default
    localStorage.removeItem(photoId);
    localStorage.removeItem(`default-${photoId}`);
    
    // Update default photos metadata
    const defaultPhotos = JSON.parse(localStorage.getItem('default-photos') || '{}');
    delete defaultPhotos[photoId];
    localStorage.setItem('default-photos', JSON.stringify(defaultPhotos));
    
    // Reset to original src and state
    setCurrentSrc(src);
    setIsDefault(false);
    setShowContextMenu(false);
    
    alert('📷 Photo reset to original!');
  };

  // Close context menu when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = () => {
      setShowContextMenu(false);
    };

    if (showContextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showContextMenu]);

  // Load default photo if no custom photo exists
  useEffect(() => {
    const savedPhoto = localStorage.getItem(photoId);
    const defaultPhoto = localStorage.getItem(`default-${photoId}`);
    
    if (savedPhoto) {
      setCurrentSrc(savedPhoto);
    } else if (defaultPhoto) {
      setCurrentSrc(defaultPhoto);
    }
  }, [photoId, src]);

  return (
    <>
      <div 
        className={`photo-container ${isDefault ? 'has-default' : ''}`}
        onClick={triggerPhotoUpload}
        onContextMenu={handleRightClick}
        title="Left click to upload photo, right click for options"
      >
        <img src={currentSrc} alt={alt} className="memory-photo" />
      </div>

      {/* Context Menu */}
      {showContextMenu && (
        <div
          className="photo-context-menu"
          style={{
            position: 'fixed',
            left: `${contextMenuPosition.x}px`,
            top: `${contextMenuPosition.y}px`,
            background: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            padding: '8px 0',
            zIndex: 10000,
            minWidth: '180px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(10px)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleSetAsDefault}
            style={{
              display: 'block',
              width: '100%',
              background: 'none',
              border: 'none',
              color: '#4CAF50',
              padding: '8px 16px',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
            onMouseLeave={(e) => e.target.style.background = 'none'}
          >
            ✅ Set as Default
          </button>
          <button
            onClick={handleResetToOriginal}
            style={{
              display: 'block',
              width: '100%',
              background: 'none',
              border: 'none',
              color: '#ff6b6b',
              padding: '8px 16px',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
            onMouseLeave={(e) => e.target.style.background = 'none'}
          >
            🔄 Reset to Original
          </button>
        </div>
      )}
    </>
  );
};

export default PhotoContainer;

// Utility to persist changes as hardcoded defaults in the source files
import { getBirthdayDataSummary } from './localStorage';

// Function to check localStorage usage
export const getStorageUsage = () => {
  try {
    let totalSize = 0;
    const itemSizes = {};
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        const size = new Blob([value]).size;
        totalSize += size;
        itemSizes[key] = size;
      }
    }
    
    // Rough estimate of localStorage limit (5MB in most browsers)
    const estimatedLimit = 5 * 1024 * 1024; // 5MB
    const usagePercent = Math.round((totalSize / estimatedLimit) * 100);
    
    return {
      totalSize,
      usagePercent,
      itemSizes,
      estimatedLimit
    };
  } catch (error) {
    console.error('Error checking storage usage:', error);
    return null;
  }
};

// Generate updated default values based on current localStorage
export const generateUpdatedDefaults = () => {
  const currentData = getBirthdayDataSummary();
  
  const defaults = {
    heroTitle: currentData.heroTitle || "Happy Birthday!",
    heroSubtitle: currentData.heroSubtitle || "Celebrating another amazing year of memories",
    birthdayMessageTitle: currentData.birthdayMessageTitle || "Wishing You the Happiest Birthday!",
    birthdayMessageText: currentData.birthdayMessageText || "May this new year of your life be filled with love, laughter, adventure, and all the happiness your heart can hold. You deserve nothing but the best, today and always.",
    memories: {},
    photos: {}
  };

  // Generate memory defaults
  for (let i = 1; i <= 10; i++) {
    const memory = currentData.memories[i];
    if (memory && (memory.title || memory.text)) {
      defaults.memories[i] = {
        title: memory.title || `Memory ${i}`,
        text: memory.text || `Default text for memory ${i}`
      };
    }
  }

  // Generate photo defaults
  const defaultPhotos = JSON.parse(localStorage.getItem('default-photos') || '{}');
  for (let i = 1; i <= 10; i++) {
    const photoId = `photo${i}.jpg`;
    const defaultPhoto = localStorage.getItem(`default-${photoId}`);
    if (defaultPhoto && defaultPhotos[photoId]) {
      defaults.photos[photoId] = {
        data: defaultPhoto,
        timestamp: defaultPhotos[photoId].timestamp,
        originalSrc: defaultPhotos[photoId].originalSrc
      };
    }
  }

  return defaults;
};

// Generate the code string for App.js memoryData array
export const generateMemoryDataCode = () => {
  const defaults = generateUpdatedDefaults();
  const baseMemoryData = [
    {
      id: 1,
      title: "Childhood Memories",
      text: "Remember when we were kids and every birthday felt like the most magical day of the year? Those innocent times when blowing out candles was the highlight of our day, and cake was the only thing that mattered. The joy in your eyes when you opened presents, the laughter that filled the room - those memories are precious and will always hold a special place in our hearts.",
      photo: "placeholder1.jpg",
      reverse: false
    },
    {
      id: 2,
      title: "Adventures Together", 
      text: "From spontaneous road trips to quiet coffee conversations, we've shared countless adventures that have shaped who we are today. Each journey we've taken together has been filled with laughter, discovery, and the kind of memories that make life truly special. Here's to all the paths we've walked and the many more adventures that await us in the year ahead.",
      photo: "placeholder2.jpg",
      reverse: true
    },
    {
      id: 3,
      title: "Special Moments",
      text: "Life is made up of small moments that become big memories. Those quiet times when we've shared our deepest thoughts, the celebrations of your achievements, and the comfort we've provided each other during challenging times. These special moments have woven the beautiful tapestry of our friendship and created bonds that time cannot break.",
      photo: "placeholder3.jpg",
      reverse: false
    },
    {
      id: 4,
      title: "Achievements & Milestones",
      text: "Your journey has been marked by incredible achievements and important milestones that deserve to be celebrated. From personal victories to professional successes, you've shown determination, courage, and grace in everything you do. Each accomplishment is a testament to your character and a reason for all of us who love you to feel proud and inspired.",
      photo: "placeholder4.jpg",
      reverse: true
    },
    {
      id: 5,
      title: "Looking Forward",
      text: "As we celebrate another year of your amazing life, we also look forward to all the wonderful things that await you. New experiences, fresh adventures, deeper connections, and dreams yet to be fulfilled. Your birthday isn't just about celebrating the past - it's about embracing the bright future that lies ahead, filled with endless possibilities and joy.",
      photo: "placeholder5.jpg",
      reverse: false
    },
    {
      id: 6,
      title: "Family & Friends",
      text: "The people who surround you with love and support make your life truly rich. From family gatherings filled with laughter to spontaneous meetups with friends, these relationships have shaped who you are today. The bonds you've built, the trust you've earned, and the joy you bring to others' lives are testaments to your beautiful heart and caring spirit.",
      photo: "placeholder6.jpg",
      reverse: true
    },
    {
      id: 7,
      title: "Creative Pursuits",
      text: "Your creative spirit has always been one of your most admirable qualities. Whether it's through art, music, writing, or any other form of expression, you've found ways to bring beauty into the world. These creative moments are not just hobbies - they're reflections of your soul and windows into the unique perspective you share with everyone around you.",
      photo: "placeholder7.jpg",
      reverse: false
    },
    {
      id: 8,
      title: "Challenges Overcome",
      text: "Life has presented its share of challenges, and you've faced each one with courage and determination. Every obstacle you've overcome has made you stronger, wiser, and more resilient. Your ability to persevere through difficult times while maintaining your positive spirit is truly inspiring and shows the incredible strength of character you possess.",
      photo: "placeholder8.jpg",
      reverse: true
    },
    {
      id: 9,
      title: "Simple Joys",
      text: "Sometimes the most precious memories come from life's simplest moments. A perfect cup of coffee on a quiet morning, a good book on a rainy day, or sharing laughter over something completely silly. These small joys remind us that happiness doesn't always come from grand gestures - often it's found in the everyday moments that make life beautiful.",
      photo: "placeholder9.jpg",
      reverse: false
    },
    {
      id: 10,
      title: "Dreams & Aspirations",
      text: "Your dreams and aspirations continue to evolve and inspire not only yourself but everyone who knows you. The goals you've set, the visions you're working toward, and the passion you put into everything you do light up the world around you. As you celebrate another year, know that your dreams are valid, your efforts are noticed, and your potential is limitless.",
      photo: "placeholder10.jpg",
      reverse: true
    }
  ];

  // Update with current values
  return baseMemoryData.map(memory => {
    const customMemory = defaults.memories[memory.id];
    if (customMemory) {
      return {
        ...memory,
        title: customMemory.title || memory.title,
        text: customMemory.text || memory.text
      };
    }
    return memory;
  });
};

// Generate the code string for HeroSection default states
export const generateHeroSectionDefaults = () => {
  const defaults = generateUpdatedDefaults();
  return {
    heroTitle: defaults.heroTitle,
    heroSubtitle: defaults.heroSubtitle
  };
};

// Generate the code string for BirthdayMessage default states  
export const generateBirthdayMessageDefaults = () => {
  const defaults = generateUpdatedDefaults();
  return {
    messageTitle: defaults.birthdayMessageTitle,
    messageText: defaults.birthdayMessageText
  };
};

// Function to clean up localStorage to free space
export const cleanupLocalStorage = () => {
  try {
    // Remove old backups
    const keysToRemove = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.startsWith('birthday-defaults-backup') ||
        key.startsWith('temp-') ||
        key.includes('cache-')
      )) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log(`🧹 Cleaned up: ${key}`);
    });
    
    return keysToRemove.length;
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    return 0;
  }
};

// Function to save current state as new defaults (optimized)
export const saveAsDefaults = async () => {
  try {
    console.log('💾 Generating new default values from current state...');
    
    // First, clean up old data to make space
    const cleanedItems = cleanupLocalStorage();
    if (cleanedItems > 0) {
      console.log(`🧹 Cleaned up ${cleanedItems} old items to free space`);
    }
    
    const defaults = generateUpdatedDefaults();
    const memoryData = generateMemoryDataCode();
    const heroDefaults = generateHeroSectionDefaults();
    const messageDefaults = generateBirthdayMessageDefaults();
    
    // Create a lightweight backup (without large photo data)
    const backupData = {
      timestamp: new Date().toISOString(),
      defaults: {
        heroTitle: defaults.heroTitle,
        heroSubtitle: defaults.heroSubtitle,
        birthdayMessageTitle: defaults.birthdayMessageTitle,
        birthdayMessageText: defaults.birthdayMessageText,
        memories: defaults.memories
        // Exclude photos to save space
      },
      memoryData,
      heroDefaults,
      messageDefaults
    };
    
    // Try to save backup to localStorage with error handling
    try {
      localStorage.setItem('birthday-defaults-backup', JSON.stringify(backupData));
      console.log('✅ New defaults generated and backed up (lightweight)');
    } catch (quotaError) {
      console.warn('⚠️ Could not save backup due to storage limits, but defaults generated successfully');
    }
    
    console.log('✅ New defaults generated:', {
      heroTitle: heroDefaults.heroTitle,
      heroSubtitle: heroDefaults.heroSubtitle,
      messageTitle: messageDefaults.messageTitle,
      memoryCount: Object.keys(defaults.memories).length
    });
    
    return backupData;
  } catch (error) {
    console.error('❌ Error saving as defaults:', error);
    return null;
  }
};

// Function to restore from backup
export const restoreFromBackup = () => {
  try {
    const backup = localStorage.getItem('birthday-defaults-backup');
    if (backup) {
      const data = JSON.parse(backup);
      console.log('📋 Backup found from:', data.timestamp);
      return data;
    }
    return null;
  } catch (error) {
    console.error('❌ Error restoring from backup:', error);
    return null;
  }
};

// Function to clear all customizations and restore original defaults
export const resetToOriginalDefaults = () => {
  try {
    // Clear all localStorage data
    for (let i = 1; i <= 10; i++) {
      localStorage.removeItem(`memory-title-${i}`);
      localStorage.removeItem(`memory-text-${i}`);
      localStorage.removeItem(`photo${i}.jpg`);
      localStorage.removeItem(`default-photo${i}.jpg`);
    }
    localStorage.removeItem('hero-title');
    localStorage.removeItem('hero-subtitle');
    localStorage.removeItem('birthday-message-title');
    localStorage.removeItem('birthday-message-text');
    localStorage.removeItem('birthday-defaults-backup');
    localStorage.removeItem('default-photos');
    
    // Force page reload to show original defaults
    window.location.reload();
  } catch (error) {
    console.error('❌ Error resetting to defaults:', error);
  }
};

// Photo-specific default management functions
export const getPhotoDefaults = () => {
  try {
    const defaultPhotos = JSON.parse(localStorage.getItem('default-photos') || '{}');
    const photoDefaults = {};
    
    for (let i = 1; i <= 10; i++) {
      const photoId = `photo${i}.jpg`;
      const defaultPhoto = localStorage.getItem(`default-${photoId}`);
      if (defaultPhoto && defaultPhotos[photoId]) {
        photoDefaults[photoId] = {
          data: defaultPhoto,
          timestamp: defaultPhotos[photoId].timestamp,
          originalSrc: defaultPhotos[photoId].originalSrc
        };
      }
    }
    
    return photoDefaults;
  } catch (error) {
    console.error('❌ Error getting photo defaults:', error);
    return {};
  }
};

export const clearAllPhotoDefaults = () => {
  try {
    for (let i = 1; i <= 10; i++) {
      const photoId = `photo${i}.jpg`;
      localStorage.removeItem(`default-${photoId}`);
    }
    localStorage.removeItem('default-photos');
    
    console.log('✅ All photo defaults cleared');
    return true;
  } catch (error) {
    console.error('❌ Error clearing photo defaults:', error);
    return false;
  }
};

export const applyPhotoDefaults = () => {
  try {
    const photoDefaults = getPhotoDefaults();
    
    Object.keys(photoDefaults).forEach(photoId => {
      // Don't overwrite if user already has a custom photo
      const existingPhoto = localStorage.getItem(photoId);
      if (!existingPhoto) {
        localStorage.setItem(photoId, photoDefaults[photoId].data);
      }
    });
    
    console.log('✅ Photo defaults applied');
    return true;
  } catch (error) {
    console.error('❌ Error applying photo defaults:', error);
    return false;
  }
};

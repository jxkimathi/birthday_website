// localStorage utility functions with fallback to sessionStorage and memory storage

// In-memory fallback storage
let memoryStorage = {};

// Check if storage is available
const isStorageAvailable = (type) => {
  try {
    const storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return false;
  }
};

// Get the best available storage
const getStorage = () => {
  if (isStorageAvailable('localStorage')) {
    return {
      type: 'localStorage',
      setItem: (key, value) => localStorage.setItem(key, value),
      getItem: (key) => localStorage.getItem(key),
      removeItem: (key) => localStorage.removeItem(key)
    };
  } else if (isStorageAvailable('sessionStorage')) {
    return {
      type: 'sessionStorage',
      setItem: (key, value) => sessionStorage.setItem(key, value),
      getItem: (key) => sessionStorage.getItem(key),
      removeItem: (key) => sessionStorage.removeItem(key)
    };
  } else {
    return {
      type: 'memoryStorage',
      setItem: (key, value) => { memoryStorage[key] = value; },
      getItem: (key) => memoryStorage[key] || null,
      removeItem: (key) => { delete memoryStorage[key]; }
    };
  }
};

export const setLocalStorageItem = (key, value) => {
  try {
    const storage = getStorage();
    storage.setItem(key, value);
    console.log(`✅ Saved to ${storage.type}: ${key} = ${value.substring(0, 50)}${value.length > 50 ? '...' : ''}`);
    return true;
  } catch (error) {
    console.error(`❌ Error saving to storage (${key}):`, error);
    return false;
  }
};

export const getLocalStorageItem = (key, defaultValue = null) => {
  try {
    const storage = getStorage();
    const value = storage.getItem(key);
    if (value && value !== 'null' && value !== 'undefined') {
      console.log(`✅ Loaded from ${storage.type}: ${key} = ${value.substring(0, 50)}${value.length > 50 ? '...' : ''}`);
      return value;
    }
    return defaultValue;
  } catch (error) {
    console.error(`❌ Error loading from storage (${key}):`, error);
    return defaultValue;
  }
};

export const removeLocalStorageItem = (key) => {
  try {
    const storage = getStorage();
    storage.removeItem(key);
    console.log(`🗑️ Removed from ${storage.type}: ${key}`);
    return true;
  } catch (error) {
    console.error(`❌ Error removing from storage (${key}):`, error);
    return false;
  }
};

export const clearAllBirthdayData = () => {
  try {
    // Clear hero section data
    removeLocalStorageItem('hero-title');
    removeLocalStorageItem('hero-subtitle');
    
    // Clear birthday message data
    removeLocalStorageItem('birthday-message-text');
    removeLocalStorageItem('birthday-message-title');
    
    // Clear memory section data (assuming IDs 1-10)
    for (let i = 1; i <= 10; i++) {
      removeLocalStorageItem(`memory-text-${i}`);
      removeLocalStorageItem(`memory-title-${i}`);
    }
    
    console.log('🧹 All birthday website data cleared from localStorage');
    return true;
  } catch (error) {
    console.error('❌ Error clearing birthday data:', error);
    return false;
  }
};

export const getBirthdayDataSummary = () => {
  try {
    const data = {
      heroTitle: getLocalStorageItem('hero-title'),
      heroSubtitle: getLocalStorageItem('hero-subtitle'),
      birthdayMessageTitle: getLocalStorageItem('birthday-message-title'),
      birthdayMessageText: getLocalStorageItem('birthday-message-text'),
      memories: {}
    };
    
    // Get memory data
    for (let i = 1; i <= 10; i++) {
      const title = getLocalStorageItem(`memory-title-${i}`);
      const text = getLocalStorageItem(`memory-text-${i}`);
      if (title || text) {
        data.memories[i] = { title, text };
      }
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error getting birthday data summary:', error);
    return null;
  }
};

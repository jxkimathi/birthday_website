// Enhanced localStorage wrapper that provides backward compatibility
// while using the new enhanced storage system
import { 
  setEnhancedItem, 
  getEnhancedItem, 
  removeEnhancedItem,
  getSyncStatus
} from './enhancedStorage';
import {
  setLocalStorageItem as originalSetLocalStorageItem,
  removeLocalStorageItem as originalRemoveLocalStorageItem,
  clearAllBirthdayData as originalClearAllBirthdayData,
  getBirthdayDataSummary as originalGetBirthdayDataSummary
} from './localStorage';

// Enhanced versions that sync with the server
export const setLocalStorageItem = async (key, value) => {
  try {
    return await setEnhancedItem(key, value);
  } catch (error) {
    console.warn('⚠️ Enhanced storage failed, falling back to localStorage only:', error);
    return originalSetLocalStorageItem(key, value);
  }
};

export const getLocalStorageItem = (key, defaultValue = null) => {
  return getEnhancedItem(key, defaultValue);
};

export const removeLocalStorageItem = async (key) => {
  try {
    return await removeEnhancedItem(key);
  } catch (error) {
    console.warn('⚠️ Enhanced storage failed, falling back to localStorage only:', error);
    return originalRemoveLocalStorageItem(key);
  }
};

export const clearAllBirthdayData = async () => {
  try {
    // Clear hero section data
    await removeEnhancedItem('hero-title');
    await removeEnhancedItem('hero-subtitle');
    
    // Clear birthday message data
    await removeEnhancedItem('birthday-message-text');
    await removeEnhancedItem('birthday-message-title');
    
    // Clear memory section data (assuming IDs 1-10)
    for (let i = 1; i <= 10; i++) {
      await removeEnhancedItem(`memory-text-${i}`);
      await removeEnhancedItem(`memory-title-${i}`);
    }
    
    console.log('🧹 All birthday website data cleared from storage');
    return true;
  } catch (error) {
    console.error('❌ Error clearing birthday data:', error);
    return originalClearAllBirthdayData();
  }
};

export const getBirthdayDataSummary = () => {
  return originalGetBirthdayDataSummary();
};

// New enhanced functions
export const getStorageSyncStatus = () => {
  return getSyncStatus();
};

export const isDataSynced = () => {
  const status = getSyncStatus();
  return status.syncEnabled && !status.hasPendingUpdates;
};

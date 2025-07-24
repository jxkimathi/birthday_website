// Enhanced storage utility that combines localStorage and API for global persistence
import { 
  setLocalStorageItem, 
  getLocalStorageItem, 
  removeLocalStorageItem,
  getBirthdayDataSummary 
} from './localStorage.js';
import { 
  fetchWebsiteData, 
  updateWebsiteData, 
  saveAllWebsiteData,
  convertServerDataToLocalStorage,
  convertLocalStorageToServerData 
} from './apiStorage.js';

// Configuration
const SYNC_ENABLED = process.env.NODE_ENV === 'production'; // Only enable in production
const SYNC_TIMEOUT = 5000; // 5 seconds timeout for API calls

// Enhanced storage that syncs with both localStorage and API
export class EnhancedStorage {
  constructor() {
    this.syncInProgress = false;
    this.pendingUpdates = new Map();
    this.lastSyncTime = null;
  }

  // Load initial data from API and merge with localStorage
  async initializeData() {
    if (!SYNC_ENABLED) {
      console.log('🔄 API sync disabled, using localStorage only');
      return;
    }

    try {
      console.log('🔄 Initializing data from server...');
      const serverData = await this.withTimeout(fetchWebsiteData(), SYNC_TIMEOUT);
      
      if (serverData) {
        // Convert server data to localStorage format and save locally
        const localStorageData = convertServerDataToLocalStorage(serverData);
        Object.entries(localStorageData).forEach(([key, value]) => {
          setLocalStorageItem(key, value);
        });
        
        this.lastSyncTime = new Date().toISOString();
        console.log('✅ Data synchronized from server to localStorage');
      } else {
        console.log('⚠️ Could not fetch from server, using localStorage data');
      }
    } catch (error) {
      console.error('❌ Error initializing data from server:', error);
      console.log('⚠️ Falling back to localStorage only');
    }
  }

  // Set an item with both localStorage and API sync
  async setItem(key, value) {
    // Always save to localStorage first for immediate update
    const localSuccess = setLocalStorageItem(key, value);
    
    if (!SYNC_ENABLED || !localSuccess) {
      return localSuccess;
    }

    // Add to pending updates
    this.pendingUpdates.set(key, value);

    // Attempt to sync with API (non-blocking)
    this.syncToAPI(key, value).catch(error => {
      console.warn(`⚠️ Failed to sync ${key} to server:`, error);
    });

    return localSuccess;
  }

  // Get an item (always from localStorage for speed)
  getItem(key, defaultValue = null) {
    return getLocalStorageItem(key, defaultValue);
  }

  // Remove an item
  async removeItem(key) {
    const localSuccess = removeLocalStorageItem(key);
    
    if (SYNC_ENABLED && localSuccess) {
      this.syncToAPI(key, '').catch(error => {
        console.warn(`⚠️ Failed to remove ${key} from server:`, error);
      });
    }

    return localSuccess;
  }

  // Sync a single item to API
  async syncToAPI(key, value) {
    if (this.syncInProgress) {
      return;
    }

    try {
      this.syncInProgress = true;
      await this.withTimeout(updateWebsiteData(key, value), SYNC_TIMEOUT);
      this.pendingUpdates.delete(key);
      this.lastSyncTime = new Date().toISOString();
    } catch (error) {
      console.warn(`⚠️ API sync failed for ${key}:`, error);
      throw error;
    } finally {
      this.syncInProgress = false;
    }
  }

  // Sync all pending updates to API
  async syncAllPending() {
    if (!SYNC_ENABLED || this.pendingUpdates.size === 0) {
      return true;
    }

    try {
      console.log('🔄 Syncing all pending updates to server...');
      const allData = getBirthdayDataSummary();
      const serverData = convertLocalStorageToServerData(allData);
      
      await this.withTimeout(saveAllWebsiteData(serverData), SYNC_TIMEOUT);
      this.pendingUpdates.clear();
      this.lastSyncTime = new Date().toISOString();
      console.log('✅ All data synced to server');
      return true;
    } catch (error) {
      console.error('❌ Failed to sync all data to server:', error);
      return false;
    }
  }

  // Force a full sync from server to localStorage
  async forceSync() {
    if (!SYNC_ENABLED) {
      return false;
    }

    try {
      console.log('🔄 Force syncing from server...');
      await this.initializeData();
      return true;
    } catch (error) {
      console.error('❌ Force sync failed:', error);
      return false;
    }
  }

  // Get sync status
  getSyncStatus() {
    return {
      syncEnabled: SYNC_ENABLED,
      syncInProgress: this.syncInProgress,
      pendingUpdates: this.pendingUpdates.size,
      lastSyncTime: this.lastSyncTime,
      hasPendingUpdates: this.pendingUpdates.size > 0
    };
  }

  // Utility: Add timeout to promises
  withTimeout(promise, timeoutMs) {
    return Promise.race([
      promise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
      )
    ]);
  }
}

// Create a singleton instance
export const enhancedStorage = new EnhancedStorage();

// Export convenient wrapper functions
export const setEnhancedItem = (key, value) => enhancedStorage.setItem(key, value);
export const getEnhancedItem = (key, defaultValue) => enhancedStorage.getItem(key, defaultValue);
export const removeEnhancedItem = (key) => enhancedStorage.removeItem(key);
export const initializeEnhancedStorage = () => enhancedStorage.initializeData();
export const syncAllPending = () => enhancedStorage.syncAllPending();
export const forceSync = () => enhancedStorage.forceSync();
export const getSyncStatus = () => enhancedStorage.getSyncStatus();

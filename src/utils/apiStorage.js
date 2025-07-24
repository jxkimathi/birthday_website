// API utility functions for communicating with the backend
const API_BASE_URL = '/api';
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

// Fetch all website data from the server
export const fetchWebsiteData = async () => {
  if (IS_DEVELOPMENT) {
    console.log('🔧 Development mode: Skipping API call');
    return null;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/data`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('✅ Fetched website data from server');
    return data;
  } catch (error) {
    console.error('❌ Error fetching website data:', error);
    return null;
  }
};

// Update a specific field on the server
export const updateWebsiteData = async (key, value) => {
  if (IS_DEVELOPMENT) {
    console.log('🔧 Development mode: Skipping API call for', key);
    return null;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key, value }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    if (result.success) {
      console.log(`✅ Updated ${key} on server`);
      return result.data;
    } else {
      throw new Error(result.error || 'Update failed');
    }
  } catch (error) {
    console.error(`❌ Error updating ${key}:`, error);
    return null;
  }
};

// Save all website data to the server
export const saveAllWebsiteData = async (data) => {
  if (IS_DEVELOPMENT) {
    console.log('🔧 Development mode: Skipping API call for bulk save');
    return null;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/data`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    if (result.success) {
      console.log('✅ Saved all website data to server');
      return result.data;
    } else {
      throw new Error(result.error || 'Save failed');
    }
  } catch (error) {
    console.error('❌ Error saving all website data:', error);
    return null;
  }
};

// Convert server data format to localStorage format for backward compatibility
export const convertServerDataToLocalStorage = (serverData) => {
  const localStorageData = {};
  
  // Hero section
  if (serverData.heroTitle) localStorageData['hero-title'] = serverData.heroTitle;
  if (serverData.heroSubtitle) localStorageData['hero-subtitle'] = serverData.heroSubtitle;
  
  // Birthday message
  if (serverData.birthdayMessageTitle) localStorageData['birthday-message-title'] = serverData.birthdayMessageTitle;
  if (serverData.birthdayMessageText) localStorageData['birthday-message-text'] = serverData.birthdayMessageText;
  
  // Memories
  if (serverData.memories) {
    Object.entries(serverData.memories).forEach(([id, memory]) => {
      if (memory.title) localStorageData[`memory-title-${id}`] = memory.title;
      if (memory.text) localStorageData[`memory-text-${id}`] = memory.text;
    });
  }
  
  return localStorageData;
};

// Convert localStorage format to server data format
export const convertLocalStorageToServerData = (localStorageItems) => {
  const serverData = {
    memories: {},
  };
  
  Object.entries(localStorageItems).forEach(([key, value]) => {
    if (key === 'hero-title') serverData.heroTitle = value;
    else if (key === 'hero-subtitle') serverData.heroSubtitle = value;
    else if (key === 'birthday-message-title') serverData.birthdayMessageTitle = value;
    else if (key === 'birthday-message-text') serverData.birthdayMessageText = value;
    else if (key.startsWith('memory-')) {
      const parts = key.split('-');
      if (parts.length === 3) {
        const [, type, id] = parts;
        if (!serverData.memories[id]) serverData.memories[id] = {};
        serverData.memories[id][type] = value;
      }
    }
  });
  
  return serverData;
};

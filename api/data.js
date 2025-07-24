// Vercel serverless function to manage website data
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'website-data.json');

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.dirname(dataFilePath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Initialize default data structure
const defaultData = {
  heroTitle: "Happy Birthday!",
  heroSubtitle: "Celebrating another amazing year of your life",
  birthdayMessageTitle: "A Special Message Just for You",
  birthdayMessageText: "Wishing you a day filled with happiness and a year filled with joy. Happy birthday!",
  memories: {
    1: { title: "Childhood Memories", text: "Remember when we were kids and every birthday felt like the most magical day of the year?" },
    2: { title: "Adventures Together", text: "From spontaneous road trips to quiet coffee conversations, we've shared countless adventures." },
    3: { title: "Special Moments", text: "Life is made up of small moments that become big memories." },
    4: { title: "Achievements & Milestones", text: "Your journey has been marked by incredible achievements and important milestones." },
    5: { title: "Looking Forward", text: "As we celebrate another year of your amazing life, we also look forward to all the wonderful things." },
    6: { title: "Family & Friends", text: "The people who surround you with love and support make your life truly rich." },
    7: { title: "Creative Pursuits", text: "Your creative spirit has always been one of your most admirable qualities." },
    8: { title: "Challenges Overcome", text: "Life has presented its share of challenges, and you've faced each one with courage." },
    9: { title: "Simple Joys", text: "Sometimes the most precious memories come from life's simplest moments." },
    10: { title: "Dreams & Aspirations", text: "Your dreams and aspirations continue to evolve and inspire not only yourself." }
  },
  lastUpdated: new Date().toISOString()
};

// Read data from file
function readData() {
  try {
    ensureDataDirectory();
    if (!fs.existsSync(dataFilePath)) {
      writeData(defaultData);
      return defaultData;
    }
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return defaultData;
  }
}

// Write data to file
function writeData(data) {
  try {
    ensureDataDirectory();
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing data:', error);
    return false;
  }
}

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // Get all data
      const data = readData();
      res.status(200).json(data);
    } else if (req.method === 'POST') {
      // Update specific field
      const { key, value } = req.body;
      const data = readData();
      
      // Handle nested keys (like memory-title-1)
      if (key.startsWith('memory-')) {
        const parts = key.split('-');
        if (parts.length === 3) {
          const [, type, id] = parts;
          if (!data.memories[id]) {
            data.memories[id] = {};
          }
          data.memories[id][type] = value;
        }
      } else if (key.startsWith('hero-')) {
        const field = key.replace('hero-', '');
        if (field === 'title') data.heroTitle = value;
        if (field === 'subtitle') data.heroSubtitle = value;
      } else if (key.startsWith('birthday-message-')) {
        const field = key.replace('birthday-message-', '');
        if (field === 'title') data.birthdayMessageTitle = value;
        if (field === 'text') data.birthdayMessageText = value;
      }
      
      const success = writeData(data);
      if (success) {
        res.status(200).json({ success: true, data });
      } else {
        res.status(500).json({ success: false, error: 'Failed to save data' });
      }
    } else if (req.method === 'PUT') {
      // Replace all data
      const newData = req.body;
      const success = writeData(newData);
      if (success) {
        res.status(200).json({ success: true, data: newData });
      } else {
        res.status(500).json({ success: false, error: 'Failed to save data' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

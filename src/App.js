import React, { useEffect, useState } from 'react';
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

  const memoryData = [
    {
        "id": 1,
        "title": "Who’s that cutie?",
        "text": "Getting to know you has been amazing because I’ve gotten to see what makes you the person that you are. I’ve gotten to see the things that make you happy and the dreams that you have. Even if I didn’t know you back then I’ve gotten to see that child like wonder that you have and in a a way I’ve gotten so see the inner child in you.",
        "photo": "/public/photos/photo_1.jpg",
        "reverse": false
    },
    {
        "id": 2,
        "title": "Adventures Together",
        "text": "This was the second time we ever met and our first little date night. Nothing crazy, just spontaneity and vibes. I took you to my favorite spot in the city and it became our favorite spot. This night is so important to me because it holds so many firsts for us. Our first I love you, Our first drink shared together, our first handshake and our first kiss.",
        "photo": "/public/photos/photo_2.jpg",
        "reverse": true
    },
    {
        "id": 3,
        "title": "Special Moments",
        "text": "Life is made up of small moments that become big memories. Those quiet times when we've shared our deepest thoughts, the celebrations of your achievements, and the comfort we've provided each other during challenging times. These special moments have woven the beautiful tapestry of our relationship and created bonds that time cannot break.",
        "photo": "/public/photos/photo_3.jpg",
        "reverse": false
    },
    {
        "id": 4,
        "title": "Achievements",
        "text": "Your journey has been marked by incredible achievements that deserve to be celebrated. From personal victories to professional successes, you've shown determination, courage, and grace in everything you do. Each accomplishment is a testament to your character and a reason for all of us who love you to feel proud and inspired",
        "photo": "/public/photos/photo_4.jpg",
        "reverse": true
    },
    {
        "id": 5,
        "title": "Something New",
        "text": "As we celebrate another year of your amazing life, we also look forward to all the wonderful things that await you. New experiences, fresh adventures, deeper connections, and dreams yet to be fulfilled. Your birthday isn't just about celebrating the past - it's about embracing the bright future that lies ahead, filled with endless possibilities and joy.",
        "photo": "/public/photos/photo_5.jpg",
        "reverse": false
    },
    {
        "id": 6,
        "title": "Milestones",
        "text": "This day represents my favorite milestone with you because I got to meet your mom. It felt like finally being part of your world and solidified how much I mean to you. You make me feel at home always and I cannot wait to be part of your life. To many more milestones together both little and big💗",
        "photo": "/public/photos/photo_6.jpg",
        "reverse": true
    },
    {
        "id": 7,
        "title": "A Few Stumbles",
        "text": "At the face of adversity you always show real resilience. I admire how you handle conflict or disappointment. I admire your vulnerability when things don’t go your way and your understanding nature when faced with disappointment. I love how you always fight to get through all the challenges you face. I know you’ll always come out on top of whatever troubles you!",
        "photo": "/public/photos/photo_7.jpg",
        "reverse": false
    },
    {
        "id": 8,
        "title": "The Joy of You",
        "text": "These past four months with you have been my happiest day. You’ve been my source of joy and solace. You’ve held my hand through the toughest times ever and I love you for that. You are my joy, my heart and my world💗",
        "photo": "/public/photos/photo_8.jpg",
        "reverse": true
    },
    {
        "id": 9,
        "title": "Crazy Nights",
        "text": "To many more nights where we get to go out and just have a time. The world feels complete when I’m with you and I cherish every moment I get to spend with you and I can’t wait to continue experiencing life with you",
        "photo": "/public/photos/photo_9.jpg",
        "reverse": false
    },
    {
        "id": 10,
        "title": "Looking Forward",
        "text": "The man I see and get to love has shown me so much that he is capable of. As you grow older I know you will work harder to achieve your dreams. Never lose sight of who you are. You’re lucky to know that you want to help people. You have so much to offer this world. There’s so much space for you to take up in this world and I will be there with you!💗",
        "photo": "/public/photos/photo_10.jpg",
        "reverse": true
    }
];

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

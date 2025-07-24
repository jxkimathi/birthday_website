import React, { useEffect, useState } from 'react';
import './App.css';
import HeroSection from './components/HeroSection';
import MemorySection from './components/MemorySection';
import BirthdayMessage from './components/BirthdayMessage';
import FloatingEmojis from './components/FloatingEmojis';
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

  return (
    <div className="App">
      <FloatingEmojis />
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

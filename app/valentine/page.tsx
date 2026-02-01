"use client";
import { useState, useEffect, useRef } from "react";
import { auth, db } from "@/firebase"; 
import { doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { Great_Vibes } from "next/font/google";

// Romantic Font
const greatVibes = Great_Vibes({ 
  subsets: ["latin"], 
  weight: "400" 
});

export default function Valentine() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [noCount, setNoCount] = useState(0);
  const [yesClicked, setYesClicked] = useState(false);
  const [yesButtonSize, setYesButtonSize] = useState(1);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  
  // Audio Refs
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  
  // State for the "No" button position
  const [noPosition, setNoPosition] = useState({ top: "auto", left: "auto", position: "static" });

  useEffect(() => {
    // Initialize Audio
    bgMusicRef.current = new Audio("https://www.bensound.com/bensound-music/bensound-love.mp3"); // Royalty free romantic music
    bgMusicRef.current.loop = true;
    bgMusicRef.current.volume = 0.4;

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/");
      } else {
        setUser(currentUser);
      }
    });
    
    // Cleanup audio on unmount
    return () => {
      unsubscribe();
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
      }
    };
  }, [router]);

  // Function to toggle music
  const toggleMusic = () => {
    if (bgMusicRef.current) {
      if (isMusicPlaying) {
        bgMusicRef.current.pause();
      } else {
        bgMusicRef.current.play().catch(e => console.log("Playback failed:", e));
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  // Sound Effects
  const playSwoosh = () => {
    const audio = new Audio("https://www.soundjay.com/button/sounds/button-10.mp3"); // Simple swoosh/click
    audio.volume = 0.5;
    audio.play().catch(e => console.log(e));
  };

  const playSuccess = () => {
    const audio = new Audio("https://www.soundjay.com/human/sounds/applause-01.mp3"); // Cheering
    audio.volume = 0.6;
    audio.play().catch(e => console.log(e));
  };

  const moveButton = () => {
    playSwoosh(); // Play sound when moving
    setNoCount((prev) => prev + 1);
    setYesButtonSize((prev) => prev + 0.15); 

    const maxWidth = window.innerWidth - 150;
    const maxHeight = window.innerHeight - 100;

    const randomX = Math.max(10, Math.random() * maxWidth);
    const randomY = Math.max(10, Math.random() * maxHeight);

    setNoPosition({
      top: `${randomY}px`,
      left: `${randomX}px`,
      position: "fixed" 
    });
  };

  const handleYesClick = async () => {
    if (!user) return;
    
    playSuccess(); // Play success sound

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff69b4', '#ff0000', '#ffffff']
    });

    setYesClicked(true);

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        answer: "Yes",
        noAttempts: noCount,
        respondedAt: new Date()
      });
    } catch (error) {
      console.error("Error saving response:", error);
    }
  };

  if (yesClicked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-200 via-red-100 to-pink-200 text-center p-4">
        <h1 className={`${greatVibes.className} text-6xl md:text-8xl text-red-600 mb-4 animate-bounce`}>
          Yay! Thank you! ❤️
        </h1>
        <img 
          src="https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif" 
          alt="Happy Bears"
          className="rounded-xl shadow-2xl border-4 border-white w-64 md:w-96 my-6"
        />
        <p className="text-2xl text-pink-800 font-serif">
          I knew you would say yes! (Eventually 😉)
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-t from-pink-200 via-pink-100 to-white overflow-hidden">
      
      {/* Music Toggle Button (Top Right) */}
      <button 
        onClick={toggleMusic}
        className="absolute top-4 right-4 z-50 bg-white/50 backdrop-blur-sm p-3 rounded-full shadow-md hover:bg-white transition"
      >
        {isMusicPlaying ? "🔊" : "🔇"}
      </button>

      {/* Background Floating Hearts */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-10 left-10 text-4xl animate-pulse">❤️</div>
        <div className="absolute bottom-20 right-20 text-6xl animate-bounce">💖</div>
        <div className="absolute top-1/2 left-5 text-3xl animate-ping">💕</div>
      </div>

      <div className="z-10 text-center px-4">
        <div className="mb-6 flex justify-center">
          <img 
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnJscWQ1YnNscGZ4bHExaXJ1bTRlZWF2dzc5bXJ6cWh0bGd0anA2ZCZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/cLS1cfxvGOPVpf9g3y/giphy.gif" 
            alt="Cute Valentine Bear"
            className="w-56 h-56 object-contain drop-shadow-xl"
          />
        </div>

        <h1 className={`${greatVibes.className} text-5xl md:text-7xl text-red-500 mb-12 drop-shadow-sm`}>
          Will you be my Valentine? 🌹
        </h1>

        <div className="flex flex-wrap gap-6 items-center justify-center">
          {/* YES Button */}
          <button
            onClick={handleYesClick}
            style={{ transform: `scale(${yesButtonSize})` }}
            className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-3 px-10 rounded-full text-xl shadow-xl transition-all duration-200 ease-in-out z-20"
          >
            Yes 💖
          </button>

          {/* NO Button */}
          <button
            onMouseEnter={moveButton}
            onClick={moveButton}
            style={{
              position: noPosition.position as any,
              top: noPosition.top,
              left: noPosition.left,
              transition: "top 0.2s ease, left 0.2s ease",
              zIndex: 50 
            }}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-8 rounded-full text-xl shadow-md"
          >
            No 😢
          </button>
        </div>
      </div>
    </div>
  );
}
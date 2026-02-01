// app/valentine/page.tsx
"use client";
import { useState, useEffect } from "react";
import { auth, db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Valentine() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [noCount, setNoCount] = useState(0);
  const [yesClicked, setYesClicked] = useState(false);
  
  // State for the "No" button position
  const [noPosition, setNoPosition] = useState({ top: "auto", left: "auto", position: "static" });

  useEffect(() => {
    // Check if user is logged in
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/"); // Redirect to login if not authenticated
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Logic to move the "No" button
  const moveButton = () => {
    // Increment local counter for tracking
    setNoCount((prev) => prev + 1);

    // Get random coordinates within the window
    const x = Math.random() * (window.innerWidth - 100);
    const y = Math.random() * (window.innerHeight - 50);

    setNoPosition({
      top: `${y}px`,
      left: `${x}px`,
      position: "absolute" // Switch to absolute to make it jump anywhere
    });
  };

  const handleYesClick = async () => {
    if (!user) return;
    
    setYesClicked(true);

    // Save "Yes" and the number of "No" attempts to database
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-pink-100 text-center p-4">
        <h1 className="text-4xl md:text-6xl font-bold text-red-600 mb-4">Yay! Thank you! ❤️</h1>
        <p className="text-xl text-gray-700">I knew you would say yes! (Eventually 😉)</p>
        <div className="mt-8 text-6xl">😘</div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-pink-50 overflow-hidden">
      {/* Image Area */}
      <div className="mb-8">
        <img 
          src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnJscWQ1YnNscGZ4bHExaXJ1bTRlZWF2dzc5bXJ6cWh0bGd0anA2ZCZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/cLS1cfxvGOPVpf9g3y/giphy.gif" 
          alt="Cute Valentine Bear"
          className="w-48 h-48 object-contain"
        />
      </div>

      <h1 className="text-3xl md:text-5xl font-bold text-pink-600 mb-12 text-center px-4">
        Will you be my Valentine? 🌹
      </h1>

      <div className="flex gap-8 items-center justify-center">
        {/* YES Button - Stable */}
        <button
          onClick={handleYesClick}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-xl shadow-lg transform transition hover:scale-110"
        >
          Yes
        </button>

        {/* NO Button - Runs away */}
        <button
          onMouseEnter={moveButton} // Moves on desktop hover
          onClick={moveButton}      // Moves on mobile tap
          style={{
            position: noPosition.position as any,
            top: noPosition.top,
            left: noPosition.left,
            transition: "all 0.2s ease" // Smooth animation
          }}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full text-xl shadow-lg"
        >
          No
        </button>
      </div>
    </div>
  );
}
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInAnonymously, signOut } from "firebase/auth"; // signOut import kiya
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";

export default function Login() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Page load hote hi purane user ko logout kar do
  useEffect(() => {
    signOut(auth).catch((error) => {
      console.error("Sign out error:", error);
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      // 1. Ab har baar fresh naya user banega
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;

      // 2. Nayi ID ke sath data save hoga
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        createdAt: new Date(),
        answer: null,
        noAttempts: 0 
      });

      router.push("/valentine");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-pink-600 mb-6">Welcome</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 text-lg text-black"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-pink-500 text-white font-bold py-3 rounded-lg hover:bg-pink-600 transition disabled:opacity-50"
          >
            {loading ? "Entering..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
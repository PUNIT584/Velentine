// app/admin/page.tsx
"use client";
import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

interface UserData {
  id: string;
  name: string;
  answer: string;
  noAttempts: number;
}

export default function AdminPanel() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const usersList: UserData[] = [];
        
        querySnapshot.forEach((doc) => {
          usersList.push({ id: doc.id, ...doc.data() } as UserData);
        });

        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-10">Loading Admin Panel...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">💘 Valentine Admin Dashboard</h1>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-pink-500 text-white">
              <th className="p-4">Name</th>
              <th className="p-4">Answer</th>
              <th className="p-4">"No" Attempts (Tries)</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50 text-black">
                <td className="p-4 font-medium">{user.name}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-sm ${user.answer === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                    {user.answer || "Pending..."}
                  </span>
                </td>
                <td className="p-4 font-bold text-red-500">{user.noAttempts || 0}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">No responses yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
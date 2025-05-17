'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SelectRolePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = async (role: "organiser" | "participant") => {
    setLoading(true);

    const res = await fetch("/api/set-role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    });

    if (res.ok) {
      // Redirect based on role
      if (role === "organiser") {
        router.push("/organiser");
      } else {
        router.push("/participant");
      }
    } else {
      alert("Something went wrong while saving your role.");
      setLoading(false);
    }
  };

  if (!session) return <p>Loading session...</p>;

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Select your role</h1>
      <div className="flex gap-4">
        <button
          onClick={() => handleRoleSelect("organiser")}
          className="bg-green-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Organiser
        </button>
        <button
          onClick={() => handleRoleSelect("participant")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Participant
        </button>
      </div>
    </main>
  );
}



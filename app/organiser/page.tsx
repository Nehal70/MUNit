'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function OrganiserPage() {
    const { data: session, status} = useSession();
    const router = useRouter();

    if (status === "loading") return <p>Loading...</p>;
    if (!session) {
        router.push("/signin");
        return null;
    }

    const name = session.user?.name?.split(" ")[0] ?? "Organiser";

      return (
        <main className="p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                <h1 className="text-4xl font-light">hello,</h1>
                <h2 className="text-5xl font-bold">{name}</h2>
                </div>

                <div className="flex items-center gap-6">
                <button
                    onClick={() => router.push("/register-conference")}
                    className="bg-black text-white rounded-full w-14 h-14 text-3xl flex items-center justify-center hover:scale-105 transition"
                    title="Organise a New Conference"
                >
                    +
                </button>
                <button
                    onClick={() => router.push("/organiser-profile")}
                    title="View Profile"
                >
                    <span className="text-2xl">👤</span>
                </button>
                </div>
            </div>

            {/* Past Conferences */}
            <h3 className="text-xl font-semibold mb-4">Past Conferences</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {/* Placeholder cards */}
                {[1, 2, 3].map((_, idx) => (
                <div
                    key={idx}
                    className="bg-gray-200 h-40 rounded-lg flex items-center justify-center text-gray-500"
                >
                    Conference {idx + 1}
                </div>
                ))}
            </div>
        </main>
        );
}
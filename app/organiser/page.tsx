'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from 'next-auth/react';

export default function OrganiserPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [conferences, setConferences] = useState([]);

    useEffect(() => {
        if (status !== "loading" && !session) {
            router.push("/signin");
        }
    }, [session, status, router]);

    useEffect(() => {
        const fetchConferences = async () => {
            if (session?.user?.email) {
                const res = await fetch(`/api/conferences?organiserEmail=${session.user.email}`);
                const data = await res.json();
                setConferences(data);
            }
        };
        fetchConferences();
    }, [session]);

    if (status === "loading") return <p>Loading...</p>;
    if (!session) return null;

    const name = session.user?.name?.split(" ")[0] ?? "Organiser";
    const email = session.user?.email ?? "unknown@email.com";

    console.log("Current session:", session);

    return (
        <main className="p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-light">hello,</h1>
                    <h2 className="text-5xl font-bold">{email}</h2>
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
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        title="Logout"
                        className="text-2xl"
                    >
                        🚪
                    </button>
                </div>
            </div>

            {conferences.map((conf: any) => (
                <div key={conf.id} className="mb-4">
                    <h3 className="text-xl">{conf.name}</h3>
                    <a href={`/conferences/${conf.id}`} className="text-blue-600 underline">
                        View Conference Page
                    </a>
                </div>
            ))}
        </main>
    );
}



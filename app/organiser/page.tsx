'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrganiserPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [conferences, setConferences] = useState([]);

    // 🔁 Redirect to signin only after component mounts
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
    if (!session) return null; // 🔒 prevents rendering until redirect happens

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


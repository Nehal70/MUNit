'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CommitteePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams(); // { id: conferenceId }
  const [loading, setLoading] = useState(true);
  const [accessAllowed, setAccessAllowed] = useState(false);
  const [participantData, setParticipantData] = useState<any>(null);

  const conferenceId = params.id as string;

  useEffect(() => {
    const verifyAccess = async () => {
      if (!session?.user?.email) return;

      try {
        const res = await fetch(`/api/participants/byUser?conferenceId=${conferenceId}&email=${session.user.email}`);
        if (!res.ok) throw new Error('Access Denied');
        const participant = await res.json();

        const routeCommittee = window.location.pathname.split('/').pop(); // Get last segment
        if (participant.committee === routeCommittee) {
          setAccessAllowed(true);
          setParticipantData(participant);
        }
      } catch (err) {
        console.error(err);
        setAccessAllowed(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAccess();
  }, [session?.user?.email, conferenceId]);

  if (loading || status === 'loading') return <p className="p-8">Loading...</p>;
  if (!accessAllowed) return <p className="p-8 text-red-600">Access Denied. You are not assigned to this committee.</p>;

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to the {participantData.committee} Committee</h1>
      {/* Committee UI will go here */}
    </main>
  );
}

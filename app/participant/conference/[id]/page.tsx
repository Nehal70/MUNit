'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';

export default function ParticipantConferencePage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();

  const [conference, setConference] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConference = async () => {
      if (!session?.user?.email) return;

      const res = await fetch(`/api/is-registered?conferenceId=${params.id}&email=${session.user.email}`);
      const data = await res.json();

      if (!data.isRegistered) {
        router.push('/unauthorized');
        return;
      }

      const confRes = await fetch(`/api/conferences/${params.id}`, { cache: 'no-store' });
      if (!confRes.ok) return router.push('/404');

      const confData = await confRes.json();
      setConference(confData);
      setLoading(false);
    };

    fetchConference();
  }, [session, params.id, router]);

  if (loading || status === 'loading') return <p className="p-8">Loading...</p>;
  if (!conference) return null;

  return (
    <main className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{conference.name}</h1>

        <div className="space-y-2 text-gray-800 mb-6">
          <p><strong>Venue:</strong> {conference.venue}</p>
          <p><strong>Dates:</strong> {new Date(conference.startDate).toLocaleDateString()} - {new Date(conference.endDate).toLocaleDateString()}</p>
          <p><strong>Fee:</strong> ₹{conference.participationFee.toFixed(2)}</p>
          <p><strong>Contact:</strong> {conference.contactDetails}</p>
        </div>

        <div className="mt-8 space-y-6">
          {/* Announcements */}
          <div className="bg-yellow-100 border border-yellow-300 p-4 rounded">
            <h2 className="font-bold text-lg mb-2">Announcements</h2>
            {conference.announcements?.length > 0 ? (
              <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                {conference.announcements.map((ann: string, idx: number) => (
                  <li key={idx}>{ann}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">No announcements yet.</p>
            )}
          </div>

          {/* Committees */}
          <div>
            <h2 className="font-bold text-lg mb-2">Committees</h2>
            <div className="flex flex-wrap gap-2">
              {conference.committees.map((committee: string, index: number) => (
                <button
                  key={index}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  onClick={() => router.push(`/participant/conference/${params.id}/committee/${committee}`)}
                >
                  {committee}
                </button>
              ))}
            </div>
          </div>

          {/* Policy */}
          <div className="bg-gray-100 border border-gray-300 p-4 rounded">
            <h2 className="font-bold text-lg mb-2">Conference Policy</h2>
            <p className="text-sm text-gray-800 whitespace-pre-line">
              {conference.policyText || 'No policy uploaded yet.'}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}


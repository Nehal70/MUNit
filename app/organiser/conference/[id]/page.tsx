'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { use } from 'react'; // Import React.use

export default function OrganiserDashboard({ params }: { params: { id: string } }) {
  // Unwrap the params object using React.use()
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  
  const { data: session, status } = useSession();
  const router = useRouter();
  const [conference, setConference] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigned, setAssigned] = useState<Record<string, Set<string>>>({});
  const [localAssignments, setLocalAssignments] = useState<Record<string, { committee: string; portfolio: string }>>({});
  const [submittedRows, setSubmittedRows] = useState<Set<string>>(new Set());
  const [conflictRows, setConflictRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (status === 'loading') return;

    const fetchData = async () => {
      // Use the unwrapped id instead of params.id
      const res = await fetch(`/api/conferences/${id}`);
      if (!res.ok) return router.push('/404');
      const conf = await res.json();

      if (conf.organiserEmail !== session?.user?.email) {
        router.push('/unauthorized');
        return;
      }

      setConference(conf);

      // Use the unwrapped id here as well
      const pRes = await fetch(`/api/conferences/${id}/participants`);
      const pData = await pRes.json();
      setParticipants(pData);

      const newAssigned: Record<string, Set<string>> = {};
      pData.forEach((p: any) => {
        if (p.committee && p.portfolio) {
          if (!newAssigned[p.committee]) newAssigned[p.committee] = new Set();
          newAssigned[p.committee].add(p.portfolio);
        }
      });
      setAssigned(newAssigned);

      setLoading(false);
    };

    fetchData();
  }, [id, session, status, router]); // Replace params.id with id in dependencies

  const handleAssign = (participantId: string, committee: string, portfolio: string) => {
    setLocalAssignments((prev) => ({
      ...prev,
      [participantId]: { committee, portfolio },
    }));
  };

  const handleCommitteeChange = (participantId: string, committee: string) => {
    handleAssign(participantId, committee, '');
  };

  const handleSubmitAllotments = async () => {
    const tempAssignments: Record<string, string[]> = {};
    const conflicts: Set<string> = new Set();

    for (const [pid, { committee, portfolio }] of Object.entries(localAssignments)) {
      if (!committee || !portfolio) continue;
      if (!tempAssignments[committee]) tempAssignments[committee] = [];
      if (tempAssignments[committee].includes(portfolio)) {
        conflicts.add(pid);
      } else {
        tempAssignments[committee].push(portfolio);
      }
    }

    setConflictRows(conflicts);

    if (conflicts.size > 0) {
      alert('Duplicate portfolio detected. Fix conflicts before submitting.');
      return;
    }

    for (const p of participants) {
      const a = localAssignments[p._id];
      if (!a || !a.committee || !a.portfolio) continue;

      // Use the unwrapped id here
      const res = await fetch(`/api/conferences/${id}/participants/${p._id}/allot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(a),
      });

      if (res.ok) {
        setAssigned((prev) => {
          const newSet = new Set(prev[a.committee] || []);
          newSet.add(a.portfolio);
          return { ...prev, [a.committee]: newSet };
        });
        setSubmittedRows((prev) => new Set(prev).add(p._id));
      }
    }

    alert('Allotments submitted!');
  };

  if (status === 'loading' || loading) return <p className="p-8">Loading...</p>;

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Organiser Dashboard: {conference.name}</h1>
      <p className="text-lg mb-4 text-gray-700">
        Here you can edit your conference and assign committees/portfolios to participants.
      </p>

      {/* Conference Edit Form */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          // Use the unwrapped id here
          const res = await fetch(`/api/conferences/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(conference),
          });
          alert(res.ok ? 'Conference updated!' : 'Failed to update conference.');
        }}
        className="bg-white p-6 rounded-lg shadow-md mb-10 space-y-4"
      >
        <h2 className="text-2xl font-semibold mb-4">Edit Conference Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Conference Name" value={conference.name} onChange={(e) => setConference({ ...conference, name: e.target.value })} className="p-2 border rounded" required />
          <input type="text" placeholder="Venue" value={conference.venue} onChange={(e) => setConference({ ...conference, venue: e.target.value })} className="p-2 border rounded" required />
          <input type="date" value={conference.startDate?.slice(0, 10)} onChange={(e) => setConference({ ...conference, startDate: e.target.value })} className="p-2 border rounded" required />
          <input type="date" value={conference.endDate?.slice(0, 10)} onChange={(e) => setConference({ ...conference, endDate: e.target.value })} className="p-2 border rounded" required />
          <input type="number" placeholder="Participation Fee (₹)" value={conference.participationFee} onChange={(e) => setConference({ ...conference, participationFee: parseFloat(e.target.value) })} className="p-2 border rounded" required />
          <input type="text" placeholder="Contact Details" value={conference.contactDetails} onChange={(e) => setConference({ ...conference, contactDetails: e.target.value })} className="p-2 border rounded" required />
        </div>

        {/* Extended Fields */}
        <textarea
          placeholder="Payment Details"
          value={conference.paymentDetails}
          onChange={(e) => setConference({ ...conference, paymentDetails: e.target.value })}
          className="p-2 border rounded w-full"
          rows={2}
        />

        <input
          type="file"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const arrayBuffer = await file.arrayBuffer();
              setConference({
                ...conference,
                logo: Array.from(new Uint8Array(arrayBuffer)),
              });
            }
          }}
          className="p-2 border rounded"
        />

        <textarea
          placeholder="Committees (comma-separated)"
          value={conference.committees?.join(', ') || ''}
          onChange={(e) =>
            setConference({ ...conference, committees: e.target.value.split(',').map((c) => c.trim()) })
          }
          className="p-2 border rounded w-full"
          rows={2}
        />

        <textarea
          placeholder="Agendas (comma-separated)"
          value={conference.agendas?.join(', ') || ''}
          onChange={(e) =>
            setConference({ ...conference, agendas: e.target.value.split(',').map((a) => a.trim()) })
          }
          className="p-2 border rounded w-full"
          rows={2}
        />

        <textarea
          placeholder="Committee Matrix (JSON)"
          value={JSON.stringify(conference.committeeMatrix || {}, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              setConference({ ...conference, committeeMatrix: parsed });
            } catch {
              // Optional: show JSON error
            }
          }}
          className="p-2 border rounded w-full font-mono"
          rows={6}
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Save Changes
        </button>
      </form>

      {/* Participants Table */}
      <h2 className="text-2xl font-semibold mb-4">Participant Allotment</h2>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Committee</th>
              <th className="border px-4 py-2">Portfolio</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((p, index) => {
              const current = localAssignments[p._id] || {
                committee: p.committee || '',
                portfolio: p.portfolio || '',
              };
                const portfoliosArray = Array.isArray(conference.committeeMatrix?.[current.committee]) 
                ? conference.committeeMatrix[current.committee] 
                : [];
                const availablePortfolios = portfoliosArray;


              const rowStyle = submittedRows.has(p._id)
                ? 'bg-green-100'
                : conflictRows.has(p._id)
                ? 'bg-red-100'
                : '';

              // Ensure we have a valid and unique key for each row
              const rowKey = p._id ? `participant-${p._id}` : `participant-${p.email || index}`;
              
              return (
                <tr key={rowKey} className={rowStyle}>
                  <td className="border px-4 py-2">{p.name}</td>
                  <td className="border px-4 py-2">{p.email}</td>
                  <td className="border px-4 py-2">
                    <select
                      className="p-2 border rounded"
                      value={current.committee}
                      onChange={(e) => handleCommitteeChange(p._id, e.target.value)}
                    >
                      <option value="">Select Committee</option>
                      {Object.keys(conference.committeeMatrix || {}).map((c, idx) => (
                        <option key={`committee-${idx}-${c}`} value={c}>{c}</option>
                      ))}
                    </select>
                  </td>
                  <td className="border px-4 py-2">
                    <select
                      className="p-2 border rounded"
                      value={current.portfolio}
                      onChange={(e) => handleAssign(p._id, current.committee, e.target.value)}
                      disabled={!current.committee}
                    >
                      <option value="">Select Portfolio</option>
                      {availablePortfolios.map((port: string, idx) => (
                        <option key={`portfolio-${idx}-${port}`} value={port}>{port}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleSubmitAllotments}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
      >
        Submit Allotments
      </button>
    </main>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import EditConferenceForm from '@/components/organiser/EditConferenceForm';
import ParticipantAllotmentTable from '@/components/organiser/ParticipantAllotmentTable';

export default function OrganiserDashboard({ params }: { params: { id: string } }) {
  const id = params.id;
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
      const res = await fetch(`/api/conferences/${id}`);
      if (!res.ok) return router.push('/404');
      const conf = await res.json();

      if (conf.organiserEmail !== session?.user?.email) {
        router.push('/unauthorized');
        return;
      }

      setConference(conf);

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
  }, [id, session, status, router]);

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

  const handleSaveConference = async () => {
    const res = await fetch(`/api/conferences/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(conference),
    });
    alert(res.ok ? 'Conference updated!' : 'Failed to update conference.');
  };

  if (status === 'loading' || loading) return <p className="p-8">Loading...</p>;

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Organiser Dashboard: {conference.name}</h1>
      <p className="text-lg mb-4 text-gray-700">
        Here you can edit your conference and assign committees/portfolios to participants.
      </p>

      <EditConferenceForm
        conference={conference}
        setConference={setConference}
        onSave={handleSaveConference}
      />

      <ParticipantAllotmentTable
        participants={participants}
        conference={conference}
        localAssignments={localAssignments}
        conflictRows={conflictRows}
        submittedRows={submittedRows}
        onAssign={handleAssign}
        onCommitteeChange={handleCommitteeChange}
        onSubmit={handleSubmitAllotments}
      />

          <textarea
      placeholder="Announcements (one per line)"
      value={(conference.announcements || []).join('\n')}
      onChange={(e) =>
        setConference({ ...conference, announcements: e.target.value.split('\n').map((a) => a.trim()) })
      }
      className="p-2 border rounded w-full"
      rows={3}
      />

      <textarea
      placeholder="Conference Policy"
      value={conference.policyText || ''}
      onChange={(e) => setConference({ ...conference, policyText: e.target.value })}
      className="p-2 border rounded w-full"
      rows={4}
      />

    </main>
  );
}

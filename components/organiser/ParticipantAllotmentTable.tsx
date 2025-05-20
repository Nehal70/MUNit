'use client';

interface Props {
  participants: any[];
  conference: any;
  localAssignments: Record<string, { committee: string; portfolio: string }>;
  conflictRows: Set<string>;
  submittedRows: Set<string>;
  onCommitteeChange: (id: string, committee: string) => void;
  onAssign: (id: string, committee: string, portfolio: string) => void;
  onSubmit: () => void;
}

export default function ParticipantAllotmentTable({
  participants,
  conference,
  localAssignments,
  conflictRows,
  submittedRows,
  onCommitteeChange,
  onAssign,
  onSubmit,
}: Props) {
  return (
    <>
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

              const rowStyle = submittedRows.has(p._id)
                ? 'bg-green-100'
                : conflictRows.has(p._id)
                ? 'bg-red-100'
                : '';

              const rowKey = p._id ? `participant-${p._id}` : `participant-${p.email || index}`;

              return (
                <tr key={rowKey} className={rowStyle}>
                  <td className="border px-4 py-2">{p.name}</td>
                  <td className="border px-4 py-2">{p.email}</td>
                  <td className="border px-4 py-2">
                    <select
                      className="p-2 border rounded"
                      value={current.committee}
                      onChange={(e) => onCommitteeChange(p._id, e.target.value)}
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
                      onChange={(e) => onAssign(p._id, current.committee, e.target.value)}
                      disabled={!current.committee}
                    >
                      <option value="">Select Portfolio</option>
                      {portfoliosArray.map((port: string, idx: number) => (
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
        onClick={onSubmit}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
      >
        Submit Allotments
      </button>
    </>
  );
}

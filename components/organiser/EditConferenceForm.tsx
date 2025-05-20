'use client';

interface EditConferenceFormProps {
  conference: any;
  setConference: (c: any) => void;
  onSave: () => Promise<void>;
}

export default function EditConferenceForm({ conference, setConference, onSave }: EditConferenceFormProps) {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await onSave();
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
            // optional error handling
          }
        }}
        className="p-2 border rounded w-full font-mono"
        rows={6}
      />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
        Save Changes
      </button>
    </form>
  );
}

// /app/conference/[id]/page.tsx
import { notFound } from 'next/navigation';

export default async function ConferencePage({ params }: { params: { id: string } }) {
  const res = await fetch(`http://localhost:3000/api/conferences/${params.id}`, {
    cache: 'no-store',
  });
  if (!res.ok) return notFound();

  const conference = await res.json();

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">{conference.name}</h1>
      <p>{conference.dates}</p>
      <p>{conference.venue}</p>
      <p>{conference.participationFee}</p>
      <p>{conference.contactDetails}</p>
      <a href={`/register/${conference.id}`} className="text-blue-600 underline">
        Register Now
      </a>
    </main>
  );
}

// app/conferences/[id]/page.tsx

import { notFound } from "next/navigation";
import { FaMapMarkerAlt, FaCalendarAlt, FaEnvelope, FaDollarSign, FaFolderOpen } from "react-icons/fa";

export default async function ConferencePage({ params }: { params: { id: string } }) {
  const res = await fetch(`http://localhost:3000/api/conferences/${params.id}`, {
    cache: "no-store",
  });

  if (!res.ok) return notFound();

  const conference = await res.json();

  return (
    <main className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">{conference.name}</h1>

        <div className="text-gray-700 space-y-4 mb-8">
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-gray-700" />
            <span>{conference.venue}</span>
          </div>

          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-gray-700" />
            <span>
              {new Date(conference.startDate).toLocaleDateString()} -{" "}
              {new Date(conference.endDate).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <FaDollarSign className="text-gray-700" />
            <span>${conference.participationFee.toFixed(2)}</span>
          </div>

          <div className="flex items-center gap-2">
            <FaEnvelope className="text-gray-700" />
            <span>{conference.contactDetails}</span>
          </div>

          <div className="flex items-center gap-2">
            <FaFolderOpen className="text-gray-700" />
            <span>Committees:</span>
          </div>
          <ul className="list-disc ml-8 text-gray-700">
            {conference.committees.map((committee: string, index: number) => (
              <li key={index}>{committee}</li>
            ))}
          </ul>
        </div>

        {/* Placeholder Register Button */}
        <a
          href={`/register/${conference.id}`}
          className="inline-block bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-all duration-300"
        >
          Register Now
        </a>



      </div>
    </main>
  );
}

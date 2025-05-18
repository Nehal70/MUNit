"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FaMapMarkerAlt, FaCalendarAlt, FaEnvelope, FaDollarSign, FaFolderOpen } from "react-icons/fa";

type Conference = {
  id: string;
  name: string;
  venue: string;
  startDate: string;
  endDate: string;
  participationFee: number;
  organiserEmail: string;
  contactDetails: string;
  committees: string[];
  agendas: string[];
  createdAt: string;
};

export default function ParticipantDashboard() {
  const { data: session, status } = useSession();
  const [conferences, setConferences] = useState<Conference[]>([]);

  useEffect(() => {
    const fetchConferences = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch("/api/participant/conferences");
          const data: Conference[] = await response.json();
          setConferences(data);
        } catch (error) {
          console.error("Failed to fetch conferences:", error);
        }
      }
    };

    fetchConferences();
  }, [session]);

  if (status === "loading") return <p>Loading...</p>;

  const name = session?.user?.name?.split(" ")[0] || "Participant";

  return (
    <div className="p-6">
      <h1 className="text-4xl font-light mb-2">Welcome,</h1>
      <h2 className="text-5xl font-bold mb-8">{name}!</h2>

      {conferences.length === 0 ? (
        <p>No conferences available.</p>
      ) : (
        <div className="flex flex-wrap gap-6">
          {conferences.map((conference) => (
            <div
              key={conference.id}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col w-full md:w-[48%] lg:w-[30%] transition-all duration-300 hover:shadow-xl"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{conference.name}</h2>

              <div className="text-gray-700 space-y-1 mb-4">
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
                  {conference.committees.slice(0, 3).map((committee, index) => (
                    <li key={index}>{committee}</li>
                  ))}
                  {conference.committees.length > 3 && <li>and more...</li>}
                </ul>
              </div>

              <Button
                variant="default"
                size="sm"
                className="bg-gray-900 text-white rounded-md px-4 py-2 mt-auto self-start hover:bg-gray-700 transition-all duration-300"
              >
                View Details
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [participantName, setParticipantName] = useState("Participant");

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await fetch("/api/participant/conferences");
        const data = await response.json();

        // Set the participant name
        setParticipantName(data.name || "Participant");
        setConferences(data.conferences || []);
      } catch (error) {
        console.error("Failed to fetch conferences:", error);
      }
    };

    fetchConferences();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, {participantName}!</h1>
      
      {conferences.length === 0 ? (
        <p>No conferences available.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {conferences.map((conference) => (
            <div key={conference.id} className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold mb-2">{conference.name}</h2>
              <p className="text-gray-600">{conference.venue}</p>
              <Button variant="default" size="sm" className="mt-4">
                View Conference
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

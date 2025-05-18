"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaMapMarkerAlt, FaCalendarAlt, FaEnvelope, FaDollarSign, FaFolderOpen } from "react-icons/fa";

type Conference = {
  id: string;
  name: string;
  venue: string;
  startDate: string;
  endDate: string;
  participationFee: number;
  contactDetails: string;
  committees: string[];
};

export default function ParticipantDashboard() {
  const { data: session, status } = useSession();
  const [registeredConferences, setRegisteredConferences] = useState<Conference[]>([]);
  const [availableConferences, setAvailableConferences] = useState<Conference[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchConferences = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(`/api/participant/conferences?userEmail=${session.user.email}`);
          const data = await response.json();

          setRegisteredConferences(data.registeredConferences || []);
          setAvailableConferences(data.availableConferences || []);
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

      {/* Registered Conferences */}
      <h3 className="text-3xl font-semibold mb-4">My Conferences</h3>
      <div className="flex flex-wrap gap-6 mb-12">
        {registeredConferences.length === 0 ? (
          <p>No registered conferences.</p>
        ) : (
          registeredConferences.map((conference) => (
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
              </div>
              <Button
                onClick={() => router.push(`/conferences/${conference.id}`)}
                className="bg-gray-900 text-white rounded-md px-4 py-2 mt-auto self-start hover:bg-gray-700 transition-all duration-300"
              >
                View Details
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Available Conferences */}
      <h3 className="text-3xl font-semibold mb-4">Available Conferences</h3>
      <div className="flex flex-wrap gap-6">
        {availableConferences.length === 0 ? (
          <p>No available conferences.</p>
        ) : (
          availableConferences.map((conference) => (
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
              </div>
              <Button
                onClick={() => router.push(`/conferences/${conference.id}`)}
                className="bg-gray-900 text-white rounded-md px-4 py-2 mt-auto self-start hover:bg-gray-700 transition-all duration-300"
              >
                View Details
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

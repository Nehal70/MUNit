"use client";

import React, { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export default function ParticipantDashboard() {
    const [conferences, setConferences] = useState([]);
    const [participantName, setParticipantName] = useState("Participant");
  
    useEffect(() => {
      const fetchConferences = async () => {
        try {
          const response = await fetch('/api/participant/conferences', {
            headers: {
              "x-user-id": "example-user-id", // Replace with actual user ID
            },
          });
          const data = await response.json();
          setConferences(data);
          setParticipantName("John Doe"); // Replace with actual participant name
        } catch (error) {
          console.error("Failed to fetch conferences:", error);
        }
      };
  
      fetchConferences();
    }, []);
  
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Welcome, {participantName}!</h1>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {conferences.map((conf) => (
            <div key={conf.id} className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold mb-2">{conf.name}</h2>
              <p className="text-gray-600">{conf.venue}</p>
              <Button variant="default" size="sm" className="mt-4">
                View Conference
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  }
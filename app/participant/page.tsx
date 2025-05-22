"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaDollarSign, 
  FaFolderOpen,
  FaChevronRight,
  FaUsers,
  FaSignOutAlt,
  FaMoon,
  FaSun
} from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { signOut } from 'next-auth/react';

type Conference = {
  id: string;
  name: string;
  venue: string;
  startDate: string;
  endDate: string;
  participationFee: number;
  contactDetails: string;
  committees: string[];
  logo?: string;
};

export default function ParticipantDashboard() {
  const { data: session, status } = useSession();
  const [registeredConferences, setRegisteredConferences] = useState<Conference[]>([]);
  const [availableConferences, setAvailableConferences] = useState<Conference[]>([]);
  const [showAllRegistered, setShowAllRegistered] = useState(false);
  const [showAllAvailable, setShowAllAvailable] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

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

  if (status === "loading") return (
    <div className={`flex justify-center items-center h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  const name = session?.user?.name?.split(" ")[0] || "Participant";

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className={`text-3xl font-light mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Welcome back,</h1>
              <h2 className={`text-5xl font-bold bg-gradient-to-r from-[#273748] via-[#3c4a59] to-[#acb3b8] bg-clip-text text-transparent`}>
                {name}!
              </h2>
            </div>
            <div className="flex gap-4">
              <Button 
                onClick={() => setDarkMode(!darkMode)}
                variant="ghost" 
                size="icon"
                className={`${darkMode ? 'text-yellow-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {darkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
              </Button>
              <Button 
                onClick={() => signOut({ callbackUrl: '/' })}
                variant="ghost" 
                className={`flex items-center gap-2 ${darkMode ? 'text-gray-300 hover:text-red-400 hover:bg-gray-800' : 'text-gray-600 hover:text-red-500 hover:bg-gray-100'}`}
              >
                <FaSignOutAlt /> Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Registered Conferences */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>My Conferences</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {registeredConferences.length} conference{registeredConferences.length !== 1 ? 's' : ''}
              </p>
            </div>
            {registeredConferences.length > 3 && (
              <Button 
                variant="ghost" 
                className={`flex items-center gap-1 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                onClick={() => setShowAllRegistered(!showAllRegistered)}
              >
                {showAllRegistered ? 'Show Less' : 'View All'}
                <FaChevronRight className={`text-xs transition-transform ${showAllRegistered ? 'rotate-90' : ''}`} />
              </Button>
            )}
          </div>
          
          {registeredConferences.length === 0 ? (
            <div className={`rounded-xl p-8 text-center ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-sm`}>
              <FaFolderOpen className={`mx-auto text-5xl mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
              <h4 className={`text-xl font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>No registered conferences</h4>
              <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>You haven't registered for any conferences yet</p>
              <Button 
                    onClick={() => window.scrollTo({ top: document.getElementById('available')?.offsetTop, behavior: 'smooth' })}
                    className="bg-gradient-to-r from-[#000000] to-[#434343] hover:from-[#000000] hover:to-[#434343] text-white"
                    >
                    Browse Available Conferences
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registeredConferences
                .slice(0, showAllRegistered ? registeredConferences.length : 3)
                .map((conference) => (
                  <ConferenceCard 
                    key={conference.id} 
                    conference={conference} 
                    router={router}
                    isRegistered={true}
                    darkMode={darkMode}
                  />
                ))}
            </div>
          )}
        </section>

        {/* Available Conferences */}
        <section id="available">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Available Conferences</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {availableConferences.length} conference{availableConferences.length !== 1 ? 's' : ''}
              </p>
            </div>
            {availableConferences.length > 6 && (
              <Button 
                variant="ghost" 
                className={`flex items-center gap-1 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                onClick={() => setShowAllAvailable(!showAllAvailable)}
              >
                {showAllAvailable ? 'Show Less' : 'View All'}
                <FaChevronRight className={`text-xs transition-transform ${showAllAvailable ? 'rotate-90' : ''}`} />
              </Button>
            )}
          </div>
          
          {availableConferences.length === 0 ? (
            <div className={`rounded-xl p-8 text-center ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-sm`}>
              <FaFolderOpen className={`mx-auto text-5xl mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
              <h4 className={`text-xl font-medium ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>No available conferences</h4>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Check back later for upcoming events</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableConferences
                .slice(0, showAllAvailable ? availableConferences.length : 6)
                .map((conference) => (
                  <ConferenceCard 
                    key={conference.id} 
                    conference={conference} 
                    router={router}
                    isRegistered={false}
                    darkMode={darkMode}
                  />
                ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function ConferenceCard({ conference, router, isRegistered, darkMode }: 
  { conference: Conference, router: any, isRegistered: boolean, darkMode: boolean }) {
  
  const daysUntilStart = Math.floor(
    (new Date(conference.startDate).getTime() - new Date().getTime()
  ) / (1000 * 60 * 60 * 24));

  return (
    <div className={`rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md group
      ${darkMode ? 
        'bg-gray-800 border-gray-700 hover:border-blue-900' : 
        'bg-white border-gray-100 hover:border-blue-100'} border`}
    >
      <div className="p-6 pb-0">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className={`text-xl font-bold transition-colors 
              ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {conference.name}
            </h2>
            {daysUntilStart > 0 && daysUntilStart <= 7 && (
              <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block
                ${darkMode ? 'bg-orange-900 text-orange-200' : 'bg-orange-100 text-orange-800'}`}>
                Starts in {Math.ceil(daysUntilStart)} day{Math.ceil(daysUntilStart) !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          {isRegistered ? (
            <span className={`text-xs px-2 py-1 rounded-full
              ${darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'}`}>
              Registered
            </span>
          ) : (
            <span className={`text-xs px-2 py-1 rounded-full
              ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
              Available
            </span>
          )}
        </div>
      </div>
      
      <div className="p-6 pt-0">
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <FaMapMarkerAlt className={`mt-1 flex-shrink-0 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{conference.venue}</span>
          </div>
          <div className="flex items-start gap-3">
            <FaCalendarAlt className={`mt-1 flex-shrink-0 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              {new Date(conference.startDate).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })} - {new Date(conference.endDate).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
          </div>
          <div className="flex items-start gap-3">
            <FaDollarSign className={`mt-1 flex-shrink-0 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>${conference.participationFee.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <Button 
            onClick={() => router.push(`/conferences/${conference.id}`)}
            variant={isRegistered ? "outline" : "default"}
            className={`flex items-center gap-2 ${isRegistered ? 
              (darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50') : 
              'bg-gradient-to-r from-[#000000] to-[#434343] hover:from-blue-900 hover:to-blue-400 text-white'}`}
          >
            {isRegistered ? "View Details" : "Register Now"}
            <FiExternalLink className="text-sm" />
          </Button>
          
          {conference.committees.length > 0 && (
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {conference.committees.length} {conference.committees.length === 1 ? 'committee' : 'committees'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

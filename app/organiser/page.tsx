'use client';

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FaPlus, FaSignOutAlt, FaChevronRight, FaFolderOpen,
  FaCalendarAlt, FaMapMarkerAlt, FaDollarSign, FaUsers, FaMoon, FaSun
} from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";

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
  participants?: number;
};

export default function OrganiserPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [showAllConferences, setShowAllConferences] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    const fetchConferences = async () => {
      if (session?.user?.email) {
        try {
          const res = await fetch(`/api/conferences?organiserEmail=${session.user.email}`);
          const data = await res.json();
          setConferences(data || []);
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

  const name = session?.user?.name?.split(" ")[0] || "Organizer";

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className={`text-3xl font-light mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Welcome back,</h1>
              <h2 className={`text-5xl font-bold bg-gradient-to-r from-[#273748] via-[#3c4a59] to-[#acb3b8] bg-clip-text text-transparent`}>
                {name}!
              </h2>
            </div>
            <div className="flex gap-4">
              {/* Toggle Dark Mode */}
              <Button
                onClick={() => setDarkMode(!darkMode)}
                variant="ghost"
                className={`flex items-center gap-2 ${darkMode ? 'text-yellow-300' : 'text-gray-600'}`}
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </Button>

              {/* Add Conference */}
              <Button asChild className="bg-gradient-to-r from-[#000000] to-[#434343] hover:from-[#000000] hover:to-[#434343] text-white">
                <Link href="/register-conference">
                  <FaPlus /> New Conference
                </Link>
              </Button>

              {/* Logout */}
              <Button
                onClick={() => signOut({ callbackUrl: "/" })}
                variant="ghost"
                className={`flex items-center gap-2 ${darkMode ? 'text-gray-300 hover:text-red-400 hover:bg-gray-800' : 'text-gray-600 hover:text-red-500 hover:bg-gray-100'}`}
              >
                <FaSignOutAlt /> Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Conferences Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>My Conferences</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {conferences.length} conference{conferences.length !== 1 ? 's' : ''}
              </p>
            </div>
            {conferences.length > 3 && (
              <Button
                variant="ghost"
                className={`flex items-center gap-1 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                onClick={() => setShowAllConferences(!showAllConferences)}
              >
                {showAllConferences ? 'Show Less' : 'View All'}
                <FaChevronRight className={`text-xs transition-transform ${showAllConferences ? 'rotate-90' : ''}`} />
              </Button>
            )}
          </div>

          {conferences.length === 0 ? (
            <div className={`rounded-xl p-8 text-center ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-sm`}>
              <FaFolderOpen className={`mx-auto text-5xl mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
              <h4 className={`text-xl font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>No conferences created</h4>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Create your first conference to get started.</p>
              <Button asChild className="mt-4 bg-gradient-to-r from-[#000000] to-[#434343] hover:from-[#000000] hover:to-[#434343] text-white">
                <Link href="/register-conference">
                  <FaPlus className="mr-2" /> Create Conference
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {conferences
                .slice(0, showAllConferences ? conferences.length : 3)
                .map((conf) => (
                  <ConferenceCard key={conf.id} conference={conf} darkMode={darkMode} />
                ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function ConferenceCard({ conference, darkMode }: { conference: Conference, darkMode: boolean }) {
  const daysUntilStart = Math.floor((new Date(conference.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className={`rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md group
      ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-blue-900' : 'bg-white border-gray-100 hover:border-blue-100'} border`}
    >
      <div className="p-6 pb-0">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {conference.name}
            </h2>
            {daysUntilStart > 0 && daysUntilStart <= 7 && (
              <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block
                ${darkMode ? 'bg-orange-900 text-orange-200' : 'bg-orange-100 text-orange-800'}`}>
                Starts in {daysUntilStart} day{daysUntilStart !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'}`}>
            Organizer
          </span>
        </div>
      </div>

      <div className="p-6 pt-0">
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <FaMapMarkerAlt className={`mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{conference.venue}</span>
          </div>
          <div className="flex items-start gap-3">
            <FaCalendarAlt className={`mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              {new Date(conference.startDate).toLocaleDateString()} – {new Date(conference.endDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-start gap-3">
            <FaDollarSign className={`mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>${conference.participationFee.toFixed(2)}</span>
          </div>
          <div className="flex items-start gap-3">
            <FaUsers className={`mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{conference.participants ?? 0} participants</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Button asChild className="bg-gradient-to-r from-[#000000] to-[#434343] text-white hover:opacity-90">
            <Link href={`/organiser/conferences/${conference.id}`}>
              View Details <FiExternalLink className="ml-2 text-sm" />
            </Link>
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

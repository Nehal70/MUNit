'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaEnvelope, 
  FaDollarSign, 
  FaFolderOpen,
  FaChevronRight,
  FaUsers,
  FaSignOutAlt,
  FaMoon,
  FaSun
} from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

export default function ConferencePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [conference, setConference] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    const fetchConference = async () => {
      const res = await fetch(`/api/conferences/${params.id}`, { cache: 'no-store' });
      if (!res.ok) return router.push('/404');
      const data = await res.json();
      setConference(data);
      setLoading(false);
    };

    fetchConference();
  }, [params.id, router]);

  useEffect(() => {
    const checkRegistration = async () => {
      if (!session?.user?.email) return;
      const res = await fetch(`/api/is-registered?conferenceId=${params.id}&email=${session.user.email}`);
      const data = await res.json();
      setIsRegistered(data.isRegistered);
    };

    checkRegistration();
  }, [session, params.id]);

  if (loading || status === 'loading') return (
    <div className={`flex justify-center items-center h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (!conference) return null;

  const isOrganiser = session?.user?.email === conference.organiserEmail;
  const name = session?.user?.name?.split(" ")[0] || "Participant";

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className={`text-3xl font-light mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Conference Details</h1>
              <h2 className={`text-5xl font-bold bg-gradient-to-r from-[#273748] via-[#3c4a59] to-[#acb3b8] bg-clip-text text-transparent`}>
                {conference.name}
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
              {session && (
                <Button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  variant="ghost" 
                  className={`flex items-center gap-2 ${darkMode ? 'text-gray-300 hover:text-red-400 hover:bg-gray-800' : 'text-gray-600 hover:text-red-500 hover:bg-gray-100'}`}
                >
                  <FaSignOutAlt /> Logout
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Conference Details Card */}
        <div className={`rounded-xl shadow-sm overflow-hidden transition-all duration-300 mb-12
          ${darkMode ? 
            'bg-gray-800 border-gray-700' : 
            'bg-white border-gray-100'} border`}
        >
          <div className="p-6">
            <div className="space-y-6">
              {/* Conference Info */}
              <div className="space-y-4">
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
                <div className="flex items-start gap-3">
                  <FaEnvelope className={`mt-1 flex-shrink-0 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{conference.contactDetails}</span>
                </div>
              </div>

              {/* Committees Section */}
              <div>
                <div className="flex items-start gap-3 mb-2">
                  <FaFolderOpen className={`mt-1 flex-shrink-0 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Committees</h3>
                </div>
                <ul className={`space-y-2 ml-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {conference.committees.map((committee: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <FaChevronRight className={`text-xs mt-1.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      {committee}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                {!isRegistered ? (
                  <Button 
                    asChild
                    className="bg-gradient-to-r from-[#000000] to-[#434343] hover:from-blue-900 hover:to-blue-400 text-white"
                  >
                    <a href={`/register/${conference.id}`}>Register Now</a>
                  </Button>
                ) : (
                  <Button 
                    asChild
                    variant={darkMode ? "outline" : "secondary"}
                    className={darkMode ? "border-gray-600 hover:bg-gray-700" : ""}
                  >
                    <a href={`/participant/conference/${conference.id}`}>View Conference</a>
                  </Button>
                )}

                {isOrganiser && (
                  <Button 
                    asChild
                    variant={darkMode ? "outline" : "outline"}
                    className={darkMode ? "border-gray-600 hover:bg-gray-700" : ""}
                  >
                    <a href={`/organiser/conference/${conference.id}`}>Organiser Mode</a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
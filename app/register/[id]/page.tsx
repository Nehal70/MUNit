'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { 
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaChevronLeft,
  FaChevronDown
} from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

export default function RegisterForm(promiseParams: { params: Promise<{ id: string }> }) {
  const params = use(promiseParams.params);
  const { data: session } = useSession();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  const [form, setForm] = useState({
    committeePref1: '',
    portfolioPref1: '',
    committeePref2: '',
    portfolioPref2: '',
    committeePref3: '',
    portfolioPref3: '',
    remarks: '',
  });

  const [conference, setConference] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    const fetchConference = async () => {
      const res = await fetch(`/api/conferences/${params.id}`);
      const data = await res.json();
      setConference(data);
      setLoading(false);
    };
    fetchConference();
  }, [params.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/register/${params.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert('Registered successfully!');
      router.push('/participant');
    } else {
      alert('Registration failed.');
    }
  };

  if (loading) return (
    <div className={`flex justify-center items-center h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (!conference) return (
    <div className={`flex justify-center items-center h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <p>Conference not found.</p>
    </div>
  );

  const committees = conference.committees || [];
  const matrix = conference.committeeMatrix || {};

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="p-6 max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <Button 
                onClick={() => router.back()}
                variant="ghost" 
                className={`flex items-center gap-2 ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <FaChevronLeft /> Back
              </Button>
              <h1 className={`text-3xl font-light mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Register for</h1>
              <h2 className={`text-4xl font-bold bg-gradient-to-r from-[#273748] via-[#3c4a59] to-[#acb3b8] bg-clip-text text-transparent`}>
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

        {/* Modern Form Container */}
        <div className={`rounded-xl shadow-sm overflow-hidden transition-all duration-300 mb-12
          ${darkMode ? 
            'bg-gray-800 border-gray-700' : 
            'bg-white border-gray-100'} border p-8`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Committee Preferences */}
            {[1, 2, 3].map((n) => {
              const committeePref = (form as any)[`committeePref${n}`];
              const raw = matrix[committeePref];
              const portfolioOptions =
                committeePref && raw
                  ? Array.isArray(raw)
                    ? raw
                    : raw.split(',').map((c: string) => c.trim())
                  : [];

              return (
                <div key={n} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Committee Preference {n}
                    </label>
                    <div className="relative">
                      <select
                        name={`committeePref${n}`}
                        value={committeePref}
                        onChange={handleChange}
                        className={`appearance-none w-full p-3 pr-8 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all
                          ${darkMode ? 
                            'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 
                            'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}
                          ${n === 1 ? 'required:border-red-500 required:ring-red-500' : ''}`}
                        required={n === 1}
                      >
                        <option value="">-- Select Committee --</option>
                        {committees.map((c: string) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <FaChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 
                        ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                  </div>

                  <div className="relative">
                    <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Portfolio Preference {n}
                    </label>
                    <div className="relative">
                      <select
                        name={`portfolioPref${n}`}
                        value={(form as any)[`portfolioPref${n}`]}
                        onChange={handleChange}
                        className={`appearance-none w-full p-3 pr-8 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all
                          ${darkMode ? 
                            'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 
                            'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}
                          ${!committeePref ? 'opacity-50 cursor-not-allowed' : ''}`}
                        required={n === 1}
                        disabled={!committeePref}
                      >
                        <option value="">-- Select Country --</option>
                        {portfolioOptions.map((country: string) => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                      <FaChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 
                        ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Remarks */}
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Comments / Remarks
              </label>
              <textarea
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                placeholder="Any preferences, requirements, or notes..."
                className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all
                  ${darkMode ? 
                    'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 
                    'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                rows={4}
              />
            </div>

            {/* Submit Button with Hover Effect */}
            <div className="pt-2">
            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-[#000000] to-[#434343] hover:from-blue-900 hover:to-blue-400 text-white py-4 text-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Register Now
            </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
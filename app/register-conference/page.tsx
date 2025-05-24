'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaCalendarAlt, 
  FaRupeeSign, 
  FaMapMarkerAlt, 
  FaEnvelope, 
  FaPlus, 
  FaArrowLeft,
  FaMoon,
  FaSun
} from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';
import { useSession } from 'next-auth/react';

export default function RegisterConferencePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  const [form, setForm] = useState({
    name: '',
    startDate: '',
    endDate: '',
    fee: '',
    paymentDetails: '',
    venue: '',
    contactDetails: '',
  });

  const [committees, setCommittees] = useState<string[]>(['']);
  const [agendas, setAgendas] = useState<string[]>(['']);
  const [committeeMatrix, setCommitteeMatrix] = useState<{ [committee: string]: string }>({});
  const [logo, setLogo] = useState<File | null>(null);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCommitteeChange = (index: number, value: string) => {
    const updated = [...committees];
    updated[index] = value;
    setCommittees(updated);
  };

  const handleAgendaChange = (index: number, value: string) => {
    const updated = [...agendas];
    updated[index] = value;
    setAgendas(updated);
  };

  const handleMatrixChange = (committee: string, countries: string) => {
    setCommitteeMatrix(prev => ({
      ...prev,
      [committee]: countries,
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const addCommittee = () => {
    setCommittees([...committees, '']);
    setAgendas([...agendas, '']);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    if (logo) data.append('logo', logo);
    data.append('name', form.name);
    data.append('startDate', form.startDate);
    data.append('endDate', form.endDate);
    data.append('fee', form.fee);
    data.append('paymentDetails', form.paymentDetails);
    data.append('venue', form.venue);
    data.append('contactDetails', form.contactDetails);
    data.append('committees', JSON.stringify(committees));
    data.append('agendas', JSON.stringify(agendas));
    data.append('committeeMatrix', JSON.stringify(committeeMatrix));

    const res = await fetch('/api/create-conference', {
      method: 'POST',
      body: data,
    });

    if (res.ok) {
      router.push('/organiser');
    } else {
      alert('Failed to create conference.');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <button 
                onClick={() => router.back()}
                className={`flex items-center gap-2 mb-4 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
              >
                <FaArrowLeft /> Back
              </button>
              <h1 className={`text-3xl font-light mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Organizer Dashboard</h1>
              <h2 className={`text-5xl font-bold bg-gradient-to-r from-[#273748] via-[#3c4a59] to-[#acb3b8] bg-clip-text text-transparent`}>
                New Conference
              </h2>
            </div>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${darkMode ? 'text-yellow-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {darkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
            </button>
          </div>
        </div>

        <div className={`rounded-xl shadow-sm p-6 mb-8 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Logo Upload */}
            <div>
              <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Conference Logo
              </label>
              <div className={`flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg ${darkMode ? 'border-gray-600 hover:border-blue-500' : 'border-gray-300 hover:border-blue-400'}`}>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleLogoChange}
                  className="hidden" 
                  id="logo-upload"
                />
                <label 
                  htmlFor="logo-upload" 
                  className={`cursor-pointer text-center ${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600'}`}
                >
                  {logo ? logo.name : 'Click to upload logo (PNG/JPG)'}
                </label>
              </div>
            </div>

            {/* Conference Name */}
            <div className="relative">
              <input
                type="text"
                name="name"
                placeholder=" "
                value={form.name}
                onChange={handleFormChange}
                required
                className={`block px-4 py-3 w-full rounded-lg border appearance-none focus:outline-none focus:ring-1 peer ${darkMode ? 
                  'bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500' : 
                  'bg-white border-gray-300 focus:ring-blue-400 focus:border-blue-400'}`}
              />
              <label 
                className={`absolute duration-300 transform -translate-y-4 scale-75 top-3 left-4 z-10 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-3 peer-focus:scale-75 peer-focus:-translate-y-4 ${darkMode ? 
                  'bg-gray-800 text-gray-300 peer-focus:text-blue-400' : 
                  'bg-white text-gray-500 peer-focus:text-blue-600'}`}
              >
                Conference Name
              </label>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <FaCalendarAlt />
                </div>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleFormChange}
                  required
                  className={`block pl-10 pr-4 py-3 w-full rounded-lg border appearance-none focus:outline-none focus:ring-1 ${darkMode ? 
                    'bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500' : 
                    'bg-white border-gray-300 focus:ring-blue-400 focus:border-blue-400'}`}
                />
              </div>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <FaCalendarAlt />
                </div>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleFormChange}
                  required
                  className={`block pl-10 pr-4 py-3 w-full rounded-lg border appearance-none focus:outline-none focus:ring-1 ${darkMode ? 
                    'bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500' : 
                    'bg-white border-gray-300 focus:ring-blue-400 focus:border-blue-400'}`}
                />
              </div>
            </div>

            {/* Fee */}
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <FaRupeeSign />
              </div>
              <input
                type="number"
                name="fee"
                placeholder=" "
                value={form.fee}
                onChange={handleFormChange}
                required
                className={`block pl-10 pr-4 py-3 w-full rounded-lg border appearance-none focus:outline-none focus:ring-1 peer ${darkMode ? 
                  'bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500' : 
                  'bg-white border-gray-300 focus:ring-blue-400 focus:border-blue-400'}`}
              />
              <label 
                className={`absolute duration-300 transform -translate-y-4 scale-75 top-3 left-10 z-10 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-3 peer-focus:scale-75 peer-focus:-translate-y-4 ${darkMode ? 
                  'bg-gray-800 text-gray-300 peer-focus:text-blue-400' : 
                  'bg-white text-gray-500 peer-focus:text-blue-600'}`}
              >
                Participation Fee (₹)
              </label>
            </div>

            {/* Payment Details */}
            <div className="relative">
              <textarea
                name="paymentDetails"
                placeholder=" "
                value={form.paymentDetails}
                onChange={handleFormChange}
                required
                className={`block px-4 py-3 w-full rounded-lg border appearance-none focus:outline-none focus:ring-1 peer ${darkMode ? 
                  'bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500' : 
                  'bg-white border-gray-300 focus:ring-blue-400 focus:border-blue-400'}`}
                rows={3}
              />
              <label 
                className={`absolute duration-300 transform -translate-y-4 scale-75 top-3 left-4 z-10 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-6 peer-focus:top-3 peer-focus:scale-75 peer-focus:-translate-y-4 ${darkMode ? 
                  'bg-gray-800 text-gray-300 peer-focus:text-blue-400' : 
                  'bg-white text-gray-500 peer-focus:text-blue-600'}`}
              >
                Payment Details
              </label>
            </div>

            {/* Venue */}
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <FaMapMarkerAlt />
              </div>
              <textarea
                name="venue"
                placeholder=" "
                value={form.venue}
                onChange={handleFormChange}
                required
                className={`block pl-10 pr-4 py-3 w-full rounded-lg border appearance-none focus:outline-none focus:ring-1 peer ${darkMode ? 
                  'bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500' : 
                  'bg-white border-gray-300 focus:ring-blue-400 focus:border-blue-400'}`}
                rows={2}
              />
              <label 
                className={`absolute duration-300 transform -translate-y-4 scale-75 top-3 left-10 z-10 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-6 peer-focus:top-3 peer-focus:scale-75 peer-focus:-translate-y-4 ${darkMode ? 
                  'bg-gray-800 text-gray-300 peer-focus:text-blue-400' : 
                  'bg-white text-gray-500 peer-focus:text-blue-600'}`}
              >
                Venue
              </label>
            </div>

            {/* Contact Details */}
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <FaEnvelope />
              </div>
              <textarea
                name="contactDetails"
                placeholder=" "
                value={form.contactDetails}
                onChange={handleFormChange}
                required
                className={`block pl-10 pr-4 py-3 w-full rounded-lg border appearance-none focus:outline-none focus:ring-1 peer ${darkMode ? 
                  'bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500' : 
                  'bg-white border-gray-300 focus:ring-blue-400 focus:border-blue-400'}`}
                rows={2}
              />
              <label 
                className={`absolute duration-300 transform -translate-y-4 scale-75 top-3 left-10 z-10 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-6 peer-focus:top-3 peer-focus:scale-75 peer-focus:-translate-y-4 ${darkMode ? 
                  'bg-gray-800 text-gray-300 peer-focus:text-blue-400' : 
                  'bg-white text-gray-500 peer-focus:text-blue-600'}`}
              >
                Contact Details
              </label>
            </div>

            {/* Committees Section */}
            <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Committees, Agendas & Country Matrix
              </h3>

              {committees.map((committee, idx) => (
                <div key={idx} className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'} shadow-sm`}>
                  <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder=" "
                      value={committee}
                      onChange={(e) => handleCommitteeChange(idx, e.target.value)}
                      className={`block px-4 py-3 w-full rounded-lg border appearance-none focus:outline-none focus:ring-1 peer ${darkMode ? 
                        'bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500' : 
                        'bg-white border-gray-300 focus:ring-blue-400 focus:border-blue-400'}`}
                      required
                    />
                    <label 
                      className={`absolute duration-300 transform -translate-y-4 scale-75 top-3 left-4 z-10 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-3 peer-focus:scale-75 peer-focus:-translate-y-4 ${darkMode ? 
                        'bg-gray-600 text-gray-300 peer-focus:text-blue-400' : 
                        'bg-white text-gray-500 peer-focus:text-blue-600'}`}
                    >
                      Committee {idx + 1}
                    </label>
                  </div>

                  <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder=" "
                      value={agendas[idx]}
                      onChange={(e) => handleAgendaChange(idx, e.target.value)}
                      className={`block px-4 py-3 w-full rounded-lg border appearance-none focus:outline-none focus:ring-1 peer ${darkMode ? 
                        'bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500' : 
                        'bg-white border-gray-300 focus:ring-blue-400 focus:border-blue-400'}`}
                      required
                    />
                    <label 
                      className={`absolute duration-300 transform -translate-y-4 scale-75 top-3 left-4 z-10 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-3 peer-focus:scale-75 peer-focus:-translate-y-4 ${darkMode ? 
                        'bg-gray-600 text-gray-300 peer-focus:text-blue-400' : 
                        'bg-white text-gray-500 peer-focus:text-blue-600'}`}
                    >
                      Agenda
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder=" "
                      value={committeeMatrix[committee] || ''}
                      onChange={(e) => handleMatrixChange(committee, e.target.value)}
                      className={`block px-4 py-3 w-full rounded-lg border appearance-none focus:outline-none focus:ring-1 peer ${darkMode ? 
                        'bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500' : 
                        'bg-white border-gray-300 focus:ring-blue-400 focus:border-blue-400'}`}
                      required
                    />
                    <label 
                      className={`absolute duration-300 transform -translate-y-4 scale-75 top-3 left-4 z-10 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-3 peer-focus:scale-75 peer-focus:-translate-y-4 ${darkMode ? 
                        'bg-gray-600 text-gray-300 peer-focus:text-blue-400' : 
                        'bg-white text-gray-500 peer-focus:text-blue-600'}`}
                    >
                      Country Matrix (comma-separated)
                    </label>
                  </div>
                </div>
              ))}

              <button 
                type="button" 
                onClick={addCommittee}
                className={`flex items-center gap-2 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
              >
                <FaPlus /> Add Another Committee
              </button>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="bg-gradient-to-r from-[#000000] to-[#434343] hover:from-blue-900 hover:to-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
            >
              Create Conference <FiExternalLink />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
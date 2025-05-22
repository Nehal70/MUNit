'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

export default function RegisterForm(promiseParams: { params: Promise<{ id: string }> }) {
  const params = use(promiseParams.params);
  const { data: session } = useSession();
  const router = useRouter();


  const [form, setForm] = useState({
    name: '',
    email: '',
    age: '',
    institution: '',
    grade: '',
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
    const fetchConference = async () => {
      const res = await fetch(`/api/conferences/${params.id}`);
      const data = await res.json();
      setConference(data);
      setLoading(false);
    };
    fetchConference();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
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

  if (loading) return <p className="p-8">Loading...</p>;
  if (!conference) return <p className="p-8">Conference not found.</p>;

  const committees = conference.committees || [];
  const matrix = conference.committeeMatrix || {};

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">{conference.name}</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
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
                <div>
                  <label className="block font-medium mb-1">Committee Preference {n}</label>
                  <select
                    name={`committeePref${n}`}
                    value={committeePref}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required={n === 1}
                  >
                    <option value="">-- Select Committee --</option>
                    {committees.map((c: string) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1">Portfolio Preference {n}</label>
                  <select
                    name={`portfolioPref${n}`}
                    value={(form as any)[`portfolioPref${n}`]}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required={n === 1}
                  >
                    <option value="">-- Select Country --</option>
                    {portfolioOptions.map((country: string) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}

          <div>
            <label className="block font-medium mb-1">Comments / Remarks</label>
            <textarea
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              placeholder="Any preferences, requirements, or notes..."
              className="w-full p-2 border rounded"
              rows={4}
            />
          </div>

          <button
            type="submit"
            className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-all duration-300"
          >
            Register Now
          </button>
        </form>
      </div>
    </div>
  );
}

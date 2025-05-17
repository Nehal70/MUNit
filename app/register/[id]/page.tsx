'use client';

import { useState } from 'react';

export default function RegisterForm({ params }: { params: { id: string } }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    age: '',
    institution: '',
    grade: '',
    committeePrefs: ['', '', ''],
    portfolioPrefs: ['', '', ''],
    remarks: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/register/${params.id}`, {
      method: 'POST',
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert('Registered successfully!');
    } else {
      alert('Registration failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-xl mx-auto space-y-4">
      <input name="name" placeholder="Name" onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="age" placeholder="Age" onChange={handleChange} required />
      <input name="institution" placeholder="Institution" onChange={handleChange} />
      <input name="grade" placeholder="Grade" onChange={handleChange} />

      {[1, 2, 3].map((n) => (
        <div key={n}>
          <input name={`committeePrefs[${n - 1}]`} placeholder={`Committee Preference ${n}`} onChange={handleChange} />
          <input name={`portfolioPrefs[${n - 1}]`} placeholder={`Portfolio Preferences for Committee ${n}`} onChange={handleChange} />
        </div>
      ))}

      <textarea name="remarks" placeholder="Comments / Remarks" onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterConferencePage() {
  const router = useRouter();

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
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Register a New Conference</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="file" accept="image/*" onChange={handleLogoChange} />

        <input
          type="text"
          name="name"
          placeholder="Conference Name"
          value={form.name}
          onChange={handleFormChange}
          required
          className="p-2 border rounded"
        />

        <div className="flex gap-2">
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleFormChange}
            required
            className="p-2 border rounded w-1/2"
          />
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleFormChange}
            required
            className="p-2 border rounded w-1/2"
          />
        </div>

        <input
          type="number"
          name="fee"
          placeholder="Participation Fee (₹)"
          value={form.fee}
          onChange={handleFormChange}
          required
          className="p-2 border rounded"
        />

        <textarea
          name="paymentDetails"
          placeholder="Payment Details"
          value={form.paymentDetails}
          onChange={handleFormChange}
          required
          className="p-2 border rounded"
        />

        <textarea
          name="venue"
          placeholder="Venue"
          value={form.venue}
          onChange={handleFormChange}
          required
          className="p-2 border rounded"
        />

        <textarea
          name="contactDetails"
          placeholder="Contact Details"
          value={form.contactDetails}
          onChange={handleFormChange}
          required
          className="p-2 border rounded"
        />

        <h3 className="text-xl font-semibold">Committees & Agendas</h3>
        {committees.map((committee, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            <input
              type="text"
              placeholder={`Committee ${idx + 1}`}
              value={committee}
              onChange={(e) => handleCommitteeChange(idx, e.target.value)}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder={`Agenda for Committee ${idx + 1}`}
              value={agendas[idx]}
              onChange={(e) => handleAgendaChange(idx, e.target.value)}
              className="p-2 border rounded"
              required
            />
          </div>
        ))}

        <button type="button" onClick={addCommittee} className="text-blue-600 underline">
          + Add Another Committee
        </button>

        <button type="submit" className="bg-blue-600 text-white py-2 rounded">
          Create Conference
        </button>
      </form>
    </main>
  );
}

// app/components/organiser/ExecutiveBoardSection.tsx
'use client';

import { useEffect, useState } from 'react';

export default function ExecutiveBoardSection({
  conferenceId,
  committees,
}: {
  conferenceId: string;
  committees: string[];
}) {
  const [executiveBoard, setExecutiveBoard] = useState<any[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCommittee, setNewCommittee] = useState('');

  const fetchBoard = async () => {
    const res = await fetch(`/api/conferences/${conferenceId}/executive-board`);
    const data = await res.json();
    setExecutiveBoard(data);
  };

  useEffect(() => {
    fetchBoard();
  }, [conferenceId]);

  const handleAdd = async () => {
    const res = await fetch(`/api/conferences/${conferenceId}/executive-board`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newEmail, title: newTitle, committee: newCommittee }),
    });
    if (res.ok) {
      setNewEmail('');
      setNewTitle('');
      setNewCommittee('');
      fetchBoard();
    }
  };

  const handleUpdate = async (id: string, title: string, committee: string) => {
    await fetch(`/api/executive-board/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, committee }),
    });
    fetchBoard();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/executive-board/${id}`, {
      method: 'DELETE' });
    fetchBoard();
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md mt-8">
      <h2 className="text-2xl font-semibold mb-4">Executive Board</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input type="email" placeholder="Email" className="border p-2 rounded w-full" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
        <input type="text" placeholder="Title" className="border p-2 rounded w-full" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
        <select className="border p-2 rounded w-full" value={newCommittee} onChange={(e) => setNewCommittee(e.target.value)}>
          <option value="">Select Committee</option>
          {committees.map((c, i) => <option key={i} value={c}>{c}</option>)}
        </select>
        <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add</button>
      </div>

      <table className="w-full text-left border mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Committee</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {executiveBoard.map((eb) => (
            <tr key={eb.id} className="border">
              <td className="p-2 border">{eb.user.email}</td>
              <td className="p-2 border">
                <input value={eb.title} onChange={(e) => setExecutiveBoard((prev) => prev.map(item => item.id === eb.id ? { ...item, title: e.target.value } : item))} className="border p-1 rounded w-full" />
              </td>
              <td className="p-2 border">
                <select value={eb.committee} onChange={(e) => setExecutiveBoard((prev) => prev.map(item => item.id === eb.id ? { ...item, committee: e.target.value } : item))} className="border p-1 rounded w-full">
                  {committees.map((c, i) => <option key={i} value={c}>{c}</option>)}
                </select>
              </td>
              <td className="p-2 border">
                <button onClick={() => handleUpdate(eb.id, eb.title, eb.committee)} className="text-green-600 mr-2">Save</button>
                <button onClick={() => handleDelete(eb.id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
// frontend/src/components/MatchEditModal.jsx
import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { toast } from 'react-toastify';

const MatchEditModal = ({ isOpen, onClose, match, token, onSave }) => {
  const [form, setForm] = useState({
    status: '',
    match_date: '',
    winner_id: '',
  });

  useEffect(() => {
    if (match) {
      setForm({
        status: match.status,
        match_date: match.match_date?.split('T')[0] || '',
        winner_id: match.winner_id || '',
      });
    }
  }, [match]);

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/admin/matches/${match.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Update failed');
      toast.success('Match updated');
      onSave?.();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Error updating match');
    }
  };

  if (!isOpen || !match) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 p-4 flex items-center justify-center">
      <Dialog.Overlay className="fixed inset-0 bg-black/40" />
      <div className="bg-white rounded-lg p-6 w-full max-w-md z-10 relative shadow-xl">
        <Dialog.Title className="text-lg font-bold mb-4">Edit Match #{match.id}</Dialog.Title>

        <label className="block mb-2 text-sm font-medium">Status</label>
        <select
          className="w-full p-2 border rounded mb-4"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <label className="block mb-2 text-sm font-medium">Match Date</label>
        <input
          type="date"
          className="w-full p-2 border rounded mb-4"
          value={form.match_date}
          onChange={(e) => setForm({ ...form, match_date: e.target.value })}
        />

        <label className="block mb-2 text-sm font-medium">Winner</label>
        <select
          className="w-full p-2 border rounded mb-4"
          value={form.winner_id}
          onChange={(e) => setForm({ ...form, winner_id: e.target.value })}
        >
          <option value="">None</option>
          <option value={match.player1_id}>{match.player1_name}</option>
          <option value={match.player2_id}>{match.player2_name}</option>
        </select>

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default MatchEditModal;


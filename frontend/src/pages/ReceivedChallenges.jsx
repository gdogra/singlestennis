// src/pages/ReceivedChallenges.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import ConfirmationModal from '../components/ConfirmationModal';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ReceivedChallenges = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [action, setAction] = useState(null); // 'accept' or 'decline'
  const [scheduleModal, setScheduleModal] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(null);
  const [location, setLocation] = useState('');

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await fetch('/api/challenges/received');
        const data = await res.json();
        setChallenges(data);
      } catch (err) {
        toast.error('Failed to fetch challenges.');
      } finally {
        setLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  const handleAction = async (challengeId, actionType, payload = {}) => {
    try {
      const res = await fetch(`/api/challenges/${challengeId}/${actionType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      toast.success(`Challenge ${actionType}ed!`);
      setChallenges((prev) => prev.filter((c) => c.id !== challengeId));
    } catch {
      toast.error(`Failed to ${actionType} challenge.`);
    }
  };

  const openModal = (challenge, type) => {
    setSelectedChallenge(challenge);
    setAction(type);
    if (type === 'accept') {
      setScheduleModal(true);
    } else {
      setScheduleModal(false);
    }
  };

  const closeModal = () => {
    setSelectedChallenge(null);
    setAction(null);
    setScheduleModal(false);
    setScheduledDate(null);
    setLocation('');
  };

  const confirmAction = () => {
    if (selectedChallenge && action) {
      const payload =
        action === 'accept'
          ? {
              scheduled_date: scheduledDate?.toISOString(),
              location,
            }
          : undefined;
      handleAction(selectedChallenge.id, action, payload);
      closeModal();
    }
  };

  const goToCalendar = () => {
    navigate('/dashboard/calendar');
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (!challenges.length) return <p className="p-4">No challenges received.</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Received Challenges</h2>
      <div className="space-y-4">
        {challenges.map((challenge) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="border rounded p-4 flex justify-between items-center shadow-sm"
          >
            <div>
              <p>
                <strong>{challenge.sender_name}</strong> challenged you.
              </p>
              <p className="text-sm text-gray-500">Skill diff: {challenge.skill_diff}</p>
              {challenge.scheduled_date && (
                <p className="text-sm text-gray-600">
                  📅 Scheduled for: {new Date(challenge.scheduled_date).toLocaleString()}
                </p>
              )}
              {challenge.location && (
                <p className="text-sm text-gray-600">📍 Location: {challenge.location}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openModal(challenge, 'accept')}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Accept
              </button>
              <button
                onClick={() => openModal(challenge, 'decline')}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Decline
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 text-right">
        <button
          onClick={goToCalendar}
          className="text-sm text-blue-600 hover:underline"
        >
          View Calendar
        </button>
      </div>

      {/* Scheduling Form */}
      {scheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">Schedule Match</h3>
            <label className="block text-sm mb-1">Date & Time</label>
            <DatePicker
              selected={scheduledDate}
              onChange={(date) => setScheduledDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="Pp"
              placeholderText="Choose date and time"
              className="w-full border p-2 rounded mb-3"
            />
            <label className="block text-sm mb-1">Location</label>
            <input
              type="text"
              className="w-full border p-2 rounded mb-3"
              placeholder="Court or Club Name"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="text-gray-600 hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={!!selectedChallenge && action === 'decline'}
        title={`Confirm decline`}
        message={`Are you sure you want to decline this challenge from ${selectedChallenge?.sender_name}?`}
        onCancel={closeModal}
        onConfirm={confirmAction}
      />
    </div>
  );
};

export default ReceivedChallenges;


import React, { useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root');

export default function ChallengeModal({
  isOpen,
  onRequestClose,
  receiverId,
  onChallengeSent,
}) {
  const [message, setMessage] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message before sending.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiver_id: receiverId,
          message,
          scheduled_for: date || null,
        }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      toast.success('Challenge sent successfully!');
      setMessage('');
      setDate('');
      onChallengeSent();
      onRequestClose();
    } catch (error) {
      console.error('Error sending challenge:', error);
      toast.error('Failed to send challenge. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Send Challenge"
      className="max-w-lg mx-auto mt-20 bg-white p-6 rounded-2xl shadow-lg"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start"
    >
      <h2 className="text-xl font-semibold mb-4">Send a Challenge</h2>
      <textarea
        className="w-full p-2 border rounded mb-4"
        placeholder="Enter your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
      />
      <input
        type="date"
        className="w-full p-2 border rounded mb-4"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button
        onClick={handleSend}
        disabled={loading}
        className="w-full py-2 rounded-2xl shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 bg-blue-500 text-white font-medium disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send Challenge'}
      </button>
    </Modal>
  );
}


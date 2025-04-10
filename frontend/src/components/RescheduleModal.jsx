// src/components/RescheduleModal.jsx
import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const RescheduleModal = ({ isOpen = true, onClose, match, onSuccess }) => {
  const [newDate, setNewDate] = useState(match?.scheduled_date ? new Date(match.scheduled_date) : new Date());
  const [location, setLocation] = useState(match?.location || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!newDate || !location.trim()) {
      setError("Both date and location are required.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/matches/${match.id}/reschedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduled_date: newDate, location }),
      });

      if (!res.ok) throw new Error("Failed to reschedule match");

      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const mapsUrl = location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
    : null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md z-50"
      >
        <Dialog.Title className="text-lg font-semibold mb-4">Reschedule Match</Dialog.Title>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">New Date & Time</label>
          <DatePicker
            selected={newDate}
            onChange={setNewDate}
            showTimeSelect
            dateFormat="Pp"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">New Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Court name or address"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {mapsUrl && (
          <div className="mb-4 text-sm">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              📍 Preview on Google Maps
            </a>
          </div>
        )}

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </Dialog>
  );
};

export default RescheduleModal;


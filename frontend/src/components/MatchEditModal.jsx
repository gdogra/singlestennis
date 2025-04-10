// src/components/MatchEditModal.jsx
import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import DateTimePicker from "react-datetime-picker";
import { toast } from "react-toastify";
import { updateMatchDetails } from "../api";

const MatchEditModal = ({ isOpen, onClose, match, onSave }) => {
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (match) {
      setDate(new Date(match.scheduled_at));
      setLocation(match.location);
    }
  }, [match]);

  const handleSave = async () => {
    try {
      const updated = await updateMatchDetails(match.id, {
        scheduled_at: date,
        location,
      });
      toast.success("Match updated successfully!");
      onSave(updated);
      onClose();
    } catch (error) {
      toast.error("Failed to update match.");
      console.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Match</h2>
        <label className="block mb-2 text-sm">Date & Time:</label>
        <DateTimePicker
          onChange={setDate}
          value={date}
          className="mb-4 w-full"
        />

        <label className="block mb-2 text-sm">Location:</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border rounded px-3 py-2 w-full mb-4"
        />

        {location && (
          <iframe
            title="Google Maps Preview"
            width="100%"
            height="200"
            className="rounded mb-4"
            loading="lazy"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(
              location
            )}&output=embed`}
          ></iframe>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MatchEditModal;


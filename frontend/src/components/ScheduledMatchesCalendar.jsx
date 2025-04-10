// src/components/ScheduledMatchesCalendar.jsx
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { fetchScheduledMatches } from "../api/index.js";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import RescheduleModal from "./MatchEditModal.jsx";

const localizer = momentLocalizer(moment);

const ScheduledMatchesCalendar = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const loadMatches = async () => {
    if (!user) return;
    try {
      const data = await fetchScheduledMatches(user.token);
      const formatted = data.map(match => ({
        ...match,
        title: `${match.opponent_name} (${match.status})`,
        start: new Date(match.scheduled_date),
        end: new Date(moment(match.scheduled_date).add(1, 'hour').toISOString()),
      }));
      setMatches(formatted);
    } catch (error) {
      console.error("Error loading scheduled matches:", error);
    }
  };

  useEffect(() => {
    loadMatches();
  }, [user]);

  const handleSelectEvent = (event) => {
    setSelectedMatch(event);
    setShowModal(true);
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-2">Scheduled Matches</h3>
      <button
        onClick={loadMatches}
        className="mb-4 px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600"
      >
        Refresh
      </button>

      {matches.length === 0 ? (
        <p className="text-sm text-gray-600">No matches scheduled.</p>
      ) : (
        <div className="h-[500px]">
          <Calendar
            localizer={localizer}
            events={matches}
            startAccessor="start"
            endAccessor="end"
            onSelectEvent={handleSelectEvent}
            style={{ height: "100%" }}
          />
        </div>
      )}

      {showModal && selectedMatch && (
        <RescheduleModal
          match={selectedMatch}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            loadMatches();
          }}
        />
      )}
    </div>
  );
};

export default ScheduledMatchesCalendar;


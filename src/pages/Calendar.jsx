import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { supabase } from '../supabaseClient';
import CalendarView from '../components/CalendarView';

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        // Get the current user
        const {
          data: { user },
          error: userErr,
        } = await supabase.auth.getUser();
        if (userErr) throw userErr;

        // Fetch all challenges (no scheduled_for column)
        const { data, error } = await supabase
          .from('challenges')
          .select('id, message')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);
        if (error) throw error;

        // Map to placeholder events (no date until schema is updated)
        const formatted = data.map((e) => ({
          id: e.id,
          title: e.message || 'Challenge',
          date: null,
        }));
        setEvents(formatted);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load calendar events.');
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  if (loading) return <div className="p-6">Loading calendar…</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Calendar</h1>
      <CalendarView events={events} />
    </div>
  );
}


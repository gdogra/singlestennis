// src/pages/Leaderboard.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Avatar from "../components/Avatar";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Leaderboard() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, avatar_url, wins, losses")
        .order("wins", { ascending: false });

      if (error) {
        console.error("Error fetching leaderboard:", error.message);
        toast.error("Failed to load leaderboard.");
        setLoading(false);
        return;
      }

      setProfiles(data);
      setLoading(false);
    };

    fetchProfiles();
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Leaderboard</h1>
      {loading ? (
        <p className="text-center">Loading leaderboard…</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Player</th>
                <th className="px-4 py-2">Wins</th>
                <th className="px-4 py-2">Losses</th>
                <th className="px-4 py-2">Win Rate</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile, index) => {
                const winRate = profile.wins + profile.losses > 0
                  ? ((profile.wins / (profile.wins + profile.losses)) * 100).toFixed(1) + "%"
                  : "–";

                return (
                  <tr
                    key={profile.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/profile/${profile.id}`)}
                  >
                    <td className="px-4 py-2 font-semibold">{index + 1}</td>
                    <td className="px-4 py-2 flex items-center gap-2">
                      <Avatar url={profile.avatar_url} size={32} name={profile.name} />
                      <span>{profile.name}</span>
                    </td>
                    <td className="px-4 py-2">{profile.wins}</td>
                    <td className="px-4 py-2">{profile.losses}</td>
                    <td className="px-4 py-2">{winRate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


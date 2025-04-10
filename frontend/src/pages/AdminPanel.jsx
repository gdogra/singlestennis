// src/pages/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ConfirmationModal from "../components/ConfirmationModal.jsx";

const AdminPanel = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [modalData, setModalData] = useState(null);
  const [chartData, setChartData] = useState([]);

  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsers(data);
    setFilteredUsers(data);
  };

  const fetchMatches = async () => {
    const res = await fetch("/api/matches/recent", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMatches(data.matches || []);
    generateChart(data.matches || []);
  };

  const generateChart = (matchList) => {
    const result = {};
    matchList.forEach((m) => {
      const key = m.result.startsWith("Won") ? "Wins" : "Losses";
      result[key] = (result[key] || 0) + 1;
    });
    setChartData(
      Object.keys(result).map((key) => ({ name: key, count: result[key] }))
    );
  };

  const updateUserRole = async () => {
    const { userId, role } = modalData;
    await fetch(`/api/admin/users/${userId}/role`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    });
    setModalData(null);
    fetchUsers();
  };

  const updateMatch = async () => {
    const { matchId, score, winner_id } = modalData;
    await fetch(`/api/admin/matches/${matchId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ score, winner_id }),
    });
    setModalData(null);
    fetchMatches();
  };

  useEffect(() => {
    fetchUsers();
    fetchMatches();
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        user.email.toLowerCase().includes(filter.toLowerCase()) ||
        `${user.first_name} ${user.last_name}`
          .toLowerCase()
          .includes(filter.toLowerCase())
      )
    );
  }, [filter, users]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">User Roles</h2>
        <input
          placeholder="Filter users"
          className="border p-2 mb-3 w-full"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        {filteredUsers.map((user) => (
          <div key={user.id} className="border p-4 mb-2 rounded">
            <p>
              <strong>{user.email}</strong> ({user.role})
            </p>
            <button
              onClick={() =>
                setModalData({
                  type: "role",
                  userId: user.id,
                  role: user.role === "admin" ? "player" : "admin",
                })
              }
              className="bg-blue-500 text-white px-3 py-1 rounded mt-1"
            >
              Set as {user.role === "admin" ? "Player" : "Admin"}
            </button>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Match Management</h2>
        {matches.map((match) => (
          <div key={match.id} className="border p-4 mb-2 rounded">
            <p>
              <strong>ID:</strong> {match.id}
            </p>
            <p>
              <strong>Opponent:</strong> {match.opponent_name}
            </p>
            <p>
              <strong>Result:</strong> {match.result}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                setModalData({
                  type: "match",
                  matchId: match.id,
                  score: form.score.value,
                  winner_id: form.winner_id.value,
                });
              }}
              className="space-y-2 mt-2"
            >
              <input
                name="score"
                placeholder="Score"
                className="border p-1 rounded w-full"
              />
              <input
                name="winner_id"
                placeholder="Winner ID"
                className="border p-1 rounded w-full"
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Submit Update
              </button>
            </form>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Match Stats</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {modalData && (
        <ConfirmationModal
          type={modalData.type}
          onConfirm={modalData.type === "role" ? updateUserRole : updateMatch}
          onCancel={() => setModalData(null)}
        />
      )}
    </div>
  );
};

export default AdminPanel;


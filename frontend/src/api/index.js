// src/api/index.js
import axios from 'axios';

const API_BASE = '/api';

export const fetchScheduledMatches = async (token) => {
  const res = await axios.get(`${API_BASE}/matches/scheduled`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateMatchDetails = async (matchId, updates, token) => {
  const res = await axios.put(`${API_BASE}/matches/${matchId}`, updates, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const acceptChallenge = async (challengeId, payload, token) => {
  const res = await axios.post(`${API_BASE}/challenges/${challengeId}/accept`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const declineChallenge = async (challengeId, token) => {
  const res = await axios.post(`${API_BASE}/challenges/${challengeId}/decline`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const fetchReceivedChallenges = async (token) => {
  const res = await axios.get(`${API_BASE}/challenges/received`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const fetchPlayerRankings = async (token) => {
  const res = await axios.get(`${API_BASE}/dashboard/player-rankings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const fetchRecentMatches = async (token) => {
  const res = await axios.get(`${API_BASE}/matches/recent`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};


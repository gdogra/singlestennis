// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react'
import { useSession } from '../contexts/AuthContext'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Profile() {
  const { user } = useSession()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [wins, setWins] = useState(0)
  const [losses, setLosses] = useState(0)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({ name: '', bio: '', avatar_url: '', email: '' })

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  useEffect(() => {
    if (!user?.id) return
    const fetchProfile = async () => {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (error) console.error(error)
      else {
        setProfile(data)
        setFormData({
          name: data.name || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
          email: user.email || '',
        })
      }
    }

    const fetchStats = async () => {
      const { data: matches } = await supabase.from('matches').select('*').or(`player1_id.eq.${user.id},player2_id.eq.${user.id}`)
      const wins = matches.filter((m) => m.winner_id === user.id).length
      const losses = matches.filter((m) => m.winner_id && m.winner_id !== user.id).length
      setWins(wins)
      setLosses(losses)
    }

    fetchProfile()
    fetchStats()
  }, [user])

  const handleEdit = () => setEditing(true)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSave = async () => {
    const updates = {
      name: formData.name,
      bio: formData.bio,
      avatar_url: formData.avatar_url,
    }
    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id)
    if (error) {
      console.error(error)
      toast.error('Failed to update profile')
    } else {
      setProfile((prev) => ({ ...prev, ...updates }))
      setEditing(false)
      toast.success('Profile updated!')
    }
  }

  if (!profile) return <p className="p-4">Loading…</p>

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Your Profile</h1>

      <img
        src={formData.avatar_url || 'https://via.placeholder.com/150'}
        alt="Avatar"
        className="rounded-full w-32 h-32 object-cover mb-4"
      />

      {editing ? (
        <div className="space-y-2">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="border p-2 w-full" />
          <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border p-2 w-full" />
          <input name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio" className="border p-2 w-full" />
          <input name="avatar_url" value={formData.avatar_url} onChange={handleChange} placeholder="Avatar URL" className="border p-2 w-full" />
          <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
        </div>
      ) : (
        <div className="space-y-1">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Wins:</strong> {wins}</p>
          <p><strong>Losses:</strong> {losses}</p>
          <p><strong>Bio:</strong> {profile.bio || 'No bio yet.'}</p>
          <button onClick={handleEdit} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded">Edit</button>
        </div>
      )}
    </div>
  )
}


import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Avatar from '../components/Avatar'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, session, supabase } = useAuth()
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!session) {
      navigate('/login')
      return
    }

    const fetchProfile = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error.message)
        toast.error('Failed to load profile')
      } else {
        setProfile(data)
      }

      setLoading(false)
    }

    fetchProfile()
  }, [session, supabase, user, navigate])

  const handleSave = async () => {
    const { error } = await supabase
      .from('profiles')
      .update({
        name: profile.name,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
      })
      .eq('id', profile.id)

    if (error) {
      console.error('Save error:', error.message)
      toast.error('Failed to save profile')
    } else {
      toast.success('Profile updated')
      setEditing(false)
    }
  }

  const handleAvatarUpload = (url) => {
    setProfile((prev) => ({ ...prev, avatar_url: url }))
    toast.success('Avatar updated!')
  }

  if (loading) return <p>Loading profile…</p>
  if (!profile) return <p>No profile data found.</p>

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

      <Avatar
        url={profile.avatar_url}
        size={120}
        onUpload={handleAvatarUpload}
      />

      <div className="mt-6 space-y-4">
        <div>
          <label className="block font-semibold">Name:</label>
          <input
            type="text"
            value={profile.name || ''}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, name: e.target.value }))
            }
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block font-semibold">Email:</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="border rounded px-3 py-2 w-full bg-gray-100"
          />
        </div>

        <div>
          <label className="block font-semibold">Bio:</label>
          <textarea
            value={profile.bio || ''}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, bio: e.target.value }))
            }
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div className="flex justify-between items-center">
          <div>
            <strong>Wins:</strong> {profile.wins || 0}
            {' · '}
            <strong>Losses:</strong> {profile.losses || 0}
          </div>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}


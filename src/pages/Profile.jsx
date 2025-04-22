// src/pages/Profile.jsx
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../supabaseClient'
import Avatar from '../components/Avatar'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (!user) return
    const fetchProfile = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        toast.error('Failed to load profile')
      } else {
        setProfile(data)
      }
      setLoading(false)
    }
    fetchProfile()
  }, [user])

  const handleUpdate = async (field, value) => {
    setUpdating(true)
    const { error } = await supabase
      .from('profiles')
      .update({ [field]: value })
      .eq('id', user.id)

    if (error) {
      toast.error('Update failed')
    } else {
      toast.success('Profile updated!')
      setProfile({ ...profile, [field]: value })
    }
    setUpdating(false)
  }

  if (loading) return <p>Loading...</p>
  if (!profile) return <p>Profile not found</p>

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
      <Avatar
        url={profile.avatar_url}
        onUpload={(url) => handleUpdate('avatar_url', url)}
        size={100}
      />
      <div className="mt-4 space-y-2">
        <Editable label="Name" value={profile.name} onSave={(val) => handleUpdate('name', val)} />
        <p><strong>Email:</strong> {user.email}</p>
        <Editable label="Bio" value={profile.bio || ''} onSave={(val) => handleUpdate('bio', val)} />
        <p><strong>Wins:</strong> {profile.wins ?? 0}</p>
        <p><strong>Losses:</strong> {profile.losses ?? 0}</p>
      </div>
    </div>
  )
}

function Editable({ label, value, onSave }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  const save = () => {
    onSave(draft)
    setEditing(false)
  }

  return (
    <div>
      <strong>{label}:</strong>{' '}
      {editing ? (
        <>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="border px-2 py-1"
          />
          <button onClick={save} className="ml-2 text-blue-600">Save</button>
        </>
      ) : (
        <span onClick={() => setEditing(true)} className="cursor-pointer text-gray-800">{value || 'Click to edit'}</span>
      )}
    </div>
  )
}


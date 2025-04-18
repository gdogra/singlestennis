import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export const useChallengeService = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createChallenge = async (opponentId, proposedDates) => {
    if (!user) {
      return { success: false, error: 'You must be logged in to create a challenge' }
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('challenges')
        .insert([
          {
            challenger_id: user.id,
            opponent_id: opponentId,
            proposed_dates: proposedDates,
            status: 'pending'
          }
        ])
        .select()

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      setError(error.message)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const getChallenges = async () => {
    if (!user) {
      return { data: [], error: 'You must be logged in to view challenges' }
    }

    try {
      setLoading(true)
      setError(null)

      // Get challenges where the user is either the challenger or the opponent
      const { data, error } = await supabase
        .from('challenges')
        .select(`
          *,
          challenger:challenger_id(id, full_name, avatar_url),
          opponent:opponent_id(id, full_name, avatar_url)
        `)
        .or(`challenger_id.eq.${user.id},opponent_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      setError(error.message)
      return { data: [], error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const respondToChallenge = async (challengeId, response, selectedDate = null) => {
    if (!user) {
      return { success: false, error: 'You must be logged in to respond to a challenge' }
    }

    try {
      setLoading(true)
      setError(null)

      const updates = {
        status: response, // 'accepted', 'declined', or 'rescheduled'
      }

      if (response === 'accepted' && selectedDate) {
        updates.scheduled_date = selectedDate
      }

      const { data, error } = await supabase
        .from('challenges')
        .update(updates)
        .eq('id', challengeId)
        .select()

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      setError(error.message)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  return {
    createChallenge,
    getChallenges,
    respondToChallenge,
    loading,
    error
  }
}

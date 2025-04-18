import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export const useScoreService = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const submitMatchScore = async (matchId, scores, winnerId) => {
    if (!user) {
      return { success: false, error: 'You must be logged in to submit scores' }
    }

    try {
      setLoading(true)
      setError(null)

      // Update the challenge with score information
      const { data, error } = await supabase
        .from('challenges')
        .update({
          status: 'completed',
          scores,
          winner_id: winnerId,
          completed_at: new Date().toISOString()
        })
        .eq('id', matchId)
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

  const getCompletedMatches = async () => {
    if (!user) {
      return { data: [], error: 'You must be logged in to view match history' }
    }

    try {
      setLoading(true)
      setError(null)

      // Get completed matches where the user is either the challenger or the opponent
      const { data, error } = await supabase
        .from('challenges')
        .select(`
          id,
          scheduled_date,
          completed_at,
          scores,
          winner_id,
          challenger:challenger_id(id, full_name, avatar_url),
          opponent:opponent_id(id, full_name, avatar_url)
        `)
        .or(`challenger_id.eq.${user.id},opponent_id.eq.${user.id}`)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      setError(error.message)
      return { data: [], error: error.message }
    } finally {
      setLoading(false)
    }
  }

  return {
    submitMatchScore,
    getCompletedMatches,
    loading,
    error
  }
}

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export const useCalendarService = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getMatches = async (startDate, endDate) => {
    if (!user) {
      return { data: [], error: 'You must be logged in to view matches' }
    }

    try {
      setLoading(true)
      setError(null)

      // Get matches where the user is either the challenger or the opponent
      // and the status is 'accepted'
      const { data, error } = await supabase
        .from('challenges')
        .select(`
          id,
          scheduled_date,
          status,
          challenger:challenger_id(id, full_name, avatar_url),
          opponent:opponent_id(id, full_name, avatar_url)
        `)
        .or(`challenger_id.eq.${user.id},opponent_id.eq.${user.id}`)
        .eq('status', 'accepted')
        .not('scheduled_date', 'is', null)
        .gte('scheduled_date', startDate)
        .lte('scheduled_date', endDate)
        .order('scheduled_date', { ascending: true })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      setError(error.message)
      return { data: [], error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const rescheduleMatch = async (matchId, newDate) => {
    if (!user) {
      return { success: false, error: 'You must be logged in to reschedule matches' }
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('challenges')
        .update({ scheduled_date: newDate })
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

  return {
    getMatches,
    rescheduleMatch,
    loading,
    error
  }
}

import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export const usePlayerService = () => {
  const { user } = useAuth()

  const getPlayers = async (skillFilter = 'all') => {
    try {
      let query = supabase
        .from('profiles')
        .select('id, full_name, skill_level, avatar_url, created_at')
      
      if (skillFilter !== 'all') {
        query = query.eq('skill_level', skillFilter)
      }
      
      // Don't include the current user in the results
      if (user) {
        query = query.neq('id', user.id)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      
      return { data, error: null }
    } catch (error) {
      console.error('Error in getPlayers:', error.message)
      return { data: null, error: error.message }
    }
  }

  const getPlayerById = async (playerId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, skill_level, avatar_url, created_at')
        .eq('id', playerId)
        .single()
      
      if (error) throw error
      
      return { data, error: null }
    } catch (error) {
      console.error('Error in getPlayerById:', error.message)
      return { data: null, error: error.message }
    }
  }

  const getPlayerStats = async (playerId) => {
    try {
      // This is a placeholder for the actual implementation
      // In a real app, we would query the matches table to calculate stats
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Return mock data for now
      return { 
        data: {
          matches_count: Math.floor(Math.random() * 20),
          wins: Math.floor(Math.random() * 15),
          losses: Math.floor(Math.random() * 10),
          win_rate: `${Math.floor(Math.random() * 100)}%`
        }, 
        error: null 
      }
    } catch (error) {
      console.error('Error in getPlayerStats:', error.message)
      return { data: null, error: error.message }
    }
  }

  return {
    getPlayers,
    getPlayerById,
    getPlayerStats
  }
}

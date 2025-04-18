import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export const useLeaderboardService = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all completed matches
      const { data: matches, error: matchesError } = await supabase
        .from('challenges')
        .select(`
          id,
          challenger_id,
          opponent_id,
          winner_id,
          scores
        `)
        .eq('status', 'completed');

      if (matchesError) throw matchesError;

      // Get all players
      const { data: players, error: playersError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, skill_level');

      if (playersError) throw playersError;

      // Calculate stats for each player
      const playerStats = {};
      
      // Initialize stats for all players
      players.forEach(player => {
        playerStats[player.id] = {
          id: player.id,
          full_name: player.full_name,
          avatar_url: player.avatar_url,
          skill_level: player.skill_level,
          matches_played: 0,
          matches_won: 0,
          win_rate: 0,
          sets_won: 0,
          games_won: 0
        };
      });

      // Calculate stats from matches
      matches.forEach(match => {
        const challengerId = match.challenger_id;
        const opponentId = match.opponent_id;
        const winnerId = match.winner_id;
        
        // Increment matches played
        if (playerStats[challengerId]) {
          playerStats[challengerId].matches_played++;
          if (winnerId === challengerId) {
            playerStats[challengerId].matches_won++;
          }
        }
        
        if (playerStats[opponentId]) {
          playerStats[opponentId].matches_played++;
          if (winnerId === opponentId) {
            playerStats[opponentId].matches_won++;
          }
        }
        
        // Calculate sets and games won
        if (match.scores && Array.isArray(match.scores)) {
          match.scores.forEach(set => {
            if (set.challenger && set.opponent) {
              const challengerScore = parseInt(set.challenger);
              const opponentScore = parseInt(set.opponent);
              
              if (!isNaN(challengerScore) && !isNaN(opponentScore)) {
                // Add games won
                if (playerStats[challengerId]) {
                  playerStats[challengerId].games_won += challengerScore;
                }
                
                if (playerStats[opponentId]) {
                  playerStats[opponentId].games_won += opponentScore;
                }
                
                // Add sets won
                if (challengerScore > opponentScore) {
                  if (playerStats[challengerId]) {
                    playerStats[challengerId].sets_won++;
                  }
                } else if (opponentScore > challengerScore) {
                  if (playerStats[opponentId]) {
                    playerStats[opponentId].sets_won++;
                  }
                }
              }
            }
          });
        }
      });

      // Calculate win rates and prepare final array
      const leaderboardArray = Object.values(playerStats)
        .map(player => {
          // Calculate win rate (avoid division by zero)
          if (player.matches_played > 0) {
            player.win_rate = (player.matches_won / player.matches_played) * 100;
          }
          return player;
        })
        // Sort by matches won (descending), then by win rate (descending)
        .sort((a, b) => {
          if (b.matches_won !== a.matches_won) {
            return b.matches_won - a.matches_won;
          }
          return b.win_rate - a.win_rate;
        });

      return { data: leaderboardArray, error: null };
    } catch (error) {
      setError(error.message);
      return { data: [], error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    getLeaderboard,
    loading,
    error
  };
};

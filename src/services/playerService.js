// src/services/playerService.js

import { supabase } from '../lib/supabase'

/**
 * Fetch all player profiles from Supabase.
 * @returns {Promise<
 *   Array<{
 *     id: string,
 *     name: string,
 *     avatar_url: string | null,
 *     skill_level: string
 *   }>
 * >}
 * @throws {Error} if the Supabase query fails
 */
export async function getPlayers() {
  // Select exactly the columns your table actually has
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, avatar_url, skill_level')

  if (error) {
    console.error('Error in getPlayers:', error.message)
    // Propagate the error so callers can handle it
    throw error
  }

  return data
}


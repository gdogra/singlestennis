import { supabase } from './_client.mjs';

const matches = [
  {
    player1: 'demo-1',
    player2: 'demo-2',
    winner: 'demo-1',
    score: '6-4, 6-2',
    date: '2024-03-10',
  },
  {
    player1: 'demo-3',
    player2: 'demo-4',
    winner: 'demo-4',
    score: '4-6, 6-3, 7-5',
    date: '2024-03-12',
  },
  {
    player1: 'demo-5',
    player2: 'demo-6',
    winner: 'demo-6',
    score: '7-6, 6-4',
    date: '2024-03-15',
  },
];

for (const match of matches) {
  const { error } = await supabase.from('matches').insert({
    player1_id: match.player1,
    player2_id: match.player2,
    winner_id: match.winner,
    score: match.score,
    played_at: match.date,
  });

  if (error) {
    console.error(`❌ Failed to insert match:`, error.message);
  } else {
    console.log(`✅ Match inserted: ${match.player1} vs ${match.player2}`);
  }
}


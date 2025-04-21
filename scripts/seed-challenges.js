import { supabase } from './_client.mjs';

const challenges = [
  {
    sender_id: 'demo-2',
    receiver_id: 'demo-1',
    status: 'pending',
    scheduled_date: '2024-04-22',
  },
  {
    sender_id: 'demo-4',
    receiver_id: 'demo-3',
    status: 'accepted',
    scheduled_date: '2024-04-23',
  },
];

for (const challenge of challenges) {
  const { error } = await supabase.from('challenges').insert({
    sender_id: challenge.sender_id,
    receiver_id: challenge.receiver_id,
    status: challenge.status,
    scheduled_date: challenge.scheduled_date,
  });

  if (error) {
    console.error(`❌ Challenge insert failed:`, error.message);
  } else {
    console.log(`✅ Challenge from ${challenge.sender_id} → ${challenge.receiver_id}`);
  }
}


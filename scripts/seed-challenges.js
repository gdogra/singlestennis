// scripts/seed-challenges.js
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const challenges = [
  {
    challengerEmail: "alice@example.com",
    opponentEmail: "bob@example.com",
    message: "Ready for a rematch?",
    scheduled_date: new Date().toISOString(),
  },
  {
    challengerEmail: "carol@example.com",
    opponentEmail: "dave@example.com",
    message: "Up for a challenge?",
    scheduled_date: new Date().toISOString(),
  },
];

async function getProfileByEmail(email) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    console.error(`❌ Error finding profile for ${email}:`, error);
    return null;
  }

  if (!data) {
    console.warn(`⚠️ No profile found for ${email}`);
    return null;
  }

  return data;
}

async function seed() {
  for (const challenge of challenges) {
    const challenger = await getProfileByEmail(challenge.challengerEmail);
    const opponent = await getProfileByEmail(challenge.opponentEmail);

    if (!challenger || !opponent) {
      console.warn(
        `⚠️ Skipping challenge between ${challenge.challengerEmail} and ${challenge.opponentEmail}`
      );
      continue;
    }

    const { error } = await supabase.from("challenges").insert([
      {
        id: uuidv4(),
        challenger_id: challenger.id,
        opponent_id: opponent.id,
        message: challenge.message,
        scheduled_date: challenge.scheduled_date,
        status: "pending",
      },
    ]);

    if (error) {
      console.error(`❌ Failed to insert challenge:`, error);
    } else {
      console.log(`✅ Challenge inserted from ${challenge.message}`);
    }
  }

  console.log("🎯 Done seeding challenges");
}

seed();


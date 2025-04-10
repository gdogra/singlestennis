import psycopg2
import random
from datetime import datetime, timedelta

# Connect to your PostgreSQL database
conn = psycopg2.connect(
    dbname="postgres",
    user="postgres",
    password="pos_brthe_O2",
    host="localhost",
    port="5432"
)
cur = conn.cursor()

# Get all existing user IDs
cur.execute("SELECT id FROM users")
user_ids = [row[0] for row in cur.fetchall()]

def generate_score():
    sets = []
    player1_sets = 0
    player2_sets = 0

    while player1_sets < 2 and player2_sets < 2:
        p1_games = random.randint(6, 7)
        p2_games = random.randint(0, 5)

        if p2_games == p1_games:
            p2_games = p1_games - 1  # avoid tie

        if p1_games > p2_games:
            player1_sets += 1
        else:
            player2_sets += 1

        sets.append(f"{p1_games}-{p2_games}")

    return sets, 1 if player1_sets > player2_sets else 2

# Seed 20 matches
for _ in range(20):
    p1, p2 = random.sample(user_ids, 2)
    match_date = datetime.now() - timedelta(days=random.randint(0, 60))
    sets, winner_flag = generate_score()
    winner_id = p1 if winner_flag == 1 else p2
    score = ", ".join(sets)

    cur.execute("""
        INSERT INTO matches (player1_id, player2_id, match_date, status, winner_id, score)
        VALUES (%s, %s, %s, 'completed', %s, %s)
    """, (p1, p2, match_date.date(), winner_id, score))

conn.commit()
cur.close()
conn.close()
print("✅ Seeded 20 matches successfully.")


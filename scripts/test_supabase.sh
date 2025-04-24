#!/usr/bin/env bash
set -euo pipefail

# 1) Load from .env
export VITE_SUPABASE_URL=$(grep '^VITE_SUPABASE_URL=' .env | cut -d= -f2-)
export VITE_SUPABASE_ANON_KEY=$(grep '^VITE_SUPABASE_ANON_KEY=' .env | cut -d= -f2-)
export SUPABASE_SERVICE_ROLE_KEY=$(grep '^SUPABASE_SERVICE_ROLE_KEY=' .env | cut -d= -f2-)

# 2) Sign up user (idempotent)
echo "➤ Signing up demo@domain.com…"
SIGNUP_RESPONSE=$(
  curl -s -X POST "$VITE_SUPABASE_URL/auth/v1/signup" \
    -H "apikey: $VITE_SUPABASE_ANON_KEY" \
    -H "Content-Type: application/json" \
    --data '{"email":"demo@domain.com","password":"secret-password"}'
)
echo "$SIGNUP_RESPONSE" | jq .

# 3) Extract USER_ID
USER_ID=$(echo "$SIGNUP_RESPONSE" | jq -r '.id // .user.id')
echo "➤ USER_ID = $USER_ID"

# 4) Confirm email via Admin API
echo "➤ Confirming email for $USER_ID…"
curl -s -X PUT "$VITE_SUPABASE_URL/auth/v1/admin/users/$USER_ID" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  --data '{"email_confirmed":true}' \
| jq .

# 5) Sign in to get JWT
echo "➤ Signing in…"
LOGIN_RESPONSE=$(
  curl -s -X POST "$VITE_SUPABASE_URL/auth/v1/token?grant_type=password" \
    -H "apikey: $VITE_SUPABASE_ANON_KEY" \
    -H "Content-Type: application/json" \
    --data '{"email":"demo@domain.com","password":"secret-password"}'
)
echo "🔹 Sign-in response:"
echo "$LOGIN_RESPONSE" | jq .

# 6) Extract token and user ID
ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r .access_token)
USER_ID=$(echo "$LOGIN_RESPONSE" | jq -r .user.id)
echo "✅ ACCESS_TOKEN has $(echo "$ACCESS_TOKEN" | grep -o '\.' | wc -l) dots (should be 2)"
echo "✅ USER_ID: $USER_ID"

# 7) Fetch profile
echo "➤ Fetching profile…"
curl -s "$VITE_SUPABASE_URL/rest/v1/profiles?id=eq.$USER_ID&select=*" \
  -H "apikey: $VITE_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
| jq .


--- a/src/pages/Profile.jsx
+++ b/src/pages/Profile.jsx
@@ export default function ProfilePage() {
-  useEffect(() => {
-    async function loadData() {
-      try {
-        const {
-          data: { user },
-          error: userErr,
-        } = await supabase.auth.getUser();
-        if (userErr) throw userErr;
-        const profileId = id || user.id;
+  useEffect(() => {
+    async function loadData() {
+      try {
+        // If there's no :id param, grab the current session
+        let profileId = id;
+        if (!profileId) {
+          const {
+            data: { session },
+            error: sessionErr,
+          } = await supabase.auth.getSession();
+          if (sessionErr || !session) {
+            toast.error('You must be signed in to view your profile.');
+            return;
+          }
+          profileId = session.user.id;
+        }
 
-        // 1) Fetch the profile
+        // 1) Fetch the profile by profileId
         const { data: profData, error: profErr } = await supabase
           .from('profiles')
           .select('id, name, avatar_url, skill_level')
-          .eq('id', profileId)
+          .eq('id', profileId)
           .single();
         if (profErr) throw profErr;
         setProfile(profData);
@@
-        // 2) Fetch matches with joined profile names
+        // 2) Fetch matches (joining in the player names)
         const { data: matchData, error: matchErr } = await supabase
           .from('matches')
           .select(`
             id,
             played_at,
             winner_id,
             player1:player1_id ( name ),
             player2:player2_id ( name )
           `)
-          .or(`player1_id.eq.${profileId},player2_id.eq.${profileId}`)
+          .or(`player1_id.eq.${profileId},player2_id.eq.${profileId}`)
           .order('played_at', { ascending: false });
         if (matchErr) throw matchErr;
         setMatches(matchData || []);


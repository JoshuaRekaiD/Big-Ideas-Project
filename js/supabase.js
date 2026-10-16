/* =========================================================
   BIRP — Supabase client
   Initialises once and is used by main.js across all pages.
   The anon/public key is safe to include here — Supabase
   security is enforced via Row Level Security on the tables.
   NEVER put the service_role / secret key here.
   ========================================================= */

const SUPABASE_URL = 'https://osgxmzylloeptnvdmqsf.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zZ3htenlsbG9lcHRudmRtcXNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0MzE0NzAsImV4cCI6MjEwNzAwNzQ3MH0.N5tmEmPO8A_STwdOwUp_5vqGO9CXwm3yYWezy4bIa_w'

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

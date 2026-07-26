-- User [ENT-1]: app-level profile row keyed by Supabase Auth's auth.users.id.
-- Credentials (password) are owned entirely by Supabase Auth; this table never
-- stores a password/password_hash (see decisions.md 2026-07-26).
CREATE TABLE public.users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  bio TEXT,
  experience_years INT,
  certifications TEXT[],
  links JSONB,
  visibility_settings JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO authenticated;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- NFR-5: restrict account data to the owning authenticated user only.
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile" ON public.users
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

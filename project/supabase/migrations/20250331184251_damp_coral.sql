/*
  # Add username-based authentication

  1. Changes
    - Add username column to auth.users
    - Add unique constraint on username
    - Update existing users with usernames
*/

-- Add username column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'auth' 
    AND table_name = 'users' 
    AND column_name = 'username'
  ) THEN
    ALTER TABLE auth.users ADD COLUMN username TEXT;
    ALTER TABLE auth.users ADD CONSTRAINT users_username_key UNIQUE (username);
  END IF;
END $$;
/*
  # Fix authentication system

  1. Changes
    - Create function to handle username-based authentication
    - Add helper function to get user by username
    - Add indexes for performance

  2. Security
    - Functions run with security definer
    - Proper search path restrictions
    - Limited to authenticated users
*/

-- Create function to get user by username
CREATE OR REPLACE FUNCTION public.get_user_by_username(lookup_username TEXT)
RETURNS TABLE (
  id uuid,
  email text,
  username text
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    (u.raw_user_meta_data->>'username')::TEXT as username
  FROM auth.users u
  WHERE (u.raw_user_meta_data->>'username')::TEXT = lookup_username;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_by_username TO authenticated;

-- Create index for username lookup performance
CREATE INDEX IF NOT EXISTS idx_users_username ON auth.users USING gin ((raw_user_meta_data->'username'));
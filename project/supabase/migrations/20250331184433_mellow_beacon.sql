/*
  # Create secure auth function for username lookup

  1. Changes
    - Create a secure function to lookup user email by username
    - Function is accessible only to authenticated users
    - Function only returns email if it matches the requesting user

  2. Security
    - Function executes with security definer to access auth schema
    - Row-level security ensures users can only look up their own data
*/

-- Create function to securely lookup user email by username
CREATE OR REPLACE FUNCTION public.get_user_email_by_username(lookup_username TEXT)
RETURNS TABLE (email TEXT)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only allow authenticated users
  IF auth.role() = 'authenticated' THEN
    RETURN QUERY
    SELECT u.email::TEXT
    FROM auth.users u
    WHERE (u.raw_user_meta_data->>'username')::TEXT = lookup_username
    AND u.id = auth.uid();
  ELSE
    RETURN;
  END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_email_by_username TO authenticated;
/*
  # Create auth view for username lookup

  1. Changes
    - Create a view to safely expose user email and username
    - Add RLS policy to protect user data
*/

-- Create view for user authentication
CREATE OR REPLACE VIEW public.user_auth_view AS
SELECT 
  id,
  email,
  raw_user_meta_data->>'username' as username
FROM auth.users;

-- Enable RLS
ALTER VIEW public.user_auth_view SET (security_invoker = true);

-- Add RLS policy
CREATE POLICY "Allow users to view their own data"
ON public.user_auth_view
FOR SELECT
TO authenticated
USING (auth.uid() = id);

GRANT SELECT ON public.user_auth_view TO authenticated;
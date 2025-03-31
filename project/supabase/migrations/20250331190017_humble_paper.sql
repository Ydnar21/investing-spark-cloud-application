/*
  # Fix authentication system

  1. Changes
    - Delete existing portfolios for test users
    - Clean up existing test users
    - Create fresh test users with proper credentials

  2. Security
    - Ensure passwords are properly hashed
    - Set up email confirmation
*/

-- First, clean up any existing portfolios for test users
DELETE FROM public.portfolios
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('karl@example.com', 'karl@user.local', 'test@user.local')
  OR raw_user_meta_data->>'username' IN ('karl', 'test')
);

-- Then clean up the test users
DELETE FROM auth.users 
WHERE email IN ('karl@example.com', 'karl@user.local', 'test@user.local')
OR raw_user_meta_data->>'username' IN ('karl', 'test');

-- Create test users with proper credentials
DO $$
BEGIN
  -- Create karl user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'karl@user.local',
    crypt('karl123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"username":"karl"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  );

  -- Create test user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'test@user.local',
    crypt('test123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"username":"test"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  );
END $$;
/*
  # Set up test accounts

  1. Changes
    - Delete existing portfolios for test users
    - Clean up existing test users
    - Create test accounts with specified credentials:
      - test/test
      - randy/admin
      - karl/karl

  2. Security
    - Ensure passwords are properly hashed
    - Set up email confirmation
*/

-- First, clean up any existing portfolios for test users
DELETE FROM public.portfolios
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('test@user.local', 'randy@user.local', 'karl@user.local')
  OR raw_user_meta_data->>'username' IN ('test', 'randy', 'karl')
);

-- Then clean up the test users
DELETE FROM auth.users 
WHERE email IN ('test@user.local', 'randy@user.local', 'karl@user.local')
OR raw_user_meta_data->>'username' IN ('test', 'randy', 'karl');

-- Create test users with proper credentials
DO $$
BEGIN
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
    crypt('test', gen_salt('bf')),
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

  -- Create randy user
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
    'randy@user.local',
    crypt('admin', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"username":"randy"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  );

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
    crypt('karl', gen_salt('bf')),
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
END $$;
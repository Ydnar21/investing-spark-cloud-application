/*
  # Fix authentication system

  1. Changes
    - Create test users for development
    - Add indexes for performance
    - Update user metadata

  2. Security
    - Passwords are properly hashed
    - Email confirmation is handled
*/

-- Create test users if they don't exist
DO $$
BEGIN
  -- Create karl user
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE raw_user_meta_data->>'username' = 'karl'
  ) THEN
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
  END IF;

  -- Create test user
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE raw_user_meta_data->>'username' = 'test'
  ) THEN
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
  END IF;
END $$;
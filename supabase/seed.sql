-- Seed test users for local development
-- Password for all test accounts: password123

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  email_change,
  email_change_token_new,
  email_change_token_current,
  confirmation_token,
  recovery_token,
  reauthentication_token,
  phone_change,
  phone_change_token,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_sso_user,
  is_anonymous
) values (
  '00000000-0000-0000-0000-000000000000',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'authenticated',
  'authenticated',
  'alice@test.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '', '', '', '', '', '', '', '',
  now(), now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Alice Johnson"}',
  false, false
), (
  '00000000-0000-0000-0000-000000000000',
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  'authenticated',
  'authenticated',
  'bob@test.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '', '', '', '', '', '', '', '',
  now(), now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Bob Smith"}',
  false, false
), (
  '00000000-0000-0000-0000-000000000000',
  'c3d4e5f6-a7b8-9012-cdef-123456789012',
  'authenticated',
  'authenticated',
  'charlie@test.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '', '', '', '', '', '', '', '',
  now(), now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Charlie Davies"}',
  false, false
);

-- Insert identities for each user (required for email/password login)
insert into auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  created_at,
  updated_at,
  last_sign_in_at
) values (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  jsonb_build_object('sub', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'email', 'alice@test.com'),
  'email',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  now(),
  now(),
  now()
), (
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  jsonb_build_object('sub', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'email', 'bob@test.com'),
  'email',
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  now(),
  now(),
  now()
), (
  'c3d4e5f6-a7b8-9012-cdef-123456789012',
  'c3d4e5f6-a7b8-9012-cdef-123456789012',
  jsonb_build_object('sub', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'email', 'charlie@test.com'),
  'email',
  'c3d4e5f6-a7b8-9012-cdef-123456789012',
  now(),
  now(),
  now()
);

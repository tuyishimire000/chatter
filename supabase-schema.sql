-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'admin')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
-- Users can only read their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (phone_number = current_setting('app.current_user_phone', true));

-- RLS Policies for messages
-- Users can only read their own messages
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (user_id IN (
    SELECT id FROM profiles WHERE phone_number = current_setting('app.current_user_phone', true)
  ));

-- Users can insert their own messages
CREATE POLICY "Users can insert own messages" ON messages
  FOR INSERT WITH CHECK (user_id IN (
    SELECT id FROM profiles WHERE phone_number = current_setting('app.current_user_phone', true)
  ));

-- Admin can read all messages
CREATE POLICY "Admin can view all messages" ON messages
  FOR SELECT USING (current_setting('app.current_user_phone', true) = current_setting('app.admin_phone', true));

-- Admin can insert messages for any user
CREATE POLICY "Admin can insert messages" ON messages
  FOR INSERT WITH CHECK (current_setting('app.current_user_phone', true) = current_setting('app.admin_phone', true));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_phone_number ON profiles(phone_number);

-- Insert sample admin profile (replace with your actual admin phone number)
-- INSERT INTO profiles (phone_number) VALUES ('+1234567890') ON CONFLICT (phone_number) DO NOTHING;

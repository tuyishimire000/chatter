import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    // Create presence table
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS presence (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
          is_online BOOLEAN DEFAULT false,
          last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          is_typing BOOLEAN DEFAULT false,
          typing_for_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (createError) {
      console.error('Error creating presence table:', createError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to create presence table',
        details: createError.message 
      })
    }

    // Enable RLS
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE presence ENABLE ROW LEVEL SECURITY;'
    })

    if (rlsError) {
      console.error('Error enabling RLS:', rlsError)
    }

    // Create RLS policies
    const { error: policy1Error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY IF NOT EXISTS "Users can manage own presence" ON presence
        FOR ALL USING (user_id IN (
          SELECT id FROM profiles WHERE phone_number = current_setting('app.current_user_phone', true)
        ));
      `
    })

    const { error: policy2Error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY IF NOT EXISTS "Admin can view all presence" ON presence
        FOR SELECT USING (current_setting('app.current_user_phone', true) = current_setting('app.admin_phone', true));
      `
    })

    return NextResponse.json({
      success: true,
      message: 'Presence table created successfully',
      errors: {
        rls: rlsError?.message,
        policy1: policy1Error?.message,
        policy2: policy2Error?.message
      }
    })

  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Setup failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

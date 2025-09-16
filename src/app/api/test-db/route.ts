import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('Testing database connection...')
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    // Test basic connection
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error
      })
    }

    // Get all profiles to see what's in the database
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(10)

    if (profilesError) {
      console.error('Profiles query error:', profilesError)
      return NextResponse.json({
        success: false,
        error: profilesError.message,
        details: profilesError
      })
    }

    console.log('Database connection successful')
    console.log('Profiles in database:', profiles)

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      profiles: profiles,
      count: profiles?.length || 0
    })
  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Connection test failed',
      details: error
    })
  }
}

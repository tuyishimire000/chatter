import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        supabaseUrl: !!supabaseUrl,
        supabaseKey: !!supabaseKey
      })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Test with service role key (bypasses RLS)
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (serviceKey) {
      const supabaseAdmin = createClient(supabaseUrl, serviceKey)
      
      const { data: adminProfiles, error: adminError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .limit(10)

      return NextResponse.json({
        success: true,
        message: 'Using service role key',
        profiles: adminProfiles,
        count: adminProfiles?.length || 0,
        error: adminError
      })
    }

    // Test with anon key
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(10)

    return NextResponse.json({
      success: true,
      message: 'Using anon key',
      profiles: profiles,
      count: profiles?.length || 0,
      error: profilesError,
      rlsEnabled: profilesError?.message?.includes('RLS') || false
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error
    })
  }
}

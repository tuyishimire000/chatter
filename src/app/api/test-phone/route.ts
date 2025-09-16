import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test with one of the phone numbers from your database
    const testPhone = '+250782811451'
    
    console.log('Testing phone number:', testPhone)
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('phone_number', testPhone)
      .single()

    console.log('Query result:', { profile, error })

    return NextResponse.json({
      success: true,
      testPhone: testPhone,
      profile: profile,
      error: error,
      found: !!profile
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error
    })
  }
}

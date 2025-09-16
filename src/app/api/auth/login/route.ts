import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json()

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    console.log('Checking phone number:', phoneNumber)

    // Check if phone number exists in profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('phone_number', phoneNumber)
      .single()

    console.log('Database response:', { profile, error })

    if (error || !profile) {
      console.log('Phone number not found in database')
      return NextResponse.json(
        { error: 'Phone number not found' },
        { status: 404 }
      )
    }

    console.log('Phone number found, returning profile:', profile)

    return NextResponse.json({
      success: true,
      profile: {
        id: profile.id,
        phone_number: profile.phone_number,
        created_at: profile.created_at
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

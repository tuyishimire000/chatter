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

    // Check if phone number exists in profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('phone_number', phoneNumber)
      .single()

    if (error || !profile) {
      return NextResponse.json(
        { error: 'Phone number not found' },
        { status: 404 }
      )
    }

    // Set session context for RLS
    await supabase.rpc('set_current_user_phone', { phone: phoneNumber })

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

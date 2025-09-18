import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, userId } = await request.json()

    if (!phoneNumber || !userId) {
      return NextResponse.json(
        { success: false, error: 'Phone number and user ID are required' },
        { status: 400 }
      )
    }

    // Verify the user exists and matches the stored data
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('phone_number', phoneNumber)
      .eq('id', userId)
      .single()

    if (error || !profile) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if admin
    const isAdmin = phoneNumber === process.env.NEXT_PUBLIC_ADMIN_PHONE

    return NextResponse.json({
      success: true,
      profile: {
        id: profile.id,
        phone_number: profile.phone_number,
        name: profile.name,
        created_at: profile.created_at
      },
      isAdmin
    })
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

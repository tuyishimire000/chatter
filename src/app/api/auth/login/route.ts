import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json()

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    // For now, return a mock response to test the API route
    return NextResponse.json({
      success: true,
      profile: {
        id: 'mock-id',
        phone_number: phoneNumber,
        created_at: new Date().toISOString()
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

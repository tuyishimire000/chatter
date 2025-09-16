import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json()
    
    return NextResponse.json({
      success: true,
      message: 'API route is working',
      phoneNumber: phoneNumber,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error
    })
  }
}

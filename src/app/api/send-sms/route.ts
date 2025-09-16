import { NextRequest, NextResponse } from 'next/server'

interface MistaSMSResponse {
  success: boolean
  message_id?: string
  error?: string
}

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, message } = await request.json()

    if (!phoneNumber || !message) {
      return NextResponse.json(
        { success: false, error: 'Phone number and message are required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.MISTA_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'Mista API key not configured'
      })
    }

    console.log('Sending SMS to:', phoneNumber)
    console.log('Message:', message)

    const response = await fetch('https://api.mista.io/sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        to: phoneNumber,
        message: message,
        from: process.env.MISTA_SENDER_ID || 'LuxuryChat'
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Mista API error:', response.status, errorText)
      throw new Error(`Mista API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('SMS sent successfully:', data)

    return NextResponse.json({
      success: true,
      message_id: data.message_id || data.id
    })
  } catch (error) {
    console.error('SMS sending failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

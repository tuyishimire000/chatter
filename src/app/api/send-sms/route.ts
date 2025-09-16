import { NextRequest, NextResponse } from 'next/server'

interface MistaSMSResponse {
  success: boolean
  message_id?: string
  error?: string
}

// Store recent SMS requests to prevent duplicates
const recentSMS = new Map<string, number>()

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, message } = await request.json()

    if (!phoneNumber || !message) {
      return NextResponse.json(
        { success: false, error: 'Phone number and message are required' },
        { status: 400 }
      )
    }

    // Create a unique key for this SMS request
    const smsKey = `${phoneNumber}-${message}`
    const now = Date.now()
    
    // Check if this exact SMS was sent recently (within 30 seconds)
    if (recentSMS.has(smsKey) && now - recentSMS.get(smsKey)! < 30000) {
      console.log('Duplicate SMS prevented:', smsKey)
      return NextResponse.json({
        success: false,
        error: 'Duplicate SMS prevented - same message sent recently'
      })
    }
    
    // Store this SMS request
    recentSMS.set(smsKey, now)
    
    // Clean up old entries (older than 5 minutes)
    for (const [key, timestamp] of recentSMS.entries()) {
      if (now - timestamp > 300000) {
        recentSMS.delete(key)
      }
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

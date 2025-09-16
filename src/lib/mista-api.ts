interface MistaSMSResponse {
  success: boolean
  message_id?: string
  error?: string
}

export async function sendSMS(phoneNumber: string, message: string): Promise<MistaSMSResponse> {
  try {
    const apiKey = process.env.MISTA_API_KEY
    if (!apiKey) {
      return { success: false, error: 'Mista API key not configured' }
    }

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
      throw new Error(`Mista API error: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, message_id: data.message_id }
  } catch (error) {
    console.error('SMS sending failed:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

export function formatSMSMessage(content: string, websiteUrl: string): string {
  return `${content}\n\nReply at: ${websiteUrl}`
}

interface MistaSMSResponse {
  success: boolean
  message_id?: string
  error?: string
}

export async function sendSMS(phoneNumber: string, message: string): Promise<MistaSMSResponse> {
  try {
    console.log('Sending SMS via API route - v2')
    // For client-side, we need to make an API call to the server
    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber,
        message
      })
    })

    if (!response.ok) {
      throw new Error(`SMS API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('SMS sending failed:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

export function formatSMSMessage(content: string, websiteUrl: string): string {
  return `Hilbert: ${content}\n\nThis is the only way to reach me. Reply at: ${websiteUrl}\n\nEnter your MTN number to chat with me.`
}
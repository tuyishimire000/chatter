import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test basic message fetching
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .limit(5)

    // Test presence table access
    let presenceData = null
    let presenceError = null
    try {
      const { data, error } = await supabase
        .from('presence')
        .select('*')
        .limit(5)
      presenceData = data
      presenceError = error
    } catch (err) {
      presenceError = err
    }

    // Test profiles access
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5)

    return NextResponse.json({
      success: true,
      messages: {
        data: messages,
        error: messagesError?.message,
        count: messages?.length || 0
      },
      presence: {
        data: presenceData,
        error: presenceError instanceof Error ? presenceError.message : presenceError,
        count: presenceData?.length || 0
      },
      profiles: {
        data: profiles,
        error: profilesError?.message,
        count: profiles?.length || 0
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

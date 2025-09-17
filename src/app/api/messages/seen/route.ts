import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { messageIds, seenBy } = await request.json()

    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message IDs are required' },
        { status: 400 }
      )
    }

    if (!seenBy || !['user', 'admin'].includes(seenBy)) {
      return NextResponse.json(
        { success: false, error: 'seenBy must be "user" or "admin"' },
        { status: 400 }
      )
    }

    const now = new Date().toISOString()

    // Update messages to mark them as seen
    const { error } = await supabase
      .from('messages')
      .update({
        seen_at: now,
        seen_by: seenBy
      })
      .in('id', messageIds)

    if (error) {
      console.error('Error marking messages as seen:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to mark messages as seen' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Messages marked as read',
      readAt: now
    })
  } catch (error) {
    console.error('Error in seen API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

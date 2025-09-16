import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { userId, isOnline } = await request.json()
    
    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID required' })
    }

    // Update or create presence record
    const { error } = await supabase
      .from('presence')
      .upsert({
        user_id: userId,
        is_online: isOnline,
        last_seen: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error updating presence:', error)
      return NextResponse.json({ success: false, error: error.message })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Presence API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    })
  }
}

export async function GET() {
  try {
    // Get all online users
    const { data: presence, error } = await supabase
      .from('presence')
      .select(`
        *,
        profiles!presence_user_id_fkey (
          id,
          name,
          phone_number
        )
      `)
      .eq('is_online', true)

    if (error) {
      console.error('Error fetching presence:', error)
      return NextResponse.json({ success: false, error: error.message })
    }

    return NextResponse.json({ success: true, presence: presence || [] })
  } catch (error) {
    console.error('Presence GET error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    })
  }
}

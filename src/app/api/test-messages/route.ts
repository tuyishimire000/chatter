import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const userPhone = searchParams.get('userPhone')

    if (userId) {
      // Get messages for specific user
      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles!messages_user_id_fkey (
            name,
            phone_number
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: true })

      if (error) {
        return NextResponse.json({ success: false, error: error.message })
      }

      return NextResponse.json({ 
        success: true, 
        messages: messages || [],
        count: messages?.length || 0
      })
    } else if (userPhone) {
      // Get all messages for admin
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (profiles) {
        const usersWithMessages = await Promise.all(
          profiles.map(async (profile) => {
            const { data: messages } = await supabase
              .from('messages')
              .select('*')
              .eq('user_id', profile.id)
              .order('created_at', { ascending: false })

            const unreadCount = messages?.filter(
              (msg) => msg.sender === 'user'
            ).length || 0

            return {
              ...profile,
              messages: messages || [],
              unreadCount,
              isOnline: false,
              isTyping: false
            }
          })
        )

        console.log('Admin API returning users:', usersWithMessages.length)
        usersWithMessages.forEach(user => {
          console.log(`User ${user.name}: ${user.messages.length} messages, ${user.unreadCount} unread`)
        })

        return NextResponse.json({ 
          success: true, 
          users: usersWithMessages,
          count: usersWithMessages.length
        })
      }
    }

    return NextResponse.json({ success: false, error: 'Missing userId or userPhone' })
  } catch (error) {
    console.error('Test messages error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    })
  }
}

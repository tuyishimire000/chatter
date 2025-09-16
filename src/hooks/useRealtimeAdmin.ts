import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase, Message, Profile } from '@/lib/supabase'

interface UserWithMessages extends Profile {
  messages: Message[]
  unreadCount: number
  isOnline?: boolean
  isTyping?: boolean
}

interface RealtimeMessage extends Message {
  profiles?: {
    name: string
    phone_number: string
  }
}

export function useRealtimeAdmin() {
  const [users, setUsers] = useState<UserWithMessages[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (profiles) {
        // Get online status
        const { data: presence } = await supabase
          .from('presence')
          .select('user_id, is_online')
          .eq('is_online', true)

        const onlineUsers = new Set(presence?.map(p => p.user_id) || [])

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
              isOnline: onlineUsers.has(profile.id),
              isTyping: false
            }
          })
        )

        setUsers(usersWithMessages)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Set up real-time connection
  useEffect(() => {
    fetchUsers()

    // Refresh online status every 10 seconds
    const statusInterval = setInterval(() => {
      fetchUsers()
    }, 10000)

    // Create SSE connection for admin
    const userPhone = localStorage.getItem('user_phone')
    const url = new URL('/api/messages/stream', window.location.origin)
    url.searchParams.set('userPhone', userPhone || '')

    const eventSource = new EventSource(url.toString())
    eventSourceRef.current = eventSource

    eventSource.onopen = () => {
      console.log('Admin SSE connection opened')
      setIsConnected(true)
    }

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        
        switch (data.type) {
          case 'connected':
            console.log('Admin connected to real-time stream')
            break
            
          case 'subscribed':
            console.log('Admin subscribed to message updates')
            break
            
          case 'message':
            const message = data.message as RealtimeMessage
            console.log('New message for admin:', message)
            
            // Update users with new message
            setUsers(prev => prev.map(user => {
              if (user.id === message.user_id) {
                const exists = user.messages.some(msg => msg.id === message.id)
                if (!exists) {
                  // Sort messages by created_at descending for admin view
                  const newMessages = [message, ...user.messages].sort((a, b) => 
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                  )
                  return {
                    ...user,
                    messages: newMessages,
                    unreadCount: message.sender === 'user' ? user.unreadCount + 1 : user.unreadCount
                  }
                }
              }
              return user
            }))
            break
            
          case 'heartbeat':
            // Keep connection alive
            break
            
          case 'error':
            console.error('Admin SSE Error:', data.error)
            break
        }
      } catch (error) {
        console.error('Error parsing admin SSE message:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('Admin SSE connection error:', error)
      setIsConnected(false)
      
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
          console.log('Admin attempting to reconnect...')
          // The useEffect will run again and create a new connection
        }
      }, 3000)
    }

    return () => {
      clearInterval(statusInterval)
      eventSource.close()
      eventSourceRef.current = null
      setIsConnected(false)
    }
  }, [fetchUsers])

  // Send message as admin
  const sendMessage = useCallback(async (userId: string, content: string, messageType: 'internal' | 'sms' = 'internal') => {
    try {
      if (messageType === 'internal') {
        const { data, error } = await supabase
          .from('messages')
          .insert({
            user_id: userId,
            sender: 'admin',
            content: content.trim()
          })
          .select()
          .single()

        if (error) throw error
        return { success: true, message: data }
      } else {
        // Handle SMS sending
        const { data: profile } = await supabase
          .from('profiles')
          .select('phone_number')
          .eq('id', userId)
          .single()

        if (profile) {
          // Import SMS function dynamically to avoid SSR issues
          const { sendSMS, formatSMSMessage } = await import('@/lib/mista-api')
          
          const smsMessage = formatSMSMessage(
            content.trim(),
            process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://your-domain.vercel.app'
          )

          const smsResult = await sendSMS(profile.phone_number, smsMessage)
          
          // Store as internal message for record keeping
          const { data, error } = await supabase
            .from('messages')
            .insert({
              user_id: userId,
              sender: 'admin',
              content: `[SMS] ${content.trim()}`
            })
            .select()
            .single()

          if (error) throw error
          return { success: true, message: data, smsResult }
        }
      }
    } catch (error) {
      console.error('Error sending admin message:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }, [])

  return {
    users,
    isLoading,
    isConnected,
    sendMessage,
    fetchUsers
  }
}

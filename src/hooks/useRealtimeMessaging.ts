import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase, Message } from '@/lib/supabase'

interface RealtimeMessage extends Message {
  profiles?: {
    name: string
    phone_number: string
  }
}

export function useRealtimeMessaging(userId: string, isAdmin: boolean = false) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)

  // Fetch initial messages
  const fetchMessages = useCallback(async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone_number', localStorage.getItem('user_phone'))
        .single()

      if (profile) {
        const { data: messages } = await supabase
          .from('messages')
          .select('*')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: true })

        setMessages(messages || [])
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Set up real-time connection
  useEffect(() => {
    fetchMessages()

    // Set user as online
    if (userId) {
      fetch('/api/presence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isOnline: true })
      }).catch(console.error)
    }

    // Create SSE connection
    const userPhone = localStorage.getItem('user_phone')
    const url = new URL('/api/messages/stream', window.location.origin)
    
    if (isAdmin) {
      url.searchParams.set('userPhone', userPhone || '')
    } else {
      url.searchParams.set('userId', userId)
    }

    const eventSource = new EventSource(url.toString())
    eventSourceRef.current = eventSource

    eventSource.onopen = () => {
      console.log('SSE connection opened')
      setIsConnected(true)
    }

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        
        switch (data.type) {
          case 'connected':
            console.log('Connected to real-time stream')
            break
            
          case 'subscribed':
            console.log('Subscribed to message updates')
            break
            
          case 'message':
            const message = data.message as RealtimeMessage
            console.log('New message received:', message)
            
            setMessages(prev => {
              // Check if message already exists to avoid duplicates
              const exists = prev.some(msg => msg.id === message.id)
              if (!exists) {
                // Sort messages by created_at to maintain order
                const newMessages = [...prev, message].sort((a, b) => 
                  new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                )
                return newMessages
              }
              return prev
            })
            break
            
          case 'heartbeat':
            // Keep connection alive
            break
            
          case 'error':
            console.error('SSE Error:', data.error)
            break
        }
      } catch (error) {
        console.error('Error parsing SSE message:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error)
      setIsConnected(false)
      
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
          console.log('Attempting to reconnect...')
          // The useEffect will run again and create a new connection
        }
      }, 3000)
    }

    return () => {
      // Set user as offline
      if (userId) {
        fetch('/api/presence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, isOnline: false })
        }).catch(console.error)
      }
      
      eventSource.close()
      eventSourceRef.current = null
      setIsConnected(false)
    }
  }, [userId, isAdmin, fetchMessages])

  // Add new message
  const addMessage = useCallback((message: Message) => {
    setMessages(prev => {
      const exists = prev.some(msg => msg.id === message.id)
      if (!exists) {
        return [...prev, message]
      }
      return prev
    })
  }, [])

  // Send message
  const sendMessage = useCallback(async (content: string, sender: 'user' | 'admin' = 'user') => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone_number', localStorage.getItem('user_phone'))
        .single()

      if (profile) {
        const { data, error } = await supabase
          .from('messages')
          .insert({
            user_id: profile.id,
            sender,
            content: content.trim()
          })
          .select()
          .single()

        if (error) throw error

        // Message will be added via real-time stream
        return { success: true, message: data }
      }
    } catch (error) {
      console.error('Error sending message:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }, [])

  return {
    messages,
    isLoading,
    isConnected,
    addMessage,
    sendMessage,
    fetchMessages
  }
}

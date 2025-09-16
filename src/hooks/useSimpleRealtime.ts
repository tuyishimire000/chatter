import { useState, useEffect, useCallback } from 'react'
import { supabase, Message } from '@/lib/supabase'

export function useSimpleRealtime(userId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  // Set up real-time subscription with error handling
  useEffect(() => {
    fetchMessages()

    let channel: any = null // eslint-disable-line @typescript-eslint/no-explicit-any
    
    try {
      channel = supabase
        .channel('simple-messages')
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'messages',
            filter: `user_id=eq.${userId}`
          }, 
          (payload) => {
            console.log('New message received:', payload)
            const newMessage = payload.new as Message
            setMessages(prev => {
              // Check if message already exists to avoid duplicates
              const exists = prev.some(msg => msg.id === newMessage.id)
              if (!exists) {
                return [...prev, newMessage]
              }
              return prev
            })
          }
        )
        .subscribe((status) => {
          console.log('Subscription status:', status)
        })
    } catch (error) {
      console.error('Error setting up subscription:', error)
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [userId, fetchMessages])

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

  return {
    messages,
    isLoading,
    addMessage,
    fetchMessages
  }
}

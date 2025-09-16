import { useState, useEffect, useCallback } from 'react'
import { supabase, Message } from '@/lib/supabase'

export function usePollingMessages(userId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch messages
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

  // Set up polling
  useEffect(() => {
    fetchMessages()

    // Poll every 2 seconds
    const interval = setInterval(fetchMessages, 2000)

    return () => {
      clearInterval(interval)
    }
  }, [fetchMessages])

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

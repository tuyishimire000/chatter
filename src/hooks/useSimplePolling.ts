import { useState, useEffect, useCallback } from 'react'
import { supabase, Message } from '@/lib/supabase'

interface UserWithMessages {
  id: string
  name: string
  phone_number: string
  created_at: string
  messages: Message[]
  unreadCount: number
  isOnline?: boolean
  isTyping?: boolean
}

export function useSimplePolling(userId?: string, isAdmin: boolean = false) {
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<UserWithMessages[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastMessageId, setLastMessageId] = useState<string | null>(null)
  const [updateTrigger, setUpdateTrigger] = useState(0)

  // Fetch messages for user
  const fetchUserMessages = useCallback(async () => {
    if (!userId) return

    try {
      const response = await fetch(`/api/test-messages?userId=${userId}`)
      const data = await response.json()
      
      if (data.success) {
        const newMessages = data.messages || []
        console.log('Setting messages for user:', newMessages.length)
        setMessages(newMessages)
        setUpdateTrigger(prev => prev + 1) // Force re-render
      }
    } catch (error) {
      console.error('Error fetching user messages:', error)
    }
  }, [userId])

  // Fetch users for admin
  const fetchAdminUsers = useCallback(async () => {
    try {
      const userPhone = localStorage.getItem('user_phone')
      const response = await fetch(`/api/test-messages?userPhone=${userPhone}`)
      const data = await response.json()
      
      if (data.success) {
        // Also fetch presence data
        const presenceResponse = await fetch('/api/presence')
        const presenceData = await presenceResponse.json()
        
        const onlineUsers = new Set()
        if (presenceData.success) {
          presenceData.presence.forEach((p: { user_id: string; is_online: boolean }) => {
            if (p.is_online) {
              onlineUsers.add(p.user_id)
            }
          })
        }
        
        const newUsers = (data.users || []).map((user: UserWithMessages) => ({
          ...user,
          isOnline: onlineUsers.has(user.id)
        }))
        
        console.log('Setting users for admin:', newUsers.length, 'Online:', Array.from(onlineUsers).length)
        setUsers(newUsers)
        setUpdateTrigger(prev => prev + 1) // Force re-render
      }
    } catch (error) {
      console.error('Error fetching admin users:', error)
    }
  }, [])

  // Send message
  const sendMessage = useCallback(async (content: string, sender: 'user' | 'admin' = 'user', targetUserId?: string) => {
    try {
      if (sender === 'user' && userId) {
        const { data, error } = await supabase
          .from('messages')
          .insert({
            user_id: userId,
            sender: 'user',
            content: content.trim()
          })
          .select()
          .single()

        if (error) throw error
        return { success: true, message: data }
      } else if (sender === 'admin' && targetUserId) {
        const { data, error } = await supabase
          .from('messages')
          .insert({
            user_id: targetUserId,
            sender: 'admin',
            content: content.trim()
          })
          .select()
          .single()

        if (error) throw error
        return { success: true, message: data }
      }
    } catch (error) {
      console.error('Error sending message:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }, [userId])

  // Set up polling
  useEffect(() => {
    if (isAdmin) {
      fetchAdminUsers()
      setIsLoading(false)
      
      // Poll every 1 second for admin (more aggressive)
      const interval = setInterval(() => {
        console.log('Admin polling...')
        fetchAdminUsers()
      }, 1000)
      return () => clearInterval(interval)
    } else if (userId) {
      fetchUserMessages()
      setIsLoading(false)
      
      // Set user as online when they start using the app
      fetch('/api/presence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isOnline: true })
      }).catch(console.error)
      
      // Poll every 1 second for user (more aggressive)
      const interval = setInterval(() => {
        console.log('User polling...')
        fetchUserMessages()
      }, 1000)
      
      // Send heartbeat every 5 seconds to keep user online
      const heartbeatInterval = setInterval(() => {
        fetch('/api/presence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, isOnline: true })
        }).catch(console.error)
      }, 5000)
      
      // Set user as offline when they leave
      const handleBeforeUnload = () => {
        fetch('/api/presence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, isOnline: false })
        }).catch(console.error)
      }
      
      window.addEventListener('beforeunload', handleBeforeUnload)
      
      return () => {
        clearInterval(interval)
        clearInterval(heartbeatInterval)
        window.removeEventListener('beforeunload', handleBeforeUnload)
        // Set offline on cleanup
        fetch('/api/presence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, isOnline: false })
        }).catch(console.error)
      }
    }
  }, [isAdmin, userId, fetchAdminUsers, fetchUserMessages])

  // Force re-render when updateTrigger changes
  useEffect(() => {
    console.log('Update trigger changed:', updateTrigger)
  }, [updateTrigger])

  // Manual refresh function
  const refresh = useCallback(() => {
    if (isAdmin) {
      fetchAdminUsers()
    } else if (userId) {
      fetchUserMessages()
    }
  }, [isAdmin, userId, fetchAdminUsers, fetchUserMessages])

  return {
    messages,
    users,
    isLoading,
    sendMessage,
    refresh,
    updateTrigger
  }
}

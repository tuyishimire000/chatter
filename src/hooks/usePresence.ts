import { useState, useEffect, useCallback } from 'react'
import { supabase, Presence } from '@/lib/supabase'

export function usePresence(userId: string) {
  const [isOnline, setIsOnline] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])

  // Update presence status
  const updatePresence = useCallback(async (online: boolean, typing: boolean = false, typingForUserId?: string) => {
    try {
      const { error } = await supabase
        .from('presence')
        .upsert({
          user_id: userId,
          is_online: online,
          is_typing: typing,
          typing_for_user_id: typingForUserId,
          last_seen: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (error) {
        console.log('Presence table not found, skipping presence update:', error.message)
        // Don't throw error, just log it
      }
    } catch (error) {
      console.error('Error updating presence:', error)
    }
  }, [userId])

  // Set user as online
  const setOnline = useCallback(() => {
    setIsOnline(true)
    updatePresence(true, false)
  }, [updatePresence])

  // Set user as offline
  const setOffline = useCallback(() => {
    setIsOnline(false)
    setIsTyping(false)
    updatePresence(false, false)
  }, [updatePresence])

  // Set typing status
  const setTyping = useCallback((typing: boolean, forUserId?: string) => {
    setIsTyping(typing)
    updatePresence(true, typing, forUserId)
  }, [updatePresence])

  // Listen for typing indicators
  useEffect(() => {
    const channel = supabase
      .channel('typing-indicators')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'presence',
          filter: `is_typing=eq.true`
        }, 
        (payload) => {
          const presence = payload.new as Presence
          if (presence.user_id !== userId) {
            setTypingUsers(prev => {
              if (presence.is_typing && presence.typing_for_user_id === userId) {
                return [...prev.filter(id => id !== presence.user_id), presence.user_id]
              } else {
                return prev.filter(id => id !== presence.user_id)
              }
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setOffline()
    }
  }, [setOffline])

  return {
    isOnline,
    isTyping,
    typingUsers,
    setOnline,
    setOffline,
    setTyping
  }
}

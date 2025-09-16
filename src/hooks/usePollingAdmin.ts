import { useState, useEffect, useCallback } from 'react'
import { supabase, Message, Profile } from '@/lib/supabase'

interface UserWithMessages extends Profile {
  messages: Message[]
  unreadCount: number
  isOnline?: boolean
  isTyping?: boolean
}

export function usePollingAdmin() {
  const [users, setUsers] = useState<UserWithMessages[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchUsers = useCallback(async () => {
    try {
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

            // Get presence data (gracefully handle missing table)
            let isOnline = false
            let isTyping = false
            
            try {
              const { data: presence } = await supabase
                .from('presence')
                .select('*')
                .eq('user_id', profile.id)
                .single()
              
              isOnline = presence?.is_online || false
              isTyping = presence?.is_typing || false
            } catch (error) {
              console.log('Presence table not available, using defaults')
            }

            return {
              ...profile,
              messages: messages || [],
              unreadCount,
              isOnline,
              isTyping
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

  // Set up polling
  useEffect(() => {
    fetchUsers()

    // Poll every 3 seconds
    const interval = setInterval(fetchUsers, 3000)

    return () => {
      clearInterval(interval)
    }
  }, [fetchUsers])

  return {
    users,
    isLoading,
    fetchUsers
  }
}

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  phone_number: string
  name: string
  created_at: string
}

interface AuthState {
  user: User | null
  isAdmin: boolean
  isLoading: boolean
  isAuthenticated: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAdmin: false,
    isLoading: true,
    isAuthenticated: false
  })
  const router = useRouter()

  const verifyAuth = useCallback(async () => {
    try {
      const phone = localStorage.getItem('user_phone')
      const userId = localStorage.getItem('user_id')
      
      if (!phone || !userId) {
        setAuthState({
          user: null,
          isAdmin: false,
          isLoading: false,
          isAuthenticated: false
        })
        return
      }

      // Verify with server
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone, userId })
      })

      const data = await response.json()

      if (data.success) {
        setAuthState({
          user: data.profile,
          isAdmin: data.isAdmin,
          isLoading: false,
          isAuthenticated: true
        })
      } else {
        // Invalid credentials, clear storage and redirect
        localStorage.removeItem('user_phone')
        localStorage.removeItem('user_name')
        localStorage.removeItem('user_id')
        setAuthState({
          user: null,
          isAdmin: false,
          isLoading: false,
          isAuthenticated: false
        })
        router.push('/login')
      }
    } catch (error) {
      console.error('Auth verification failed:', error)
      setAuthState({
        user: null,
        isAdmin: false,
        isLoading: false,
        isAuthenticated: false
      })
      router.push('/login')
    }
  }, [router])

  const logout = () => {
    localStorage.removeItem('user_phone')
    localStorage.removeItem('user_name')
    localStorage.removeItem('user_id')
    setAuthState({
      user: null,
      isAdmin: false,
      isLoading: false,
      isAuthenticated: false
    })
    router.push('/login')
  }

  useEffect(() => {
    verifyAuth()
  }, [verifyAuth])

  return {
    ...authState,
    verifyAuth,
    logout
  }
}

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const phone = localStorage.getItem('user_phone')
    if (phone) {
      // Check if admin
      const isAdmin = phone === process.env.NEXT_PUBLIC_ADMIN_PHONE
      router.push(isAdmin ? '/admin' : '/dashboard')
    } else {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
    </div>
  )
}
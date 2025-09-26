'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { signInWithPhone } from '@/lib/auth'

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signInWithPhone(phoneNumber)
      
      if (result.success && result.profile) {
        // Store user session in localStorage for simplicity
        localStorage.setItem('user_phone', phoneNumber)
        localStorage.setItem('user_name', result.profile.name)
        localStorage.setItem('user_id', result.profile.id)
        
        // Check if admin
        const isAdmin = phoneNumber === process.env.NEXT_PUBLIC_ADMIN_PHONE
        if (isAdmin) {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
      } else {
        setError(result.error || 'Authentication failed')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-light text-slate-800">
            Welcome to Hilbert Chat
          </CardTitle>
          <CardDescription className="text-slate-600">
            Enter your MTN number to chat with Hilbert
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-700 font-medium">
                MTN Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+250 78X XXX XXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="h-12 text-lg border-slate-200 focus:border-slate-400 focus:ring-slate-400"
              />
              <p className="text-xs text-slate-500 text-center">
                Use country code +250 and only numbers that Hilbert has
              </p>
            </div>
            
            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-lg font-medium bg-slate-800 hover:bg-slate-700 text-white transition-colors"
            >
              {isLoading ? 'Connecting...' : 'Chat with Hilbert'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

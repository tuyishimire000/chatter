import { supabase } from './supabase'
import { Profile } from './supabase'

export async function signInWithPhone(phoneNumber: string) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data.error || 'Authentication failed' }
    }

    return { success: true, profile: data.profile }
  } catch {
    return { success: false, error: 'Authentication failed' }
  }
}

export async function getCurrentUser() {
  // For client-side authentication, we'll use localStorage
  const phone = localStorage.getItem('user_phone')
  return phone ? { phone } : null
}

export async function isAdmin(phoneNumber: string) {
  return phoneNumber === process.env.NEXT_PUBLIC_ADMIN_PHONE
}

export async function getProfileByPhone(phoneNumber: string): Promise<Profile | null> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('phone_number', phoneNumber)
    .single()

  if (error || !profile) {
    return null
  }

  return profile
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import { MessageCircle, Send, LogOut, Users, MessageSquare, Phone } from 'lucide-react'
import { supabase, Message, Profile } from '@/lib/supabase'
import { sendSMS, formatSMSMessage } from '@/lib/mista-api'

interface UserWithMessages extends Profile {
  messages: Message[]
  unreadCount: number
}

export default function AdminPage() {
  const [users, setUsers] = useState<UserWithMessages[]>([])
  const [selectedUser, setSelectedUser] = useState<UserWithMessages | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [messageType, setMessageType] = useState<'internal' | 'sms'>('internal')
  const router = useRouter()

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
              (msg) => msg.sender === 'user' && !msg.read_at
            ).length || 0

            return {
              ...profile,
              messages: messages || [],
              unreadCount
            }
          })
        )

        setUsers(usersWithMessages)
        if (usersWithMessages.length > 0 && !selectedUser) {
          setSelectedUser(usersWithMessages[0])
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }, [selectedUser])

  useEffect(() => {
    // Check if user is admin
    const phone = localStorage.getItem('user_phone')
    if (!phone || phone !== process.env.NEXT_PUBLIC_ADMIN_PHONE) {
      router.push('/login')
      return
    }
    
    fetchUsers()
  }, [router, fetchUsers])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedUser) return

    setIsSending(true)
    try {
      if (messageType === 'internal') {
        // Send internal message
        const { data, error } = await supabase
          .from('messages')
          .insert({
            user_id: selectedUser.id,
            sender: 'admin',
            content: newMessage.trim()
          })
          .select()
          .single()

        if (error) throw error

        // Update local state
        setSelectedUser(prev => prev ? {
          ...prev,
          messages: [data, ...prev.messages]
        } : null)

        setUsers(prev => prev.map(user => 
          user.id === selectedUser.id 
            ? { ...user, messages: [data, ...user.messages] }
            : user
        ))
      } else {
        // Send SMS
        const smsMessage = formatSMSMessage(
          newMessage.trim(),
          process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://your-domain.vercel.app'
        )

        const smsResult = await sendSMS(selectedUser.phone_number, smsMessage)
        
        if (smsResult.success) {
          // Also store as internal message for record keeping
          const { data, error } = await supabase
            .from('messages')
            .insert({
              user_id: selectedUser.id,
              sender: 'admin',
              content: `[SMS] ${newMessage.trim()}`
            })
            .select()
            .single()

          if (error) throw error

          // Update local state
          setSelectedUser(prev => prev ? {
            ...prev,
            messages: [data, ...prev.messages]
          } : null)

          setUsers(prev => prev.map(user => 
            user.id === selectedUser.id 
              ? { ...user, messages: [data, ...user.messages] }
              : user
          ))
        } else {
          throw new Error(smsResult.error || 'SMS sending failed')
        }
      }

      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user_phone')
    localStorage.removeItem('user_id')
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-light text-slate-800">Admin Dashboard</h1>
              <p className="text-sm text-slate-600">{users.length} user{users.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-slate-600 hover:text-slate-800"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Users List */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-slate-800">Users</CardTitle>
              <CardDescription>Select a user to view messages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto">
              {users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedUser?.id === user.id
                      ? 'bg-slate-100 border border-slate-200'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-slate-200 text-slate-600 text-sm">
                          {user.phone_number.slice(-2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-slate-800">{user.phone_number}</p>
                        <p className="text-xs text-slate-500">
                          {user.messages.length} message{user.messages.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    {user.unreadCount > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {user.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Messages */}
          <div className="lg:col-span-2 space-y-6">
            {selectedUser ? (
              <>
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-slate-800">
                      Conversation with {selectedUser.phone_number}
                    </CardTitle>
                    <CardDescription>
                      {selectedUser.messages.length} message{selectedUser.messages.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                    {selectedUser.messages.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <MessageCircle className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <p>No messages yet</p>
                      </div>
                    ) : (
                      selectedUser.messages
                        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                        .map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                                message.sender === 'admin'
                                  ? 'bg-slate-800 text-white'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                message.sender === 'admin' ? 'text-slate-300' : 'text-slate-500'
                              }`}>
                                {new Date(message.created_at).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))
                    )}
                  </CardContent>
                </Card>

                {/* Send Message Form */}
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <form onSubmit={handleSendMessage} className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-medium">Message Type</Label>
                        <div className="flex space-x-4">
                          <Button
                            type="button"
                            variant={messageType === 'internal' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setMessageType('internal')}
                            className="flex items-center"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Internal
                          </Button>
                          <Button
                            type="button"
                            variant={messageType === 'sms' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setMessageType('sms')}
                            className="flex items-center"
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            SMS
                          </Button>
                        </div>
                      </div>
                      
                      <Textarea
                        placeholder={`Type your ${messageType} message...`}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="min-h-[100px] resize-none border-slate-200 focus:border-slate-400 focus:ring-slate-400"
                        disabled={isSending}
                      />
                      
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          disabled={!newMessage.trim() || isSending}
                          className="bg-slate-800 hover:bg-slate-700 text-white"
                        >
                          {isSending ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Send {messageType === 'sms' ? 'SMS' : 'Message'}
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <Users className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-lg font-medium text-slate-800 mb-2">Select a User</h3>
                  <p className="text-slate-600">Choose a user from the list to view and manage their messages</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

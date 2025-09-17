'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { MessageCircle, Send, LogOut } from 'lucide-react'
import { supabase, Message } from '@/lib/supabase'
import { useSimplePolling } from '@/hooks/useSimplePolling'

export default function DashboardPage() {
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [userPhone, setUserPhone] = useState('')
  const [userName, setUserName] = useState('')
  const [userId, setUserId] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()
  const lastSeenMessageId = useRef<string | null>(null)

  // Use simple polling
  const { messages, isLoading, sendMessage, refresh, updateTrigger } = useSimplePolling(userId, false)

  // Debug messages
  useEffect(() => {
    console.log('Messages state updated:', messages.length, messages)
  }, [messages])

  // Debug update trigger
  useEffect(() => {
    console.log('Update trigger changed:', updateTrigger)
  }, [updateTrigger])

  // Mark messages as seen when viewed
  const markMessagesAsSeen = async (messageIds: string[]) => {
    try {
      await fetch('/api/messages/seen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageIds,
          seenBy: 'user'
        })
      })
    } catch (error) {
      console.error('Error marking messages as seen:', error)
    }
  }

  // Mark admin messages as read when they are viewed by user
  useEffect(() => {
    if (messages.length > 0 && userId) {
      // Get admin messages that haven't been read by user
      const unreadAdminMessages = messages.filter(
        message => message.sender === 'admin' && 
        (!message.seen_at || message.seen_by !== 'user')
      )
      
      if (unreadAdminMessages.length > 0) {
        const messageIds = unreadAdminMessages.map(msg => msg.id)
        markMessagesAsSeen(messageIds)
      }
    }
  }, [messages, userId])

  useEffect(() => {
    // Check if user is logged in
    const phone = localStorage.getItem('user_phone')
    const name = localStorage.getItem('user_name')
    const id = localStorage.getItem('user_id')
    
    if (!phone || !id) {
      router.push('/login')
      return
    }
    
    setUserPhone(phone)
    setUserName(name || '')
    setUserId(id)
  }, [router])

  // Handle typing
  const handleTyping = (value: string) => {
    setNewMessage(value)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setIsSending(true)
    setIsTyping(false)
    
    try {
      const result = await sendMessage(newMessage.trim(), 'user')
      
      if (result?.success) {
        setNewMessage('')
        // Force refresh after sending
        setTimeout(() => {
          refresh()
        }, 500)
      } else {
        console.error('Error sending message:', result?.error)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user_phone')
    localStorage.removeItem('user_name')
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
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-light text-slate-800">Chat with Blacky</h1>
              <p className="text-sm text-slate-600">{userName} • {userPhone}</p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-slate-500">
                  Live Updates
                </span>
              </div>
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Messages */}
        <Card className="mb-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-slate-800">Your Conversation</CardTitle>
            <CardDescription>
              {messages.length} message{messages.length !== 1 ? 's' : ''} • Blacky replies within 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p>No messages yet. Send Blacky a message!</p>
                <p className="text-xs mt-2">He replies within 24 hours</p>
              </div>
            ) : (
              messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      <p className="text-sm">
                        {message.sender === 'admin' ? `Blacky: ${message.content}` : `${userName}: ${message.content}`}
                      </p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-slate-300' : 'text-slate-500'
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
              <Textarea
                placeholder="Type your message to Blacky..."
                value={newMessage}
                onChange={(e) => handleTyping(e.target.value)}
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
                      Send to Blacky
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

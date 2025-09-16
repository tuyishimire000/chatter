import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const userPhone = searchParams.get('userPhone')

  if (!userId && !userPhone) {
    return new Response('Missing userId or userPhone', { status: 400 })
  }

  // Create a readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const encoder = new TextEncoder()
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`))

      // Set up real-time subscription
      let channel: any = null // eslint-disable-line @typescript-eslint/no-explicit-any
      
      try {
        channel = supabase
          .channel('messages-stream')
          .on('postgres_changes', 
            { 
              event: 'INSERT', 
              schema: 'public', 
              table: 'messages'
            }, 
            async (payload) => {
              console.log('New message received:', payload)
              
              // Get the full message with user details
              const { data: message } = await supabase
                .from('messages')
                .select(`
                  *,
                  profiles!messages_user_id_fkey (
                    name,
                    phone_number
                  )
                `)
                .eq('id', payload.new.id)
                .single()

              if (message) {
                // Check if this message is for the current user or if it's admin
                const isForCurrentUser = userId && message.user_id === userId
                const isAdmin = !userId && userPhone
                
                if (isForCurrentUser || isAdmin) {
                  const data = {
                    type: 'message',
                    message: message
                  }
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
                }
              }
            }
          )
          .subscribe((status) => {
            console.log('SSE Subscription status:', status)
            if (status === 'SUBSCRIBED') {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'subscribed' })}\n\n`))
            }
          })
      } catch (error) {
        console.error('SSE Error:', error)
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', error: error instanceof Error ? error.message : 'Unknown error' })}\n\n`))
      }

      // Keep connection alive with heartbeat
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'heartbeat' })}\n\n`))
        } catch {
          clearInterval(heartbeat)
        }
      }, 30000) // 30 seconds

      // Cleanup function
      const cleanup = () => {
        clearInterval(heartbeat)
        if (channel) {
          supabase.removeChannel(channel)
        }
      }

      // Handle client disconnect
      request.signal.addEventListener('abort', cleanup)
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    }
  })
}

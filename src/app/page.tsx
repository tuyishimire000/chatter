'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MessageCircle, ArrowRight, Star, Users, Clock, Shield, Phone } from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)

  const handleGetStarted = () => {
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-light text-slate-800">Blacky</span>
          </div>
          <Button
            onClick={handleGetStarted}
            className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2"
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-light text-slate-800 mb-6 leading-tight">
              Connect with
              <span className="block text-slate-600">Blacky</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Your personal communication platform. Direct, secure, and always available.
              Experience luxury messaging with guaranteed 24-hour response times.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 text-lg group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Start Chatting
              <ArrowRight className={`w-5 h-5 ml-2 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
            </Button>
            <div className="text-sm text-slate-500">
              <Phone className="w-4 h-4 inline mr-1" />
              MTN Numbers Only
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <Clock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-800 mb-2">24-Hour Response</h3>
                <p className="text-slate-600 text-sm">
                  Guaranteed response within 24 hours. No waiting, no uncertainty.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <Shield className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-800 mb-2">Secure & Private</h3>
                <p className="text-slate-600 text-sm">
                  End-to-end encrypted conversations. Your privacy is our priority.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-800 mb-2">Personal Touch</h3>
                <p className="text-slate-600 text-sm">
                  Direct communication with Blacky. No bots, no automated responses.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-slate-800 mb-4">About Blacky</h2>
            <div className="w-24 h-px bg-slate-300 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-light text-slate-800 mb-6">
                Your Personal Communication Partner
              </h3>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  I&apos;m Blacky, your dedicated communication specialist. With years of experience 
                  in personal and business communication, I understand the importance of 
                  timely, meaningful conversations.
                </p>
                <p>
                  Whether you need advice, want to discuss business opportunities, or simply 
                  want to have a meaningful conversation, I&apos;m here to listen and respond 
                  with genuine care and expertise.
                </p>
                <p>
                  <strong className="text-slate-800">Available exclusively for MTN users</strong> - 
                  ensuring reliable, high-quality communication through Rwanda&apos;s premier network.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-800">Premium Service</h4>
                  <p className="text-sm text-slate-600">Luxury communication experience</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-800">Always Available</h4>
                  <p className="text-sm text-slate-600">24/7 message monitoring</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-800">Personal Touch</h4>
                  <p className="text-sm text-slate-600">Human responses, not automated</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-light text-slate-800 mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Join the exclusive community of individuals who value meaningful, 
            timely communication. Your conversation starts here.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 text-lg"
            >
              Enter Your MTN Number
            </Button>
            <div className="text-sm text-slate-500 flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              Format: +250 78X XXX XXX
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <span className="text-lg font-light">Blacky</span>
          </div>
          <p className="text-slate-300 text-sm">
            © 2024 Blacky. Premium communication services for MTN users.
          </p>
        </div>
      </footer>
    </div>
  )
}
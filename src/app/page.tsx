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
            <span className="text-xl font-light text-slate-800">Hilbert</span>
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
              <span className="block text-slate-600">Hilbert</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Software Developer • Day Trader • CO-Founder of Unity Tech Systems Ltd
              <br />
              Direct, secure, and always available. Experience luxury messaging with guaranteed 24-hour response times.
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
            <Button
              onClick={() => window.open('https://hilbert-chxo.vercel.app/#about', '_blank')}
              variant="outline"
              size="lg"
              className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-4 text-lg"
            >
              View Portfolio
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
                <h3 className="text-lg font-medium text-slate-800 mb-2">Tech Expertise</h3>
                <p className="text-slate-600 text-sm">
                  Software development insights, trading strategies, and tech solutions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-800 mb-2">Entrepreneurial Mindset</h3>
                <p className="text-slate-600 text-sm">
                  CO-Founder experience and business insights from Unity Tech Systems Ltd.
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
                Meet Hilbert - Your Tech & Business Partner
              </h3>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  I&apos;m Hilbert, a software developer, seasonal day trader, and CO-Founder of 
                  Unity Tech Systems Ltd. With expertise spanning technology, finance, and 
                  entrepreneurship, I bring a unique perspective to every conversation.
                </p>
                <p>
                  Whether you need technical guidance, trading insights, business strategy 
                  discussions, or simply want to explore opportunities in the tech space, 
                  I&apos;m here to share knowledge and collaborate on meaningful projects.
                </p>
                <div className="mt-6">
                  <Button
                    onClick={() => window.open('https://hilbert-chxo.vercel.app/#about', '_blank')}
                    variant="outline"
                    className="border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    View My Portfolio
                  </Button>
                </div>
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
                  <h4 className="font-medium text-slate-800">Software Development</h4>
                  <p className="text-sm text-slate-600">Full-stack development expertise</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-800">Day Trading Insights</h4>
                  <p className="text-sm text-slate-600">Seasonal trading strategies</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-800">Unity Tech Systems</h4>
                  <p className="text-sm text-slate-600">CO-Founder business experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Estate Venture Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-slate-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-slate-800 mb-4">Real Estate Scaling Venture</h2>
            <div className="w-24 h-px bg-slate-300 mx-auto mb-4"></div>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Inspired by WeWork&apos;s revolutionary model, we&apos;re building a scalable real estate platform 
              that transforms how people access premium living spaces.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Business Model */}
            <div>
              <h3 className="text-2xl font-light text-slate-800 mb-6">Our WeWork-Inspired Model</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-medium">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 mb-2">Secure Leases</h4>
                    <p className="text-slate-600 text-sm">
                      Negotiate long-term leases with property owners at discounted bulk rates, 
                      ensuring guaranteed income for landlords.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-medium">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 mb-2">Add Value</h4>
                    <p className="text-slate-600 text-sm">
                      Renovate, furnish, and equip properties with WiFi, utilities, and modern amenities 
                      to create premium living experiences.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-medium">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 mb-2">Sub-Rent at Premium</h4>
                    <p className="text-slate-600 text-sm">
                      Transform single properties into multiple revenue streams through room-by-room 
                      rentals, maximizing profitability.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-medium">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 mb-2">Scale & Expand</h4>
                    <p className="text-slate-600 text-sm">
                      Reinvest profits to acquire more properties, build brand recognition, and 
                      eventually transition to property ownership.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue & Scaling */}
            <div>
              <h3 className="text-2xl font-light text-slate-800 mb-6">Revenue & Scaling Strategy</h3>
              
              <div className="space-y-6">
                <Card className="border-0 shadow-sm bg-white/80">
                  <CardContent className="p-6">
                    <h4 className="font-medium text-slate-800 mb-3">Revenue Streams</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li>• <strong>Rental Arbitrage</strong> - Core business model</li>
                      <li>• <strong>Property Management</strong> - Fee-based services</li>
                      <li>• <strong>Sales Commission</strong> - 3-5% on property sales</li>
                      <li>• <strong>Value-Added Services</strong> - Co-living utilities, cleaning</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-white/80">
                  <CardContent className="p-6">
                    <h4 className="font-medium text-slate-800 mb-3">Scaling Phases</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Phase 1 (0-6 months)</span>
                        <span className="text-slate-800 font-medium">1-2 houses</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Phase 2 (6-18 months)</span>
                        <span className="text-slate-800 font-medium">10-20 houses</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Phase 3 (18-36 months)</span>
                        <span className="text-slate-800 font-medium">Capital raise</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Phase 4 (3+ years)</span>
                        <span className="text-slate-800 font-medium">Multi-city expansion</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-slate-800 text-white p-6 rounded-lg">
                  <h4 className="font-medium mb-3">🚀 Seeking Venture Capital</h4>
                  <p className="text-sm text-slate-200 mb-4">
                    We&apos;re actively seeking VCs and investors who share our vision of transforming 
                    the real estate rental market through innovative scaling strategies.
                  </p>
                  <Button
                    onClick={handleGetStarted}
                    variant="outline"
                    size="sm"
                    className="border-white text-white hover:bg-white hover:text-slate-800"
                  >
                    Connect for Investment Discussion
                  </Button>
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
            Ready to Connect?
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Whether you&apos;re looking for tech guidance, trading insights, or business 
            collaboration, let&apos;s start a meaningful conversation. Your next opportunity 
            starts with a message.
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
            <span className="text-lg font-light">Hilbert</span>
          </div>
          <div className="space-y-2">
            <p className="text-slate-300 text-sm">
              © 2024 Hilbert. Software Developer • Day Trader • CO-Founder Unity Tech Systems Ltd
            </p>
            <Button
              onClick={() => window.open('https://hilbert-chxo.vercel.app/#about', '_blank')}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white text-xs"
            >
              View Portfolio
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}
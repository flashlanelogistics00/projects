'use client'

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import Link from "next/link"
import { Search, Plane, Ship, Truck, Shield, Clock, Globe, CheckCircle2, ArrowRight, Package } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const router = useRouter()

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (trackingNumber.trim()) {
      router.push(`/tracking?id=${trackingNumber.trim()}`)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070')] bg-cover bg-center opacity-20" />
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 text-center pt-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-blue-200 text-sm font-medium mb-6">
            <Globe className="w-4 h-4" />
            Trusted by 10,000+ businesses worldwide
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Global Logistics
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300">
              Made Simple
            </span>
          </h1>

          <p className="text-xl text-blue-100/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Fast, reliable, and secure shipping solutions for businesses of all sizes.
            Track your shipments in real-time, anywhere in the world.
          </p>

          {/* Tracking Search */}
          <form onSubmit={handleTrack} className="max-w-xl mx-auto mb-12">
            <div className="relative flex items-center bg-white rounded-xl shadow-2xl shadow-black/20 overflow-hidden">
              <div className="absolute left-4">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter your tracking number..."
                className="w-full pl-12 pr-4 py-4 text-gray-900 placeholder-gray-400 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors"
              >
                Track
              </button>
            </div>
          </form>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { value: '150+', label: 'Countries' },
              { value: '10M+', label: 'Deliveries' },
              { value: '99.9%', label: 'On-time Rate' },
              { value: '24/7', label: 'Support' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-blue-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
              Our Services
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Comprehensive Logistics <span className="text-blue-600">Solutions</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              From air freight to warehousing, we provide end-to-end logistics services tailored to your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Plane, title: 'Air Freight', desc: 'Express air shipping for time-sensitive cargo worldwide.' },
              { icon: Ship, title: 'Ocean Freight', desc: 'Cost-effective sea freight for large shipments.' },
              { icon: Truck, title: 'Road Transport', desc: 'Reliable ground shipping across continents.' },
              { icon: Shield, title: 'Secure Logistics', desc: 'Enhanced security for valuable shipments.' },
            ].map((service, i) => (
              <div
                key={i}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:-translate-y-2"
              >
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:scale-110 transition-all">
                  <service.icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{service.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">{service.desc}</p>
                <Link href="/services" className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:gap-3 transition-all">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wider mb-4">
                Why Choose Us
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Your Trusted <span className="text-blue-600">Logistics Partner</span>
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-8">
                With over a decade of experience, we&apos;ve built a reputation for reliability, speed, and exceptional customer service.
              </p>

              <div className="space-y-6">
                {[
                  { icon: Clock, title: 'Fast Delivery', desc: 'Express shipping options for urgent shipments.' },
                  { icon: Shield, title: 'Secure Handling', desc: 'Advanced security protocols and insurance coverage.' },
                  { icon: Globe, title: 'Global Network', desc: 'Offices in 150+ countries for seamless delivery.' },
                ].map((feature, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center shrink-0">
                      <feature.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{feature.title}</h4>
                      <p className="text-gray-500 dark:text-gray-400">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=800"
                  alt="Logistics operations"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">99.9%</div>
                    <div className="text-gray-500 dark:text-gray-400">On-time Delivery</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Ship?
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-10 text-lg">
            Get started today and experience the Flash Lane difference. Fast, reliable, and always on time.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-lg"
            >
              Get a Quote <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/tracking"
              className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all"
            >
              <Package className="w-5 h-5" /> Track Shipment
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

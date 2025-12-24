'use client'

import { Truck, ArrowUp } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

function BackToTop() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 300)
        }
        window.addEventListener('scroll', toggleVisibility)
        return () => window.removeEventListener('scroll', toggleVisibility)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (!isVisible) return null

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-500 transition-all hover:scale-110"
            aria-label="Back to top"
        >
            <ArrowUp className="w-5 h-5" />
        </button>
    )
}

export function Footer() {
    return (
        <>
            <BackToTop />
            <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">

                        {/* Brand */}
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-12 h-12">
                                    <img
                                        src="/logo.png"
                                        alt="FlashLane Logo"
                                        className="w-full h-full object-contain brightness-0 invert"
                                    />
                                </div>
                                <span className="font-bold text-xl">FlashLane</span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                FlashLane Logistics is a global leader in freight forwarding and supply chain management. Delivering excellence since 2010.
                            </p>
                        </div>

                        {/* Links */}
                        <div>
                            <h4 className="font-bold mb-6">Quick Links</h4>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li><Link href="/about" className="hover:text-blue-500 transition-colors">About Us</Link></li>
                                <li><Link href="/services" className="hover:text-blue-500 transition-colors">Services</Link></li>
                                <li><Link href="/tracking" className="hover:text-blue-500 transition-colors">Track Shipment</Link></li>
                                <li><Link href="/contact" className="hover:text-blue-500 transition-colors">Contact</Link></li>
                            </ul>
                        </div>

                        {/* Services */}
                        <div>
                            <h4 className="font-bold mb-6">Services</h4>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li><Link href="/services" className="hover:text-blue-500 transition-colors">Air Freight</Link></li>
                                <li><Link href="/services" className="hover:text-blue-500 transition-colors">Ocean Freight</Link></li>
                                <li><Link href="/services" className="hover:text-blue-500 transition-colors">Road Transport</Link></li>
                                <li><Link href="/services" className="hover:text-blue-500 transition-colors">Warehousing</Link></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="font-bold mb-6">Contact Us</h4>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li>support@flashlanelogistics.com</li>
                                <li>+1 (555) 123-4567</li>
                                <li>123 Logistics Way, Suite 100</li>
                                <li>New York, NY 10001</li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                        <p>&copy; {new Date().getFullYear()} FlashLane Logistics. All rights reserved.</p>
                        <div className="flex gap-6 mt-4 md:mt-0">
                            <Link href="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <Link href="/about" className="hover:text-white transition-colors">Terms of Service</Link>
                            <Link href="/auth/login" className="hover:text-blue-400 transition-colors">Admin Access</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

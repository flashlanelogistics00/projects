'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Truck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    const navItems = [
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'Tracking', href: '/tracking' },
        { label: 'About Us', href: '/about' },
        { label: 'Contact', href: '/contact' },
    ]

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                isScrolled
                    ? 'bg-white/90 backdrop-blur-md shadow-lg dark:bg-black/80 text-gray-900 dark:text-white py-2'
                    : 'bg-transparent text-white py-4'
            )}
        >
            <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="group">
                    <div className="h-10 w-auto group-hover:scale-105 transition-transform flex items-center">
                        <img
                            src="/logo.png"
                            alt="FlashLane Logo"
                            className={cn(
                                "h-full w-auto object-contain transition-all duration-300",
                                !isScrolled ? "brightness-0 invert" : "dark:brightness-0 dark:invert"
                            )}
                        />
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "transition-colors hover:text-blue-500",
                                pathname === item.href ? "text-blue-500 font-bold" : "text-current"
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-current"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-xl p-4 flex flex-col gap-4 text-gray-900 dark:text-white">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "py-2 transition-colors hover:text-blue-600",
                                pathname === item.href ? "text-blue-600 font-bold" : "text-current"
                            )}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    )
}

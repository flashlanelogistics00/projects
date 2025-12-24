'use client'

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import Link from "next/link"
import { Search, Package, User, CheckCircle2, AlertCircle, Printer, FileText } from "lucide-react"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Database } from "@/lib/database.types"
import dynamic from "next/dynamic"
import { TrackingProgress } from "@/components/tracking/tracking-progress"
import { getShipmentAction } from "./actions"
import { Skeleton } from "@/components/ui/skeleton"

// Dynamically import map to avoid SSR issues
const ShipmentMap = dynamic(() => import('@/components/tracking/shipment-map').then(mod => mod.ShipmentMap), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[400px] bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse flex items-center justify-center text-gray-400">
            Map Loading...
        </div>
    )
})

type Shipment = Database['public']['Tables']['shipments']['Row']
type TrackingEvent = Database['public']['Tables']['tracking_events']['Row']

interface Contact {
    name?: string
    address?: string
    contact?: string
}

interface PackageDetails {
    weight?: number
    dimensions?: string
    type?: string
    description?: string
    service_mode?: string
}

const TrackingSkeleton = () => (
    <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-64" />
                </div>
                <div className="space-y-2 flex flex-col items-end">
                    <Skeleton className="h-10 w-32 rounded-lg" />
                    <Skeleton className="h-8 w-48 rounded-full" />
                </div>
            </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            ))}
        </div>
        <Skeleton className="h-32 w-full rounded-3xl" />
        <div className="grid lg:grid-cols-2 gap-8">
            <Skeleton className="h-[400px] w-full rounded-3xl" />
            <Skeleton className="h-[400px] w-full rounded-3xl" />
        </div>
    </div>
)

function TrackingContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [trackingNumber, setTrackingNumber] = useState('')
    const [shipment, setShipment] = useState<Shipment | null>(null)
    const [events, setEvents] = useState<TrackingEvent[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const id = searchParams.get('id')
        if (id && id !== shipment?.tracking_number) {
            setTrackingNumber(id)
            fetchShipmentData(id)
        }
    }, [searchParams])

    const fetchShipmentData = async (searchNumber: string) => {
        if (!searchNumber.trim()) return

        setIsLoading(true)
        setError('')
        setShipment(null)
        setEvents([])

        try {
            const { shipment: shipmentData, events: eventsData, error: serverError } = await getShipmentAction(searchNumber)

            if (serverError) {
                setError(serverError)
                return
            }

            if (shipmentData) {
                setShipment(shipmentData as unknown as Shipment)
                setEvents(eventsData as unknown as TrackingEvent[])
            }
        } catch (err: any) {
            console.error('Error fetching shipment:', err)
            setError(err.message || 'An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (trackingNumber.trim()) {
            router.push(`/tracking?id=${trackingNumber.trim()}`)
        }
    }

    const formatStatus = (status: string | null) => {
        if (!status) return 'Pending'
        return status.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
    }

    return (
        <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
            <Navbar />

            {/* Hero Section */}
            <section className="relative min-h-[45vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566633806327-68e152aaf26d?q=80&w=2070')] bg-cover bg-center opacity-20" />

                <div className="container mx-auto px-4 relative z-10 text-center pt-24">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        Track your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300">Shipment</span>
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100/80 max-w-2xl mx-auto mb-8 leading-relaxed">
                        Real-time express tracking for your valuable cargo. Enter your tracking number below.
                    </p>

                    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                        <div className="relative flex items-center bg-white rounded-2xl shadow-2xl shadow-black/20 overflow-hidden p-1.5">
                            <div className="absolute left-6">
                                <Search className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                placeholder="Enter tracking ID (e.g., FLL-12345678)"
                                className="w-full pl-14 pr-32 py-4 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-lg"
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="absolute right-2 px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                            >
                                {isLoading ? 'Searching...' : 'Track'}
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            <main className="flex-1 py-12 container mx-auto px-4">
                {/* Loading State */}
                {isLoading && <TrackingSkeleton />}

                {/* Error State */}
                {error && (
                    <div className="max-w-4xl mx-auto mb-8 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl flex items-center gap-3">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </div>
                )}

                {shipment && !isLoading && (
                    <div className="max-w-6xl mx-auto space-y-8">

                        {/* 1. Header Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Package className="w-6 h-6 text-blue-600" />
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tracking Number</h2>
                                    </div>
                                    <p className="text-3xl md:text-4xl font-mono font-bold text-blue-600 md:pl-9">
                                        {shipment.tracking_number}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/tracking/invoice/${shipment.tracking_number}`}
                                            target="_blank"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/10 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 font-semibold rounded-lg transition-colors text-sm"
                                        >
                                            <FileText className="w-4 h-4" /> Print Invoice
                                        </Link>
                                    </div>
                                    <div className="bg-blue-50 dark:bg-blue-900/30 px-6 py-2 rounded-full border border-blue-100 dark:border-blue-800">
                                        <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                            Current Status: {formatStatus(shipment.status)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Last Updated: {new Date(shipment.updated_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 2. Info Cards Grid */}
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Sender */}
                            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                                    <User className="w-4 h-4" /> Sender Information
                                </h3>
                                <div className="space-y-1">
                                    <p className="font-bold text-gray-900 dark:text-white text-lg">
                                        {(shipment.shipper_details as unknown as Contact)?.name || 'N/A'}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {(shipment.shipper_details as unknown as Contact)?.address || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        {(shipment.shipper_details as unknown as Contact)?.contact || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {/* Receiver */}
                            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                                    <User className="w-4 h-4" /> Receiver Information
                                </h3>
                                <div className="space-y-1">
                                    <p className="font-bold text-gray-900 dark:text-white text-lg">
                                        {(shipment.receiver_details as unknown as Contact)?.name || 'N/A'}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {(shipment.receiver_details as unknown as Contact)?.address || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        {(shipment.receiver_details as unknown as Contact)?.contact || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                                    <Package className="w-4 h-4" /> Shipment Details
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Weight:</span>
                                        <span className="font-medium">{(shipment.package_details as unknown as PackageDetails)?.weight} kg</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Service:</span>
                                        <span className="font-medium">{(shipment.package_details as unknown as PackageDetails)?.service_mode || 'Standard'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Deployed:</span>
                                        <span className="font-medium">{new Date(shipment.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Progress Stepper */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Shipment Progress</h3>
                            <TrackingProgress status={shipment.status} />
                        </div>

                        {/* 4. Map & History Split */}
                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* History List */}
                            <div className="space-y-6">
                                <h3 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-blue-600" /> Shipment History
                                </h3>

                                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                                    <div className="absolute top-0 left-8 bottom-0 w-px bg-gray-100 dark:bg-gray-700" />

                                    <div className="space-y-8 relative">
                                        {events.map((event, index) => (
                                            <div key={event.id} className="flex gap-6 relative">
                                                <div className={`
                                                    w-4 h-4 rounded-full border-4 border-white dark:border-gray-800 flex-shrink-0 z-10
                                                    ${index === 0 ? 'bg-blue-600 ring-4 ring-blue-100 dark:ring-blue-900/30' : 'bg-gray-300 dark:bg-gray-600'}
                                                `} />
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-0.5">
                                                        {new Date(event.timestamp).toLocaleDateString()} - {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                    <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                                                        {event.status.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
                                                    </h4>
                                                    <p className="text-gray-600 dark:text-gray-300">
                                                        {event.location}
                                                    </p>
                                                    {event.description && (
                                                        <p className="text-sm text-gray-400 mt-1">
                                                            {event.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                        {events.length === 0 && (
                                            <p className="text-gray-500 italic pl-8">No tracking updates available yet.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Map */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-xl text-gray-900 dark:text-white">Route Map</h3>
                                    <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Live View</span>
                                </div>
                                <ShipmentMap
                                    origin={shipment.origin || ''}
                                    destination={shipment.destination || ''}
                                    currentLocation={events[0]?.location}
                                />
                            </div>
                        </div>

                        {/* Banner */}
                        <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden group hover:shadow-xl transition-shadow cursor-pointer">
                            <div className="relative z-10">
                                <h3 className="font-bold text-3xl mb-2">SAVE THIS TRACKING</h3>
                                <p className="opacity-90 max-w-md">
                                    Bookmark this page or save your tracking number: <span className="font-mono font-bold bg-white/20 px-2 py-1 rounded">{shipment.tracking_number}</span>
                                </p>
                            </div>
                            <Printer className="absolute right-8 bottom-8 w-24 h-24 opacity-10 rotate-12 group-hover:scale-110 transition-transform" />
                        </div>

                        {/* Print Invoice Button (Bottom) */}
                        <div className="flex justify-center pb-8">
                            <Link
                                href={`/tracking/invoice/${shipment.tracking_number}`}
                                target="_blank"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm border border-gray-200 dark:border-gray-700 group"
                            >
                                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="text-lg">Print Official Invoice</span>
                            </Link>
                        </div>

                    </div>
                )}

                {!shipment && !isLoading && !error && (
                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                        <Package className="w-24 h-24 mb-6 text-gray-300 dark:text-gray-700" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Ready to Track</h3>
                        <p className="max-w-md text-gray-500">Enter your tracking number above to see shipment details.</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}

export default function TrackingPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        }>
            <TrackingContent />
        </Suspense>
    )
}

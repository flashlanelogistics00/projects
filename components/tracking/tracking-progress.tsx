'use client'

import { Check, Truck, Package, Clock, ShieldCheck, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TrackingProgressProps {
    status: string | null
}

const steps = [
    { id: 'pending', label: 'Order Confirmed', icon: FileText },
    { id: 'picked_up', label: 'Picked by Courier', icon: Package },
    { id: 'in_transit', label: 'On The Way', icon: Truck },
    { id: 'customs', label: 'Customs Hold', icon: ShieldCheck },
    { id: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin },
    { id: 'delivered', label: 'Delivered', icon: Check },
]

import { FileText } from 'lucide-react'

export function TrackingProgress({ status }: TrackingProgressProps) {
    const currentStatus = status || 'pending'

    // Define base steps (excluding customs_hold initially)
    const baseSteps = [
        { id: 'pending', label: 'Order Confirmed', icon: FileText },
        { id: 'picked_up', label: 'Picked by Courier', icon: Package },
        { id: 'in_transit', label: 'On The Way', icon: Truck },
        { id: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin },
        { id: 'delivered', label: 'Delivered', icon: Check },
    ]

    // Create the dynamic steps array
    let displaySteps = [...baseSteps]

    // If currently on hold, insert the Customs Hold step after In Transit and before Out for Delivery
    if (currentStatus === 'customs_hold') {
        const inTransitIndex = displaySteps.findIndex(s => s.id === 'in_transit')
        displaySteps.splice(inTransitIndex + 1, 0, {
            id: 'customs_hold',
            label: 'Customs Hold',
            icon: ShieldCheck
        })
    }

    const activeIndex = displaySteps.findIndex(step => step.id === currentStatus)
    const safeIndex = activeIndex === -1 ? 0 : activeIndex

    return (
        <div className="w-full py-8 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[600px] px-4">
                {displaySteps.map((step, index) => {
                    const isActive = index <= safeIndex
                    const isCompleted = index < safeIndex
                    const isCurrent = index === safeIndex

                    // Special styling for active Customs Hold
                    const isCustomsHold = step.id === 'customs_hold'

                    return (
                        <div key={step.id} className="flex flex-col items-center relative flex-1">
                            {/* Connecting Line */}
                            {index !== 0 && (
                                <div
                                    className={cn(
                                        "absolute top-5 -left-1/2 w-full h-1",
                                        index <= safeIndex
                                            ? (isCustomsHold ? "bg-amber-500" : "bg-blue-600")
                                            : "bg-gray-200 dark:bg-gray-700"
                                    )}
                                />
                            )}

                            {/* Icon Circle */}
                            <div
                                className={cn(
                                    "relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                                    isActive
                                        ? (isCustomsHold
                                            ? "bg-amber-100 text-amber-600 border-2 border-amber-600 shadow-lg shadow-amber-600/30 animate-pulse"
                                            : "bg-blue-600 text-white shadow-lg shadow-blue-600/30")
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700"
                                )}
                            >
                                <step.icon className="w-5 h-5" />
                            </div>

                            {/* Label */}
                            <div className="mt-4 text-center">
                                <p className={cn(
                                    "font-semibold text-sm",
                                    isActive ? "text-gray-900 dark:text-white" : "text-gray-400",
                                    isCustomsHold && "text-amber-600 dark:text-amber-400"
                                )}>
                                    {step.label}
                                </p>
                                {isCurrent && (
                                    <p className={cn(
                                        "text-xs font-medium mt-1",
                                        isCustomsHold ? "text-amber-600" : "text-blue-600"
                                    )}>
                                        {isCustomsHold ? "Action Required" : "Current"}
                                    </p>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

'use client'

import { useState } from 'react'
import { updateShipmentStatus } from './actions'
import { Loader2 } from 'lucide-react'
import { Database } from '@/lib/database.types'

const statuses: { value: Database['public']['Enums']['shipment_status'], label: string }[] = [
    { value: 'pending', label: 'Pending' },
    { value: 'picked_up', label: 'Picked Up' },
    { value: 'in_transit', label: 'In Transit' },
    { value: 'customs_hold', label: 'Customs Hold' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
]

export function StatusUpdateForm({
    shipmentId,
    currentStatus
}: {
    shipmentId: string
    currentStatus: Database['public']['Enums']['shipment_status'] | null
}) {
    const [status, setStatus] = useState(currentStatus || 'pending')
    const [location, setLocation] = useState('')
    const [description, setDescription] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!location.trim()) {
            setMessage('Location is required')
            return
        }

        setIsSubmitting(true)
        setMessage('')

        try {
            await updateShipmentStatus(shipmentId, status, location, description || undefined)
            setMessage('Status updated successfully!')
            setLocation('')
            setDescription('')
        } catch (err) {
            console.error('Error updating status:', err)
            setMessage(err instanceof Error ? err.message : 'Failed to update status')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Update Status</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as Database['public']['Enums']['shipment_status'])}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                    >
                        {statuses.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location *</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g., New York Hub"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes (optional)</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={2}
                        placeholder="Additional notes..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white resize-none"
                    />
                </div>

                {message && (
                    <p className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                        </>
                    ) : (
                        'Update Status'
                    )}
                </button>
            </form>
        </div>
    )
}

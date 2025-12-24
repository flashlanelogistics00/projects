'use client'

import { useState } from 'react'
import { Pencil, Trash2, Check, X, Loader2 } from 'lucide-react'
import { deleteTrackingEvent, updateTrackingEvent } from '@/app/dashboard/shipments/actions'
import { cn } from '@/lib/utils'

interface TrackingEvent {
    id: string
    status: string
    location: string | null
    description: string | null
    timestamp: string
}

interface TrackingEventsManagerProps {
    events: TrackingEvent[]
    shipmentId: string
}

export function TrackingEventsManager({ events, shipmentId }: TrackingEventsManagerProps) {
    const [editingId, setEditingId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    // Form state for editing
    const [editForm, setEditForm] = useState({
        status: '',
        location: '',
        description: '',
        timestamp: ''
    })

    const handleEdit = (event: TrackingEvent) => {
        setEditingId(event.id)
        setEditForm({
            status: event.status,
            location: event.location || '',
            description: event.description || '',
            timestamp: new Date(event.timestamp).toISOString().slice(0, 16) // Format for datetime-local
        })
    }

    const cancelEdit = () => {
        setEditingId(null)
    }

    const handleDelete = async (eventId: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return

        setIsDeleting(eventId)
        try {
            await deleteTrackingEvent(eventId, shipmentId)
        } catch (error) {
            console.error('Failed to delete event:', error)
            alert('Failed to delete event')
        } finally {
            setIsDeleting(null)
        }
    }

    const handleUpdate = async (eventId: string) => {
        setIsSaving(true)
        try {
            await updateTrackingEvent(eventId, shipmentId, {
                status: editForm.status,
                location: editForm.location,
                description: editForm.description,
                timestamp: new Date(editForm.timestamp).toISOString()
            })
            setEditingId(null)
        } catch (error) {
            console.error('Failed to update event:', error)
            alert('Failed to update event')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                        <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white rounded-l-lg">Date & Time</th>
                        <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Status</th>
                        <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Location</th>
                        <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Notes</th>
                        <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white rounded-r-lg text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {events?.map((event) => {
                        const isEditing = editingId === event.id

                        if (isEditing) {
                            return (
                                <tr key={event.id} className="bg-blue-50/50 dark:bg-blue-900/10">
                                    <td className="px-4 py-3">
                                        <input
                                            type="datetime-local"
                                            value={editForm.timestamp}
                                            onChange={(e) => setEditForm({ ...editForm, timestamp: e.target.value })}
                                            className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={editForm.status}
                                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                            className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs"
                                        >
                                            <option value="pending">Order Confirmed</option>
                                            <option value="picked_up">Picked Up</option>
                                            <option value="in_transit">In Transit</option>
                                            <option value="customs_hold">Customs Hold</option>
                                            <option value="out_for_delivery">Out for Delivery</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3">
                                        <input
                                            type="text"
                                            value={editForm.location}
                                            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                            placeholder="Location"
                                            className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <input
                                            type="text"
                                            value={editForm.description}
                                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                            placeholder="Notes"
                                            className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs"
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-1">
                                            <button
                                                onClick={() => handleUpdate(event.id)}
                                                disabled={isSaving}
                                                className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                title="Save"
                                            >
                                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                disabled={isSaving}
                                                className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                                                title="Cancel"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }

                        return (
                            <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors group">
                                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                                    {new Date(event.timestamp).toLocaleString()}
                                </td>
                                <td className="px-4 py-3">
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {event.status.split('_').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                                    {event.location}
                                </td>
                                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                    {event.description}
                                </td>
                                <td className="px-4 py-3 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex justify-end gap-1">
                                        <button
                                            onClick={() => handleEdit(event)}
                                            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(event.id)}
                                            disabled={isDeleting === event.id}
                                            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            {isDeleting === event.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                    {(!events || events.length === 0) && (
                        <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                No tracking events recorded yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

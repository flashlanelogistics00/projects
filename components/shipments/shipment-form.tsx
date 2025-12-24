'use client'

import { useState } from 'react'
import { createShipment, updateShipment } from '@/app/dashboard/shipments/actions'
import { ArrowLeft, Package, User, MapPin, DollarSign, Loader2, Save } from 'lucide-react'
import Link from 'next/link'

interface ShipmentFormProps {
    initialData?: any
    isEditing?: boolean
}

export function ShipmentForm({ initialData, isEditing = false }: ShipmentFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError('')

        try {
            const formData = new FormData(e.currentTarget)

            // Calculate total
            const shipping = parseFloat(formData.get('shipping_cost') as string) || 0
            const tax = parseFloat(formData.get('tax') as string) || 0
            const insurance = parseFloat(formData.get('insurance') as string) || 0
            formData.set('total', (shipping + tax + insurance).toString())

            if (isEditing && initialData?.id) {
                await updateShipment(initialData.id, formData)
            } else {
                await createShipment(formData)
            }
        } catch (err: unknown) {
            console.error('Error:', err)
            setError(`Failed to ${isEditing ? 'update' : 'create'} shipment. Please try again.`)
            setIsSubmitting(false)
        }
    }

    // Helpers to safely get deep values
    const getVal = (path: string[], defaultValue = '') => {
        if (!initialData) return defaultValue
        return path.reduce((obj, key) => (obj && obj[key] !== undefined) ? obj[key] : undefined, initialData) ?? defaultValue
    }

    const shipper = initialData?.shipper_details || {}
    const receiver = initialData?.receiver_details || {}
    const pkg = initialData?.package_details || {}
    const cost = initialData?.cost_details || {}

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href={isEditing ? `/dashboard/shipments/${initialData.id}` : "/dashboard/shipments"}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {isEditing ? 'Edit Shipment' : 'Create Shipment'}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        {isEditing ? `Editing shipment ${initialData.tracking_number}` : 'Fill in the details to create a new shipment.'}
                    </p>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Route */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" /> Route Information
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Origin *</label>
                            <input
                                type="text"
                                name="origin"
                                required
                                defaultValue={initialData?.origin || ''}
                                placeholder="New York, USA"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Destination *</label>
                            <input
                                type="text"
                                name="destination"
                                required
                                defaultValue={initialData?.destination || ''}
                                placeholder="London, UK"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Shipper Details */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" /> Shipper Details
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name *</label>
                            <input
                                type="text"
                                name="shipper_name"
                                required
                                defaultValue={shipper.name || ''}
                                placeholder="John Doe"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address *</label>
                            <input
                                type="text"
                                name="shipper_address"
                                required
                                defaultValue={shipper.address || ''}
                                placeholder="123 Main St"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contact *</label>
                            <input
                                type="text"
                                name="shipper_contact"
                                required
                                defaultValue={shipper.contact || ''}
                                placeholder="+1 234 567 8900"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Receiver Details */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <User className="w-5 h-5 text-green-600" /> Receiver Details
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name *</label>
                            <input
                                type="text"
                                name="receiver_name"
                                required
                                defaultValue={receiver.name || ''}
                                placeholder="Jane Smith"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address *</label>
                            <input
                                type="text"
                                name="receiver_address"
                                required
                                defaultValue={receiver.address || ''}
                                placeholder="456 Oak Ave"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contact *</label>
                            <input
                                type="text"
                                name="receiver_contact"
                                required
                                defaultValue={receiver.contact || ''}
                                placeholder="+44 20 1234 5678"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Package Details */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Package className="w-5 h-5 text-blue-600" /> Package Details
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Weight (kg) *</label>
                            <input
                                type="number"
                                name="weight"
                                required
                                step="0.1"
                                min="0.1"
                                defaultValue={pkg.weight || ''}
                                placeholder="2.5"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dimensions (LxWxH)</label>
                            <input
                                type="text"
                                name="dimensions"
                                defaultValue={pkg.dimensions || ''}
                                placeholder="30x20x15 cm"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Package Type</label>
                            <select
                                name="package_type"
                                defaultValue={pkg.type || 'Box'}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                            >
                                <option value="Box">Box</option>
                                <option value="Envelope">Envelope</option>
                                <option value="Pallet">Pallet</option>
                                <option value="Crate">Crate</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Service Mode</label>
                            <select
                                name="service_mode"
                                defaultValue={pkg.service_mode || 'Standard'}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                            >
                                <option value="Standard">Standard</option>
                                <option value="Express">Express</option>
                                <option value="Priority">Priority</option>
                                <option value="Economy">Economy</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Status</label>
                            <select
                                name="payment_status"
                                defaultValue={pkg.payment_status || 'Pending'}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Expected Delivery</label>
                            <input
                                type="date"
                                name="expected_delivery"
                                defaultValue={pkg.expected_delivery || ''}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                            <textarea
                                name="description"
                                rows={2}
                                defaultValue={pkg.description || ''}
                                placeholder="Brief description of package contents..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Cost Details */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-600" /> Cost Details
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Shipping Cost ($)</label>
                            <input
                                type="number"
                                name="shipping_cost"
                                step="0.01"
                                min="0"
                                defaultValue={cost.shipping || 0}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tax ($)</label>
                            <input
                                type="number"
                                name="tax"
                                step="0.01"
                                min="0"
                                defaultValue={cost.tax || 0}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Insurance ($)</label>
                            <input
                                type="number"
                                name="insurance"
                                step="0.01"
                                min="0"
                                defaultValue={cost.insurance || 0}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4 justify-end">
                    <Link
                        href={isEditing ? `/dashboard/shipments/${initialData.id}` : "/dashboard/shipments"}
                        className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" /> {isEditing ? 'Updating...' : 'Creating...'}
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" /> {isEditing ? 'Save Changes' : 'Create Shipment'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}

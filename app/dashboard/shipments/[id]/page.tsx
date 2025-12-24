import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Package, User, MapPin, Clock, DollarSign, FileText, Truck, Pencil } from "lucide-react"
import { Metadata } from "next"
import { StatusUpdateForm } from "../StatusUpdateForm"
import { DeleteShipmentButton } from "@/components/shipments/delete-button"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: "Shipment Details",
}

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
    payment_status?: string
    expected_delivery?: string
}

interface CostDetails {
    shipping?: number
    tax?: number
    insurance?: number
    total?: number
}

export default async function ShipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: shipment, error } = await supabase
        .from('shipments')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !shipment) {
        notFound()
    }

    const { data: events } = await supabase
        .from('tracking_events')
        .select('*')
        .eq('shipment_id', id)
        .order('timestamp', { ascending: false })

    const shipper = shipment.shipper_details as unknown as Contact
    const receiver = shipment.receiver_details as unknown as Contact
    const pkg = shipment.package_details as unknown as PackageDetails
    const cost = shipment.cost_details as unknown as CostDetails

    const getStatusColor = (status: string | null) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-700'
            case 'in_transit': return 'bg-blue-100 text-blue-700'
            case 'out_for_delivery': return 'bg-amber-100 text-amber-700'
            case 'picked_up': return 'bg-indigo-100 text-indigo-700'
            case 'cancelled': return 'bg-red-100 text-red-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const formatStatus = (status: string | null) => {
        if (!status) return 'Pending'
        return status.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/shipments"
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{shipment.tracking_number}</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Created {new Date(shipment.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-full font-semibold text-sm ${getStatusColor(shipment.status)}`}>
                        {formatStatus(shipment.status)}
                    </span>
                    <Link
                        href={`/dashboard/shipments/${id}/invoice`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        <FileText className="w-4 h-4" /> Invoice
                    </Link>
                    <Link
                        href={`/dashboard/shipments/${id}/edit`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                    >
                        <Pencil className="w-4 h-4" /> Edit
                    </Link>
                    <DeleteShipmentButton shipmentId={id} />
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Route */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-600" /> Route
                        </h2>
                        <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                            <div className="flex-1">
                                <p className="text-sm text-gray-500 dark:text-gray-400">From</p>
                                <p className="font-semibold text-gray-900 dark:text-white">{shipment.origin || 'N/A'}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-0.5 bg-blue-600" />
                                <Truck className="w-5 h-5 text-blue-600" />
                                <div className="w-8 h-0.5 bg-blue-600" />
                            </div>
                            <div className="flex-1 text-right">
                                <p className="text-sm text-gray-500 dark:text-gray-400">To</p>
                                <p className="font-semibold text-gray-900 dark:text-white">{shipment.destination || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Shipper & Receiver */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-600" /> Shipper
                            </h2>
                            <div className="space-y-2 text-sm">
                                <p className="font-semibold text-gray-900 dark:text-white">{shipper?.name || 'N/A'}</p>
                                <p className="text-gray-500 dark:text-gray-400">{shipper?.address || 'N/A'}</p>
                                <p className="text-gray-500 dark:text-gray-400">{shipper?.contact || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-green-600" /> Receiver
                            </h2>
                            <div className="space-y-2 text-sm">
                                <p className="font-semibold text-gray-900 dark:text-white">{receiver?.name || 'N/A'}</p>
                                <p className="text-gray-500 dark:text-gray-400">{receiver?.address || 'N/A'}</p>
                                <p className="text-gray-500 dark:text-gray-400">{receiver?.contact || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Package Details */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5 text-blue-600" /> Package Details
                        </h2>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400">Weight</p>
                                <p className="font-semibold text-gray-900 dark:text-white">{pkg?.weight || 0} kg</p>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400">Dimensions</p>
                                <p className="font-semibold text-gray-900 dark:text-white">{pkg?.dimensions || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400">Type</p>
                                <p className="font-semibold text-gray-900 dark:text-white">{pkg?.type || 'Standard'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400">Service Mode</p>
                                <p className="font-semibold text-gray-900 dark:text-white">{pkg?.service_mode || 'Standard'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400">Payment Status</p>
                                <p className={`font-semibold ${pkg?.payment_status === 'Paid' ? 'text-green-600' : 'text-amber-600'}`}>
                                    {pkg?.payment_status || 'Pending'}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400">Expected Delivery</p>
                                <p className="font-semibold text-gray-900 dark:text-white">{pkg?.expected_delivery || 'N/A'}</p>
                            </div>
                            {pkg?.description && (
                                <div className="md:col-span-3">
                                    <p className="text-gray-500 dark:text-gray-400">Description</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{pkg.description}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tracking History Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-purple-600" /> Tracking History
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-900/50">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white rounded-l-lg">Date & Time</th>
                                        <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Status</th>
                                        <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Location</th>
                                        <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white rounded-r-lg">Notes</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {events?.map((event) => (
                                        <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
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
                                        </tr>
                                    ))}
                                    {(!events || events.length === 0) && (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                                No tracking events recorded yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Cost Details */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-green-600" /> Cost Details
                        </h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                                <span className="text-gray-900 dark:text-white">${(cost?.shipping || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Tax</span>
                                <span className="text-gray-900 dark:text-white">${(cost?.tax || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Insurance</span>
                                <span className="text-gray-900 dark:text-white">${(cost?.insurance || 0).toFixed(2)}</span>
                            </div>
                            <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between">
                                <span className="font-bold text-gray-900 dark:text-white">Total</span>
                                <span className="font-bold text-gray-900 dark:text-white">${(cost?.total || 0).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status Update */}
                    <StatusUpdateForm shipmentId={id} currentStatus={shipment.status} />
                </div>
            </div>
        </div>
    )
}

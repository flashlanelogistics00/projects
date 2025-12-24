import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Package, Plus, Search, Filter } from "lucide-react"
import { Metadata } from "next"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: "Shipments",
}

interface Contact {
    name?: string
}

export default async function ShipmentsPage() {
    const supabase = await createClient()

    const { data: shipments } = await supabase
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false })

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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shipments</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage all your shipments in one place.</p>
                </div>
                <Link
                    href="/dashboard/shipments/create"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 transition-colors"
                >
                    <Plus className="w-5 h-5" /> New Shipment
                </Link>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by tracking number..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                </div>
                <button className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                    <Filter className="w-5 h-5" /> Filter
                </button>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {shipments && shipments.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tracking #</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Origin</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Destination</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Receiver</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {shipments.map((shipment) => {
                                    const receiver = shipment.receiver_details as unknown as Contact
                                    return (
                                        <tr key={shipment.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="font-semibold text-gray-900 dark:text-white">
                                                    {shipment.tracking_number}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{shipment.origin || 'N/A'}</td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{shipment.destination || 'N/A'}</td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{receiver?.name || 'N/A'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(shipment.status)}`}>
                                                    {formatStatus(shipment.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
                                                {new Date(shipment.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    href={`/dashboard/shipments/${shipment.id}`}
                                                    className="text-blue-600 hover:text-blue-500 font-medium text-sm"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                        <Package className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                        <p className="mb-4">No shipments found.</p>
                        <Link
                            href="/dashboard/shipments/create"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Create First Shipment
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Package, Users, FileText, TrendingUp, ArrowRight, Plus } from "lucide-react"
import { Metadata } from "next"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: "Dashboard",
}

export default async function DashboardPage() {
    const supabase = await createClient()

    // Fetch stats
    const { count: totalShipments } = await supabase
        .from('shipments')
        .select('*', { count: 'exact', head: true })

    const { count: inTransit } = await supabase
        .from('shipments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'in_transit')

    const { count: delivered } = await supabase
        .from('shipments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'delivered')

    const { count: pendingMessages } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })

    // Fetch recent shipments
    const { data: recentShipments } = await supabase
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

    const stats = [
        { label: "Total Shipments", value: totalShipments || 0, icon: Package, color: "blue" },
        { label: "In Transit", value: inTransit || 0, icon: TrendingUp, color: "amber" },
        { label: "Delivered", value: delivered || 0, icon: FileText, color: "green" },
        { label: "Messages", value: pendingMessages || 0, icon: Users, color: "purple" },
    ]

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
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here&apos;s your logistics overview.</p>
                </div>
                <Link
                    href="/dashboard/shipments/create"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 transition-colors"
                >
                    <Plus className="w-5 h-5" /> New Shipment
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div
                        key={i}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-xl flex items-center justify-center`}>
                                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                        <div className="text-gray-500 dark:text-gray-400 text-sm">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Recent Shipments */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Shipments</h2>
                    <Link
                        href="/dashboard/shipments"
                        className="text-blue-600 hover:text-blue-500 font-medium text-sm flex items-center gap-1"
                    >
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {recentShipments && recentShipments.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tracking #</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Origin</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Destination</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {recentShipments.map((shipment) => (
                                    <tr key={shipment.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/dashboard/shipments/${shipment.id}`}
                                                className="font-semibold text-blue-600 hover:text-blue-500"
                                            >
                                                {shipment.tracking_number}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{shipment.origin || 'N/A'}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{shipment.destination || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(shipment.status)}`}>
                                                {formatStatus(shipment.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
                                            {new Date(shipment.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                        <Package className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                        <p>No shipments yet. Create your first shipment to get started.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

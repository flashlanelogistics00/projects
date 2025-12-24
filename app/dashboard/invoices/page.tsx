import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { FileText, DollarSign } from "lucide-react"
import { Metadata } from "next"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: "Invoices",
}

interface CostDetails {
    total?: number
}

interface PackageDetails {
    payment_status?: string
}

export default async function InvoicesPage() {
    const supabase = await createClient()

    const { data: shipments } = await supabase
        .from('shipments')
        .select('id, tracking_number, destination, cost_details, package_details, created_at')
        .order('created_at', { ascending: false })

    // Calculate totals
    let totalRevenue = 0
    let paidCount = 0
    let pendingCount = 0

    shipments?.forEach((shipment) => {
        const cost = shipment.cost_details as unknown as CostDetails
        const pkg = shipment.package_details as unknown as PackageDetails
        totalRevenue += cost?.total || 0
        if (pkg?.payment_status === 'Paid') {
            paidCount++
        } else {
            pendingCount++
        }
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invoices</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">View and manage all shipment invoices.</p>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">${totalRevenue.toFixed(2)}</div>
                            <div className="text-gray-500 dark:text-gray-400 text-sm">Total Revenue</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">{paidCount}</div>
                            <div className="text-gray-500 dark:text-gray-400 text-sm">Paid Invoices</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                            <FileText className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">{pendingCount}</div>
                            <div className="text-gray-500 dark:text-gray-400 text-sm">Pending Payment</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {shipments && shipments.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Invoice #</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Destination</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {shipments.map((shipment) => {
                                    const cost = shipment.cost_details as unknown as CostDetails
                                    const pkg = shipment.package_details as unknown as PackageDetails
                                    return (
                                        <tr key={shipment.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                                {shipment.tracking_number}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{shipment.destination || 'N/A'}</td>
                                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                                ${(cost?.total || 0).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${pkg?.payment_status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {pkg?.payment_status || 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
                                                {new Date(shipment.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    href={`/dashboard/shipments/${shipment.id}/invoice`}
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
                        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                        <p>No invoices yet. Create shipments to generate invoices.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

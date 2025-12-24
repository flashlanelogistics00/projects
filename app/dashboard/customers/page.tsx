import { createClient } from "@/lib/supabase/server"
import { Users, Package } from "lucide-react"
import { Metadata } from "next"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: "Customers",
}

interface Contact {
    name?: string
    address?: string
    contact?: string
}

export default async function CustomersPage() {
    const supabase = await createClient()

    const { data: shipments } = await supabase
        .from('shipments')
        .select('receiver_details, destination, created_at')
        .order('created_at', { ascending: false })

    // Extract unique customers from receiver details
    const customersMap = new Map<string, { name: string, address: string, contact: string, shipmentCount: number }>()

    shipments?.forEach((shipment) => {
        const receiver = shipment.receiver_details as unknown as Contact
        if (receiver?.name) {
            const key = receiver.name.toLowerCase()
            const existing = customersMap.get(key)
            if (existing) {
                existing.shipmentCount++
            } else {
                customersMap.set(key, {
                    name: receiver.name,
                    address: receiver.address || 'N/A',
                    contact: receiver.contact || 'N/A',
                    shipmentCount: 1
                })
            }
        }
    })

    const customers = Array.from(customersMap.values())

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Customers</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">View customers from your shipment history.</p>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">{customers.length}</div>
                            <div className="text-gray-500 dark:text-gray-400 text-sm">Total Customers</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                            <Package className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">{shipments?.length || 0}</div>
                            <div className="text-gray-500 dark:text-gray-400 text-sm">Total Shipments</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {customers.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Address</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Shipments</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {customers.map((customer, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                    <span className="text-blue-600 font-bold text-xs">
                                                        {customer.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <span className="font-semibold text-gray-900 dark:text-white">{customer.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{customer.address}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{customer.contact}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold">
                                                {customer.shipmentCount}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                        <Users className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                        <p>No customers yet. Create shipments to see customers here.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

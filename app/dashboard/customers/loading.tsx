import { Skeleton } from "@/components/ui/skeleton"

export default function CustomersLoading() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div>
                <Skeleton className="h-9 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
            </div>

            {/* Stats Skeleton */}
            <div className="grid md:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <Skeleton className="w-12 h-12 rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Customers Table Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
                            <tr>
                                {[...Array(4)].map((_, i) => (
                                    <th key={i} className="px-6 py-4">
                                        <Skeleton className="h-4 w-20" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {[...Array(5)].map((_, i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="w-8 h-8 rounded-full" />
                                            <Skeleton className="h-5 w-32" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-5 w-full" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-5 w-full" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-4 w-12 rounded-full" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

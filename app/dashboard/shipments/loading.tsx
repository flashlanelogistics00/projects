import { Skeleton } from "@/components/ui/skeleton"

export default function ShipmentsLoading() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-9 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-40 rounded-xl" />
            </div>

            {/* Filters Skeleton */}
            <div className="flex gap-4">
                <Skeleton className="flex-1 h-12 rounded-xl" />
                <Skeleton className="w-24 h-12 rounded-xl" />
            </div>

            {/* Table Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
                            <tr>
                                {[...Array(7)].map((_, i) => (
                                    <th key={i} className="px-6 py-4">
                                        <Skeleton className="h-4 w-20" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {[...Array(5)].map((_, i) => (
                                <tr key={i}>
                                    {[...Array(7)].map((_, j) => (
                                        <td key={j} className="px-6 py-4">
                                            <Skeleton className="h-5 w-full" />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

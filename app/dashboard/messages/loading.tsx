import { Skeleton } from "@/components/ui/skeleton"

export default function MessagesLoading() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div>
                <Skeleton className="h-9 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
            </div>

            {/* Messages List Skeleton */}
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-10 h-10 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-3 w-40" />
                                </div>
                            </div>
                            <Skeleton className="h-3 w-24" />
                        </div>

                        <Skeleton className="h-5 w-48 mb-2" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-2/3" />

                        <div className="mt-4 flex gap-2">
                            <Skeleton className="h-9 w-24 rounded-xl" />
                            <Skeleton className="h-9 w-24 rounded-xl" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

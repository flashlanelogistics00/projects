'use client'

import { startTransition, useState } from 'react'
import { Trash2, Loader2, AlertTriangle } from 'lucide-react'
import { deleteMessage } from '@/app/dashboard/messages/actions'
import { useRouter } from 'next/navigation'

export function DeleteMessageButton({ messageId }: { messageId: string }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            await deleteMessage(messageId)

            startTransition(() => {
                router.refresh()
                setIsDeleting(false)
                setShowConfirm(false)
            })
        } catch (error) {
            console.error('Failed to delete message', error)
            setIsDeleting(false)
            setShowConfirm(false)
        }
    }

    if (showConfirm) {
        return (
            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-800">
                <span className="text-sm text-red-600 dark:text-red-400 font-medium whitespace-nowrap">Delete?</span>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1"
                >
                    {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Yes'}
                </button>
                <button
                    onClick={() => setShowConfirm(false)}
                    disabled={isDeleting}
                    className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-2"
                >
                    No
                </button>
            </div>
        )
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold rounded-xl text-sm hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
        >
            <Trash2 className="w-4 h-4" /> Delete
        </button>
    )
}

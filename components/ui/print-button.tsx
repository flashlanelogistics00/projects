'use client'

import { Printer } from "lucide-react"

export function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 transition-colors"
        >
            <Printer className="w-4 h-4" /> Print Invoice
        </button>
    )
}

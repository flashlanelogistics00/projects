import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Metadata } from "next"
import { PrintButton } from "@/components/ui/print-button"
import { InvoiceTemplate } from "@/components/invoice/invoice-template"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: "Shipment Invoice",
}

export default async function PublicInvoicePage({ params }: { params: Promise<{ tracking_number: string }> }) {
    const { tracking_number } = await params
    const supabase = await createClient()

    // Fetch shipment by tracking number
    const { data: shipment, error } = await supabase
        .from('shipments')
        .select('*')
        .eq('tracking_number', tracking_number)
        .single()

    if (error || !shipment) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Actions */}
                <div className="flex items-center justify-between mb-6 print:hidden">
                    <Link
                        href={`/tracking?id=${tracking_number}`}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Tracking
                    </Link>
                    <PrintButton />
                </div>

                <InvoiceTemplate shipment={shipment} />
            </div>
        </div>
    )
}

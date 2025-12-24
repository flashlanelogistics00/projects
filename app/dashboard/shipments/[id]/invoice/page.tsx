import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download } from "lucide-react"
import { Metadata } from "next"
import { PrintButton } from "@/components/ui/print-button"
import { InvoiceTemplate } from "@/components/invoice/invoice-template"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: "Invoice",
}

interface Contact {
    name?: string
    address?: string
    contact?: string
}

interface PackageDetails {
    weight?: number
    dimensions?: string
    type?: string
    description?: string
    service_mode?: string
    payment_status?: string
}

interface CostDetails {
    shipping?: number
    tax?: number
    insurance?: number
    total?: number
}

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: shipment, error } = await supabase
        .from('shipments')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !shipment) {
        notFound()
    }

    const shipper = shipment.shipper_details as unknown as Contact
    const receiver = shipment.receiver_details as unknown as Contact
    const pkg = shipment.package_details as unknown as PackageDetails
    const cost = shipment.cost_details as unknown as CostDetails

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header Actions */}
            <div className="flex items-center justify-between mb-6 print:hidden">
                <Link
                    href={`/dashboard/shipments/${id}`}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Shipment
                </Link>
                <PrintButton />
            </div>

            <InvoiceTemplate shipment={shipment} />
        </div>
    )
}

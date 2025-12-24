import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ShipmentForm } from "@/components/shipments/shipment-form"

export default async function EditShipmentPage({ params }: { params: Promise<{ id: string }> }) {
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

    return <ShipmentForm initialData={shipment} isEditing={true} />
}

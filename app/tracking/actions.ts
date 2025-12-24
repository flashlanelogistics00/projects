'use server'

import { createClient } from "@/lib/supabase/server"
import { rateLimit } from "@/lib/rate-limit"
import { headers } from "next/headers"

export async function getShipmentAction(trackingNumber: string) {
    const headerList = await headers()
    const ip = headerList.get('x-forwarded-for') || 'unknown'

    // Limit to 20 searches per minute per IP
    const isAllowed = rateLimit(`track_${ip}`, 20, 60 * 1000)

    if (!isAllowed) {
        throw new Error('Too many searches. Please wait a minute.')
    }

    const supabase = await createClient()

    const { data: shipment, error } = await supabase
        .from('shipments')
        .select('*')
        .eq('tracking_number', trackingNumber.trim())
        .single()

    if (error || !shipment) {
        return { error: 'Shipment not found' }
    }

    const { data: events } = await supabase
        .from('tracking_events')
        .select('*')
        .eq('shipment_id', shipment.id)
        .order('timestamp', { ascending: false })

    return { shipment, events: events || [] }
}

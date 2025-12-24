'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { Database } from "@/lib/database.types"

// Generate tracking number
function generateTrackingNumber(): string {
    const prefix = 'FLL'
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `${prefix}-${timestamp}${random}`
}

// Create shipment
export async function createShipment(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const trackingNumber = generateTrackingNumber()

    const shipmentData = {
        user_id: user.id,
        tracking_number: trackingNumber,
        origin: formData.get('origin') as string,
        destination: formData.get('destination') as string,
        status: 'pending' as Database['public']['Enums']['shipment_status'],
        shipper_details: {
            name: formData.get('shipper_name') as string,
            address: formData.get('shipper_address') as string,
            contact: formData.get('shipper_contact') as string,
        },
        receiver_details: {
            name: formData.get('receiver_name') as string,
            address: formData.get('receiver_address') as string,
            contact: formData.get('receiver_contact') as string,
        },
        package_details: {
            weight: parseFloat(formData.get('weight') as string) || 0,
            dimensions: formData.get('dimensions') as string,
            type: formData.get('package_type') as string,
            description: formData.get('description') as string,
            service_mode: formData.get('service_mode') as string,
            payment_status: formData.get('payment_status') as string,
            expected_delivery: formData.get('expected_delivery') as string,
        },
        cost_details: {
            shipping: parseFloat(formData.get('shipping_cost') as string) || 0,
            tax: parseFloat(formData.get('tax') as string) || 0,
            insurance: parseFloat(formData.get('insurance') as string) || 0,
            total: parseFloat(formData.get('total') as string) || 0,
        },
    }

    const { error } = await supabase
        .from('shipments')
        .insert(shipmentData)

    if (error) {
        console.error('Error creating shipment:', error)
        throw new Error('Failed to create shipment')
    }

    // Add initial tracking event
    const { data: newShipment } = await supabase
        .from('shipments')
        .select('id')
        .eq('tracking_number', trackingNumber)
        .single()

    if (newShipment) {
        await supabase.from('tracking_events').insert({
            shipment_id: newShipment.id,
            status: 'Shipment Created',
            location: shipmentData.origin,
            description: 'Shipment has been created and is awaiting pickup.',
        })
    }

    revalidatePath('/dashboard/shipments')
    redirect('/dashboard/shipments')
}

// Update shipment status
export async function updateShipmentStatus(shipmentId: string, status: Database['public']['Enums']['shipment_status'], location: string, description?: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    // Update shipment status
    const { error: updateError } = await supabase
        .from('shipments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', shipmentId)

    if (updateError) {
        console.error('Error updating status:', updateError)
        throw new Error(`Failed to update status: ${updateError.message}`)
    }

    // Add tracking event
    const statusLabel = status.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
    const { error: eventError } = await supabase
        .from('tracking_events')
        .insert({
            shipment_id: shipmentId,
            status: status, // Use the raw enum value (e.g., 'picked_up') to satisfy DB constraint
            location,
            description: description || `Shipment status updated to ${statusLabel}`,
        })

    if (eventError) {
        console.error('Error adding tracking event:', eventError)
        throw new Error(`Failed to create tracking event: ${eventError.message} (Code: ${eventError.code})`)
    }

    revalidatePath(`/dashboard/shipments/${shipmentId}`)
    revalidatePath('/dashboard/shipments')
}

// Delete shipment
export async function deleteShipment(shipmentId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const { error } = await supabase
        .from('shipments')
        .delete()
        .eq('id', shipmentId)

    if (error) {
        console.error('Error deleting shipment:', error)
        throw new Error('Failed to delete shipment')
    }

    revalidatePath('/dashboard/shipments')
    redirect('/dashboard/shipments')
}

// Update shipment details (internal helper or direct usage)
export async function updateShipmentDetails(shipmentId: string, data: {
    origin?: string | undefined
    destination?: string | undefined
    shipper_details?: object | undefined
    receiver_details?: object | undefined
    package_details?: object | undefined
    cost_details?: object | undefined
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const { error } = await supabase
        .from('shipments')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', shipmentId)

    if (error) {
        console.error('Error updating shipment:', error)
        throw new Error('Failed to update shipment')
    }

    revalidatePath(`/dashboard/shipments/${shipmentId}`)
    revalidatePath('/dashboard/shipments')
}

// Update shipment from form data
export async function updateShipment(shipmentId: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const shipmentData = {
        origin: formData.get('origin') as string,
        destination: formData.get('destination') as string,
        shipper_details: {
            name: formData.get('shipper_name') as string,
            address: formData.get('shipper_address') as string,
            contact: formData.get('shipper_contact') as string,
        },
        receiver_details: {
            name: formData.get('receiver_name') as string,
            address: formData.get('receiver_address') as string,
            contact: formData.get('receiver_contact') as string,
        },
        package_details: {
            weight: parseFloat(formData.get('weight') as string) || 0,
            dimensions: formData.get('dimensions') as string,
            type: formData.get('package_type') as string,
            description: formData.get('description') as string,
            service_mode: formData.get('service_mode') as string,
            payment_status: formData.get('payment_status') as string,
            expected_delivery: formData.get('expected_delivery') as string,
        },
        cost_details: {
            shipping: parseFloat(formData.get('shipping_cost') as string) || 0,
            tax: parseFloat(formData.get('tax') as string) || 0,
            insurance: parseFloat(formData.get('insurance') as string) || 0,
            total: parseFloat(formData.get('total') as string) || 0,
        },
    }

    const { error } = await supabase
        .from('shipments')
        .update({ ...shipmentData, updated_at: new Date().toISOString() })
        .eq('id', shipmentId)

    if (error) {
        console.error('Error updating shipment:', error)
        throw new Error('Failed to update shipment')
    }

    revalidatePath(`/dashboard/shipments/${shipmentId}`)
    revalidatePath('/dashboard/shipments')
    redirect(`/dashboard/shipments/${shipmentId}`)
}

// Delete tracking event
export async function deleteTrackingEvent(eventId: string, shipmentId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const { error } = await supabase
        .from('tracking_events')
        .delete()
        .eq('id', eventId)

    if (error) {
        console.error('Error deleting event:', error)
        throw new Error('Failed to delete tracking event')
    }

    revalidatePath(`/dashboard/shipments/${shipmentId}`)
}

// Update tracking event
export async function updateTrackingEvent(eventId: string, shipmentId: string, data: {
    status: string,
    location: string,
    description: string,
    timestamp: string
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const { error } = await supabase
        .from('tracking_events')
        .update({
            status: data.status,
            location: data.location,
            description: data.description,
            timestamp: data.timestamp,
        })
        .eq('id', eventId)

    if (error) {
        console.error('Error updating event:', error)
        throw new Error('Failed to update tracking event')
    }

    revalidatePath(`/dashboard/shipments/${shipmentId}`)
}

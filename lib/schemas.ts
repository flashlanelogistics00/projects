import { z } from 'zod'

// Contact form schema
export const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    address: z.string().min(5, 'Address must be at least 5 characters'),
    contact: z.string().min(5, 'Contact must be at least 5 characters'),
})

// Cost details schema
export const costSchema = z.object({
    shipping: z.coerce.number().min(0, 'Shipping cost must be positive'),
    tax: z.coerce.number().min(0, 'Tax must be positive'),
    insurance: z.coerce.number().min(0, 'Insurance must be positive'),
    total: z.coerce.number().min(0, 'Total must be positive'),
})

// Shipment creation schema
export const shipmentSchema = z.object({
    origin: z.string().min(2, 'Origin is required'),
    destination: z.string().min(2, 'Destination is required'),
    shipper: contactSchema,
    receiver: contactSchema,
    weight: z.coerce.number().min(0.1, 'Weight must be greater than 0'),
    dimensions: z.string().optional(),
    type: z.string().optional(),
    service_mode: z.enum(['Standard', 'Express', 'Priority', 'Economy']).default('Standard'),
    description: z.string().optional(),
    payment_status: z.enum(['Paid', 'Pending']).default('Pending'),
    expected_delivery: z.string().optional(),
    costs: costSchema,
})

// Edit shipment schema (partial)
export const editShipmentSchema = z.object({
    origin: z.string().min(2, 'Origin is required'),
    destination: z.string().min(2, 'Destination is required'),
    dimensions: z.string().optional(),
    type: z.string().optional(),
    service_mode: z.string().optional(),
    description: z.string().optional(),
    payment_status: z.string().optional(),
    expected_delivery: z.string().optional(),
})

// Tracking event schema
export const trackingEventSchema = z.object({
    status: z.string().min(1, 'Status is required'),
    location: z.string().min(1, 'Location is required'),
    description: z.string().optional(),
})

// Contact message schema
export const contactMessageSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Valid email is required'),
    subject: z.string().optional(),
    message: z.string().min(10, 'Message must be at least 10 characters'),
})

// Type exports
export type ShipmentFormValues = z.infer<typeof shipmentSchema>
export type EditShipmentFormValues = z.infer<typeof editShipmentSchema>
export type TrackingEventFormValues = z.infer<typeof trackingEventSchema>
export type ContactMessageFormValues = z.infer<typeof contactMessageSchema>

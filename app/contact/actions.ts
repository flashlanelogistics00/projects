'use server'

import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { rateLimit } from "@/lib/rate-limit"
import { headers } from "next/headers"

export async function submitContactMessage(formData: FormData) {
    const headerList = await headers()
    const ip = headerList.get('x-forwarded-for') || 'unknown'

    // Limit to 3 messages per 10 minutes per IP
    const isAllowed = rateLimit(`contact_${ip}`, 3, 10 * 60 * 1000)

    if (!isAllowed) {
        throw new Error('Too many messages. Please try again in 10 minutes.')
    }
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const subject = formData.get('subject') as string
    const message = formData.get('message') as string

    if (!name || !email || !message) {
        throw new Error('Missing required fields')
    }

    // Declare supabase client variable
    let supabase

    // Use service role key if available to bypass RLS for public form
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        supabase = createSupabaseClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY,
            {
                auth: {
                    persistSession: false
                }
            }
        )
    } else {
        // Fallback to standard server client (subject to RLS)
        supabase = await createServerClient()
    }

    const { error } = await supabase
        .from('contact_messages')
        .insert({
            full_name: name,
            email,
            subject: subject || null,
            message
        })

    if (error) {
        console.error('Error submitting contact message:', error)
        throw new Error(`Failed to submit message: ${error.message}`)
    }

    return { success: true }
}

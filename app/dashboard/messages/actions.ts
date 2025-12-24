'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function deleteMessage(messageId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    // Standard deletion - requires RLS policy to be set
    const { data: deletedRows, error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', messageId)
        .select()

    if (error) {
        console.error('Error deleting message:', error)
        throw new Error(`Deletion Failed: ${error.message}`)
    }

    revalidatePath('/dashboard/messages')
}

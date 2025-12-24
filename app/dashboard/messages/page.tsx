import { createClient } from "@/lib/supabase/server"
import { Mail, Clock, User, MessageSquare } from "lucide-react"
import { Metadata } from "next"
import { DeleteMessageButton } from "@/components/messages/delete-button"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: "Messages",
}

export default async function MessagesPage() {
    const supabase = await createClient()

    const { data: messages } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">View and respond to customer inquiries.</p>
            </div>

            {/* Messages List */}
            <div className="space-y-4">
                {messages && messages.length > 0 ? (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                        <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">{message.full_name}</p>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                            <Mail className="w-3 h-3" />
                                            <a href={`mailto:${message.email}`} className="hover:text-blue-600">
                                                {message.email}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                    <Clock className="w-3 h-3" />
                                    {new Date(message.created_at).toLocaleString()}
                                </div>
                            </div>

                            {message.subject && (
                                <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{message.subject}</p>
                            )}
                            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{message.message}</p>

                            <div className="mt-4 flex gap-2">
                                <a
                                    href={`mailto:${message.email}?subject=Re: ${message.subject || 'Your inquiry'}`}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-500 transition-colors"
                                >
                                    <MessageSquare className="w-4 h-4" /> Reply
                                </a>
                                <DeleteMessageButton messageId={message.id} />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                        <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                        <p className="text-gray-500 dark:text-gray-400">No messages yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

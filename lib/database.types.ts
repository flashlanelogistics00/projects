export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            shipments: {
                Row: {
                    id: string
                    user_id: string | null
                    tracking_number: string
                    origin: string | null
                    destination: string | null
                    status: Database['public']['Enums']['shipment_status'] | null
                    shipper_details: Json | null
                    receiver_details: Json | null
                    package_details: Json | null
                    cost_details: Json | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    tracking_number: string
                    origin?: string | null
                    destination?: string | null
                    status?: Database['public']['Enums']['shipment_status'] | null
                    shipper_details?: Json | null
                    receiver_details?: Json | null
                    package_details?: Json | null
                    cost_details?: Json | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    tracking_number?: string
                    origin?: string | null
                    destination?: string | null
                    status?: Database['public']['Enums']['shipment_status'] | null
                    shipper_details?: Json | null
                    receiver_details?: Json | null
                    package_details?: Json | null
                    cost_details?: Json | null
                    created_at?: string
                    updated_at?: string
                }
            }
            tracking_events: {
                Row: {
                    id: string
                    shipment_id: string
                    status: string
                    location: string | null
                    description: string | null
                    timestamp: string
                }
                Insert: {
                    id?: string
                    shipment_id: string
                    status: string
                    location?: string | null
                    description?: string | null
                    timestamp?: string
                }
                Update: {
                    id?: string
                    shipment_id?: string
                    status?: string
                    location?: string | null
                    description?: string | null
                    timestamp?: string
                }
            }
            contact_messages: {
                Row: {
                    id: string
                    full_name: string
                    email: string
                    subject: string | null
                    message: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    full_name: string
                    email: string
                    subject?: string | null
                    message: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string
                    email?: string
                    subject?: string | null
                    message?: string
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            get_shipment_by_tracking: {
                Args: { tracking_num: string }
                Returns: Database['public']['Tables']['shipments']['Row'][]
            }
        }
        Enums: {
            shipment_status: 'pending' | 'picked_up' | 'in_transit' | 'customs_hold' | 'out_for_delivery' | 'delivered' | 'cancelled'
        }
    }
}

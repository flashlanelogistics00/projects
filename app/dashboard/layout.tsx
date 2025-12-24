import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
    LayoutDashboard, Package, Users, FileText, Mail, Settings, LogOut, Truck,
    ChevronRight
} from "lucide-react"

const sidebarLinks = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/shipments", icon: Package, label: "Shipments" },
    { href: "/dashboard/customers", icon: Users, label: "Customers" },
    { href: "/dashboard/invoices", icon: FileText, label: "Invoices" },
    { href: "/dashboard/messages", icon: Mail, label: "Messages" },
]

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/auth/login")
    }

    return (
        <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 flex items-center justify-center">
                            <img
                                src="/logo.png"
                                alt="FlashLane Logo"
                                className="w-full h-full object-contain dark:brightness-0 dark:invert"
                            />
                        </div>
                        <div>
                            <div className="font-bold text-gray-900 dark:text-white leading-tight">FlashLane</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</div>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {sidebarLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                        >
                            <link.icon className="w-5 h-5" />
                            <span className="font-medium">{link.label}</span>
                            <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    ))}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <span className="text-blue-600 font-bold">
                                {user.email?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {user.email}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
                        </div>
                    </div>
                    <form action="/auth/sign-out" method="post" className="mt-3">
                        <button
                            type="submit"
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}

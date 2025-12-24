import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import {
    Plane, Ship, Truck, Package, Warehouse, Shield, Globe, Clock,
    CheckCircle2, ArrowRight
} from "lucide-react"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Our Services",
    description: "Comprehensive logistics services including Air Freight, Ocean Freight, Road Transport, and Warehousing solutions.",
}

const services = [
    {
        icon: Plane,
        title: "Air Freight",
        description: "Expedited air shipping for your most time-sensitive shipments, connecting you to destinations worldwide.",
        features: ["Express Delivery", "Door-to-Door", "Real-time Tracking"],
        color: "blue"
    },
    {
        icon: Ship,
        title: "Ocean Freight",
        description: "Cost-effective ocean freight solutions for your maritime needs. FCL, LCL, and consolidation services.",
        features: ["FCL & LCL", "Port-to-Port", "Customs Clearance"],
        color: "cyan"
    },
    {
        icon: Truck,
        title: "Road Transport",
        description: "Flexible ground shipping solutions covering extensive routes across continents.",
        features: ["FTL & LTL", "Express Routes", "GPS Tracking"],
        color: "emerald"
    },
    {
        icon: Shield,
        title: "Secure Logistics",
        description: "Specialized handling for diplomatic cargo, confidential documents, and high-value items.",
        features: ["Armed Escorts", "Secure Facilities", "Chain of Custody"],
        color: "violet"
    },
    {
        icon: Warehouse,
        title: "Warehousing",
        description: "State-of-the-art warehousing facilities with climate control and inventory management.",
        features: ["Climate Control", "Inventory Mgmt", "Pick & Pack"],
        color: "amber"
    },
    {
        icon: Package,
        title: "Packaging",
        description: "Professional packaging services ensuring your goods are protected during transit.",
        features: ["Custom Crating", "Palletizing", "Fragile Handling"],
        color: "rose"
    }
]

export default function ServicesPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />

            {/* Hero Section */}
            <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070')] bg-cover bg-center opacity-20" />

                <div className="container mx-auto px-4 relative z-10 text-center pt-24">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300">Services</span>
                    </h1>
                    <p className="text-xl text-blue-100/80 max-w-2xl mx-auto leading-relaxed">
                        Comprehensive logistics solutions tailored to your unique shipping needs.
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-24 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
                            >
                                <div className="p-8">
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                                        style={{
                                            backgroundColor: `hsl(var(--brand-${service.color}) / 0.1)`,
                                            color: `hsl(var(--brand-${service.color}))`
                                        }}
                                    >
                                        <service.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{service.title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-6">{service.description}</p>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {service.features.map((feature, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full"
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                    </div>

                                    <Link
                                        href="/contact"
                                        className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:gap-3 transition-all"
                                    >
                                        Get Quote <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Why Choose <span className="text-blue-600">Flash Lane</span>?
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Clock, title: "Fast & Reliable", desc: "Express delivery options with 99.9% on-time guarantee." },
                            { icon: Shield, title: "Secure Handling", desc: "Advanced security and full insurance coverage." },
                            { icon: Globe, title: "Global Network", desc: "Offices in 150+ countries for seamless delivery." },
                        ].map((item, i) => (
                            <div key={i} className="text-center p-8 rounded-3xl bg-gray-50 dark:bg-gray-800">
                                <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                                    <item.icon className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-600">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-blue-100 max-w-2xl mx-auto mb-10">
                        Contact us today for a free quote and experience the Flash Lane difference.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all"
                        >
                            Contact Us <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/tracking"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all"
                        >
                            Track Shipment
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

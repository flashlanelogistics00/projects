import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Globe, Users, Award, Target, CheckCircle2 } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "About Us",
    description: "Learn about Flash Lane Logistics - a global leader in freight forwarding and supply chain management since 2010.",
}

export default function AboutPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />

            {/* Hero Section */}
            <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=2070')] bg-cover bg-center opacity-20" />

                <div className="container mx-auto px-4 relative z-10 text-center pt-24">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                        About <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300">Flash Lane</span>
                    </h1>
                    <p className="text-xl text-blue-100/80 max-w-2xl mx-auto leading-relaxed">
                        Delivering excellence in global logistics since 2010.
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
                                Our Story
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                                A Legacy of <span className="text-blue-600">Excellence</span>
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-lg mb-6 leading-relaxed">
                                Founded in 2010, Flash Lane Logistics has grown from a small regional carrier to a global logistics powerhouse. Our commitment to reliability, innovation, and customer satisfaction has made us the preferred partner for businesses worldwide.
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 leading-relaxed">
                                Today, we operate in over 150 countries, with a team of 5,000+ dedicated professionals working around the clock to ensure your shipments arrive safely and on time.
                            </p>

                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { value: "150+", label: "Countries" },
                                    { value: "5,000+", label: "Employees" },
                                    { value: "10M+", label: "Deliveries" },
                                    { value: "99.9%", label: "On-time Rate" },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                                        <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
                                        <div className="text-gray-500 dark:text-gray-400">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="rounded-3xl overflow-hidden shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=800"
                                    alt="Flash Lane Team"
                                    className="w-full h-[600px] object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-24 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-lg border border-gray-100 dark:border-gray-700">
                            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6">
                                <Target className="w-7 h-7 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h3>
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                                To provide fast, reliable, and secure logistics solutions that empower businesses to grow globally. We strive to exceed expectations through innovation, integrity, and unwavering commitment to our customers.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-lg border border-gray-100 dark:border-gray-700">
                            <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6">
                                <Globe className="w-7 h-7 text-indigo-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h3>
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                                To be the world&apos;s most trusted logistics partner, connecting businesses and people across borders with seamless, sustainable, and technology-driven supply chain solutions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Our Core <span className="text-blue-600">Values</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { icon: CheckCircle2, title: "Reliability", desc: "We deliver on our promises, every time." },
                            { icon: Users, title: "Customer Focus", desc: "Your success is our top priority." },
                            { icon: Award, title: "Excellence", desc: "We strive for the highest standards." },
                            { icon: Globe, title: "Global Reach", desc: "Local expertise, worldwide presence." },
                        ].map((value, i) => (
                            <div key={i} className="text-center">
                                <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                                    <value.icon className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{value.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

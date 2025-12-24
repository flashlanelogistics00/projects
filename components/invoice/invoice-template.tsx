import { Printer, MapPin, User, Package, Calendar, CreditCard, ShieldCheck, CheckCircle2, ScanBarcode, Globe, Mail } from "lucide-react"
import Image from "next/image"

interface Contact {
    name?: string
    address?: string
    contact?: string
}

interface PackageDetails {
    weight?: number
    dimensions?: string
    type?: string
    description?: string
    service_mode?: string
    payment_status?: string
}

interface CostDetails {
    shipping?: number
    tax?: number
    insurance?: number
    total?: number
}

interface InvoiceTemplateProps {
    shipment: {
        tracking_number: string
        created_at: string
        origin: string | null
        destination: string | null
        shipper_details: unknown
        receiver_details: unknown
        package_details: unknown
        cost_details: unknown
    }
}

export function InvoiceTemplate({ shipment }: InvoiceTemplateProps) {
    const shipper = shipment.shipper_details as Contact
    const receiver = shipment.receiver_details as Contact
    const pkg = shipment.package_details as PackageDetails
    const cost = shipment.cost_details as CostDetails

    return (
        <div className="bg-white text-gray-900 shadow-xl print:shadow-none max-w-[850px] mx-auto overflow-hidden">
            {/* Top Brand Section */}
            <div className="p-8 pb-4">
                <div className="flex justify-between items-start">
                    <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                            <Package className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold text-blue-900 uppercase tracking-tight">FlashLane Logistics</h1>
                            <p className="text-xs text-blue-600 font-semibold tracking-wider uppercase">Global Logistics Solutions</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500 uppercase font-semibold">Receipt Generated</p>
                        <p className="text-sm font-bold text-gray-900">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <div className="mt-2 inline-block bg-blue-50 text-blue-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide border border-blue-100">
                            Official Receipt
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-between items-end border-b border-gray-100 pb-6">
                    <div>
                        <h2 className="text-blue-600 font-bold mb-1">FlashLane Headquarters</h2>
                        <p className="text-xs text-gray-500">International Shipping & Logistics Services</p>
                    </div>
                    <div className="text-right text-xs text-gray-500 space-y-1">
                        <p className="flex items-center justify-end gap-2"><Mail className="w-3 h-3" /> support@flashlanelogistics.com</p>
                        <p className="flex items-center justify-end gap-2"><Globe className="w-3 h-3" /> www.flashlanelogistics.com</p>
                    </div>
                </div>
            </div>

            {/* Tracking Bar */}
            <div className="bg-[#0284c7] text-white px-8 py-4 flex justify-between items-center">
                <div>
                    <p className="text-[10px] uppercase opacity-80 font-semibold tracking-wider mb-1">Tracking Number</p>
                    <div className="flex items-center gap-3">
                        <ScanBarcode className="w-6 h-6 opacity-80" />
                        <span className="text-2xl font-mono font-bold tracking-wider">{shipment.tracking_number}</span>
                    </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full flex items-center gap-2 border border-white/20">
                    <CheckCircle2 className="w-4 h-4 text-green-300" />
                    <span className="text-xs font-bold uppercase tracking-wide">Verified Shipment</span>
                </div>
            </div>

            {/* 3-Column Info Grid */}
            <div className="p-8 bg-gray-50/50 border-b border-gray-100">
                <div className="grid grid-cols-3 gap-8">
                    {/* Sender */}
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 text-blue-600">
                            <User className="w-4 h-4" />
                            <h3 className="text-xs font-bold uppercase tracking-wider">Sender Details</h3>
                        </div>
                        <p className="font-bold text-gray-900 text-lg mb-2">{shipper?.name || 'N/A'}</p>
                        <div className="space-y-1 text-xs text-gray-600">
                            <p className="flex items-start gap-2"><MapPin className="w-3 h-3 mt-0.5 text-gray-400" /> {shipper?.address || 'N/A'}</p>
                            <p className="pl-5 text-gray-400">{shipper?.contact || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Receiver */}
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 text-blue-600">
                            <User className="w-4 h-4" />
                            <h3 className="text-xs font-bold uppercase tracking-wider">Receiver Details</h3>
                        </div>
                        <p className="font-bold text-gray-900 text-lg mb-2">{receiver?.name || 'N/A'}</p>
                        <div className="space-y-1 text-xs text-gray-600">
                            <p className="flex items-start gap-2"><MapPin className="w-3 h-3 mt-0.5 text-gray-400" /> {receiver?.address || 'N/A'}</p>
                            <p className="pl-5 text-gray-400">{receiver?.contact || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Shipment Meta */}
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-4 text-blue-600">
                                <Package className="w-4 h-4" />
                                <h3 className="text-xs font-bold uppercase tracking-wider">Shipment Info</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Service Type</span>
                                    <span className="font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{pkg?.service_mode || 'Standard'}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Total Weight</span>
                                    <span className="font-bold text-gray-900">{pkg?.weight || 0} kg</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Date</span>
                                    <span className="font-bold text-gray-900">{new Date(shipment.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Barcode Visual */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="h-8 w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjMyIj48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIzMiIgZmlsbD0iIzMzMyIvPjwvc3ZnPg==')] opacity-60"></div>
                            <p className="text-[10px] text-center mt-1 font-mono text-gray-400 tracking-[0.2em]">{shipment.tracking_number}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Line Items Table */}
            <div className="p-8">
                <div className="border rounded-lg overflow-hidden mb-8">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-left text-[10px] uppercase font-bold text-gray-500 tracking-wider">Description</th>
                                <th className="py-3 px-4 text-left text-[10px] uppercase font-bold text-gray-500 tracking-wider">Type</th>
                                <th className="py-3 px-4 text-right text-[10px] uppercase font-bold text-gray-500 tracking-wider">Shipping</th>
                                <th className="py-3 px-4 text-right text-[10px] uppercase font-bold text-gray-500 tracking-wider">Tax/Fees</th>
                                <th className="py-3 px-4 text-right text-[10px] uppercase font-bold text-gray-500 tracking-wider">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            <tr>
                                <td className="py-4 px-4 font-medium text-gray-900">
                                    FlashLane {pkg?.service_mode || 'Standard'} Delivery
                                    <p className="text-xs text-gray-400 font-normal mt-0.5">{pkg?.description || 'Standard logistics services'}</p>
                                </td>
                                <td className="py-4 px-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {pkg?.type || 'Package'}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-right text-gray-600 font-mono">${(cost?.shipping || 0).toFixed(2)}</td>
                                <td className="py-4 px-4 text-right text-gray-600 font-mono">${(cost?.tax || 0).toFixed(2)}</td>
                                <td className="py-4 px-4 text-right font-bold text-gray-900 font-mono">${(cost?.total || 0).toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="grid grid-cols-3 gap-8">
                    {/* Left: Payment & Verification */}
                    <div className="col-span-2 space-y-8">
                        <div>
                            <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
                                <CreditCard className="w-4 h-4 text-blue-600" /> Payment Information
                            </h4>
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center gap-4">
                                <Image
                                    src="/images/invoice/payment-methods.png"
                                    alt="Accepted Payment Methods"
                                    width={100}
                                    height={40}
                                    className="object-contain"
                                />
                                <p className="text-xs text-gray-500 max-w-xs">
                                    Secured payment via FlashLane Pay. This transaction has been verified and approved.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Stamp 1 */}
                            <div className="border border-gray-100 rounded-xl p-4 bg-white relative overflow-hidden group flex items-center justify-center">
                                <div className="text-center">
                                    <p className="text-xs font-semibold text-gray-400 mb-2 flex items-center justify-center gap-1"><ShieldCheck className="w-3 h-3" /> Digital Signature</p>
                                    <Image
                                        src="/images/invoice/digital-signature.png"
                                        alt="Verified Signature"
                                        width={120}
                                        height={60}
                                        className="object-contain opacity-90 transform -rotate-3"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">{new Date().toLocaleDateString()}</p>
                                </div>
                            </div>
                            {/* Stamp 2 */}
                            <div className="border border-gray-100 rounded-xl p-4 bg-white relative overflow-hidden flex items-center justify-center">
                                <div className="text-center">
                                    <p className="text-xs font-semibold text-gray-400 mb-2 flex items-center justify-center gap-1"><CheckCircle2 className="w-3 h-3" /> Approval Status</p>
                                    <Image
                                        src="/images/invoice/paid-stamp.png"
                                        alt="Paid Stamp"
                                        width={100}
                                        height={100}
                                        className="object-contain opacity-90"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Totals Card */}
                    <div className="bg-[#0284c7] rounded-xl text-white overflow-hidden shadow-lg shadow-blue-200">
                        <div className="p-4 bg-blue-800/30 border-b border-blue-500/30">
                            <h3 className="font-bold flex items-center gap-2">
                                Payment Summary
                            </h3>
                        </div>
                        <div className="p-6 space-y-3">
                            <div className="flex justify-between text-sm opacity-90">
                                <span>Subtotal</span>
                                <span className="font-mono">${(cost?.shipping || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm opacity-90">
                                <span>Tax & Fees</span>
                                <span className="font-mono">${(cost?.tax || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm opacity-90">
                                <span>Insurance</span>
                                <span className="font-mono">${(cost?.insurance || 0).toFixed(2)}</span>
                            </div>

                            <div className="pt-4 border-t border-white/20 mt-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-semibold opacity-90">Total Paid</span>
                                    <span className="text-2xl font-bold font-mono">${(cost?.total || 0).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-2">
                                <span className={`block w-full text-center py-2 rounded-lg text-xs font-bold uppercase tracking-wider ${pkg?.payment_status === 'Paid' ? 'bg-green-400 text-green-950' : 'bg-amber-400 text-amber-950'}`}>
                                    {pkg?.payment_status || 'Pending'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 border-t border-gray-100 p-8 text-center">
                <div className="flex justify-center mb-4">
                    <div className="h-10 w-10 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                        <ScanBarcode className="w-5 h-5 text-gray-400" />
                    </div>
                </div>
                <h3 className="text-blue-900 font-bold mb-1">Thank You for Choosing FlashLane</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    We appreciate your business and look forward to delivering your package safely. This is a computer-generated document and does not require a physical signature.
                </p>
                <p className="text-[10px] text-gray-400 mt-4 uppercase tracking-widest">FlashLane Logistics Inc &copy; {new Date().getFullYear()}</p>
            </div>
        </div>
    )
}

import { Link } from 'react-router-dom'
import BackButton from './BackButton'

function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount ?? 0)
}

function formatDate(iso) {
    if (!iso) return '-'
    return new Date(iso).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

const STATUS_FLOW = ['SEDANG_DIKEMAS', 'MENUNGGU_PENGIRIM', 'SEDANG_DIKIRIM', 'SELESAI']

const STATUS_LABELS = {
    SEDANG_DIKEMAS: 'Dikemas',
    MENUNGGU_PENGIRIM: 'Dijemput',
    SEDANG_DIKIRIM: 'Dikirim',
    SELESAI: 'Selesai',
}

const RETURNED = 'DIKEMBALIKAN'

const statusBadge = {
    SEDANG_DIKEMAS: 'badge-orange',
    MENUNGGU_PENGIRIM: 'badge-blue',
    SEDANG_DIKIRIM: 'badge-blue',
    SELESAI: 'badge-emerald',
    DIKEMBALIKAN: 'badge-red',
}

export default function OrderDetailView({ order, title, subtitle, backLabel }) {
    if (!order) return null

    const currentIdx = STATUS_FLOW.indexOf(order.status)

    return (
        <div className="space-y-6 animate-fade-in">
            <BackButton label={backLabel} />
            <div>
                {subtitle && <p className="text-xs font-bold text-ocean-500 uppercase tracking-widest">{subtitle}</p>}
                <h1 className="text-3xl font-extrabold text-slate-800 mt-1 tracking-tight">{title}</h1>
                <p className="text-slate-400 mt-1 font-mono text-sm">#{order.orderId}</p>
            </div>

            <div className="card p-5">
                <h2 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-ocean-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Progress Pengiriman
                </h2>

                {order.status === RETURNED ? (
                    <div className="status-tracker">
                        {STATUS_FLOW.map((key, idx) => {
                            const passed = idx < currentIdx
                            return (
                                <div key={key} className="status-step">
                                    {idx > 0 && (
                                        <div className={`status-line ${passed ? 'bg-slate-300' : 'bg-slate-200'}`} />
                                    )}
                                    <div className={`status-dot ${passed ? 'bg-slate-300 border-slate-300 text-white' : 'bg-white border-slate-300 text-slate-300'}`}>
                                        {passed ? '✓' : '○'}
                                    </div>
                                    <p className={`mt-2 text-[11px] font-semibold text-center leading-tight ${passed ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {STATUS_LABELS[key]}
                                    </p>
                                </div>
                            )
                        })}
                        <div className="status-step">
                            <div className="status-line bg-red-400" />
                            <div className="status-dot bg-red-500 border-red-500" />
                            <p className="mt-2 text-[11px] font-semibold text-center leading-tight text-red-600">
                                Dikembalikan
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="status-tracker">
                        {STATUS_FLOW.map((key, idx) => {
                            const completed = idx < currentIdx
                            const current = idx === currentIdx
                            return (
                                <div key={key} className="status-step">
                                    {idx > 0 && (
                                        <div className={`status-line ${idx <= currentIdx ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                                    )}
                                    <div className={`status-dot ${completed ? 'bg-emerald-500 border-emerald-500 text-white' : current ? 'ocean-gradient text-white ring-4 ring-ocean-200' : 'bg-white border-slate-300 text-slate-300'}`}>
                                        {completed ? '✓' : current ? '●' : '○'}
                                    </div>
                                    <p className={`mt-2 text-[11px] font-semibold text-center leading-tight ${completed || current ? 'text-slate-700' : 'text-slate-400'}`}>
                                        {STATUS_LABELS[key]}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <div className="card p-5">
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className={`${statusBadge[order.status] || 'badge-slate'}`}>
                                {order.statusLabel}
                            </span>
                            <span className="badge-slate">
                                {order.deliveryMethodLabel}
                            </span>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3 text-sm">
                            <Info label="Toko" value={<Link to={`/stores/${order.storeId}`} className="text-ocean-600 hover:underline font-semibold">{order.storeName}</Link>} />
                            {order.buyerUsername && <Info label="Buyer" value={order.buyerUsername} />}
                        </div>
                    </div>

                    <div className="card p-5">
                        <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-ocean-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            Item Pesanan
                        </h2>
                        <div className="space-y-3">
                            {order.items.map(item => (
                                <div key={item.productId} className="bg-ocean-50/30 border border-ocean-100 rounded-xl p-4">
                                    <div className="flex justify-between gap-4">
                                        <div className="min-w-0">
                                            <Link to={`/products/${item.productId}`} className="font-semibold text-slate-800 hover:text-ocean-600 transition truncate block">
                                                {item.productName}
                                            </Link>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {formatRupiah(item.unitPrice)} x {item.quantity}
                                            </p>
                                        </div>
                                        <p className="font-bold text-slate-700 flex-shrink-0">{formatRupiah(item.subtotal)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card p-5">
                        <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-ocean-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2M10 8.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm7 5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                            </svg>
                            Ringkasan Pembayaran
                        </h2>
                        <div className="rounded-xl bg-ocean-50/40 border border-ocean-100 p-5 space-y-2.5 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Subtotal</span>
                                <span className="font-bold text-slate-800">{formatRupiah(order.subtotal)}</span>
                            </div>
                            {order.discountSource && order.discountSource !== 'NONE' && (
                                <div className="flex justify-between text-emerald-600 bg-emerald-50/50 -mx-2 px-2 py-1 rounded-lg">
                                    <span>Diskon {order.discountLabel || `(${order.discountSource})`}</span>
                                    <span className="font-bold">−{formatRupiah(order.discountAmount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-slate-400 text-xs border-t border-ocean-100 pt-2">
                                <span>Dasar Pengenaan Pajak</span>
                                <span className="font-medium">{formatRupiah(order.taxBase)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Delivery fee</span>
                                <span className="font-bold text-slate-800">{formatRupiah(order.deliveryFee)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">PPN {order.taxRatePercent}%</span>
                                <span className="font-bold text-slate-800">{formatRupiah(order.taxAmount)}</span>
                            </div>
                            <div className="flex justify-between border-t border-ocean-100 pt-3">
                                <span className="font-bold text-slate-700">Total</span>
                                <span className="font-extrabold text-lg text-ocean-600">{formatRupiah(order.totalAmount)}</span>
                            </div>
                            <p className="text-xs text-slate-400 pt-1">
                                Diskon dipotong dari subtotal sebelum PPN 12%. PPN dihitung dari dasar pengenaan pajak (subtotal − diskon).
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="card p-5">
                        <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-ocean-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Alamat Kirim
                        </h2>
                        {order.shippingAddress ? (
                            <div className="text-sm space-y-1">
                                <p className="font-semibold text-slate-700">{order.shippingAddress.recipientName}</p>
                                <p className="text-slate-500">{order.shippingAddress.phone}</p>
                                <p className="text-slate-500 mt-2">{order.shippingAddress.fullAddress}</p>
                                <p className="text-slate-500">
                                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400">Tidak ada alamat</p>
                        )}
                    </div>

                    <div className="card p-5">
                        <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-ocean-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Riwayat Status
                        </h2>
                        <div className="space-y-4">
                            {order.statusHistory?.map((item, idx) => {
                                const isLast = idx === order.statusHistory.length - 1
                                return (
                                    <div key={`${item.status}-${item.changedAt}`} className="relative pl-5">
                                        <div className={`absolute left-1.5 top-2 w-2 h-2 rounded-full ${
                                            isLast ? 'bg-ocean-500 ring-2 ring-ocean-200' : 'bg-slate-300'
                                        }`} />
                                        {!isLast && (
                                            <div className="absolute left-[7px] top-4 bottom-0 w-0.5 bg-slate-200" />
                                        )}
                                        <div>
                                            <p className="font-semibold text-slate-700 text-sm">{item.statusLabel}</p>
                                            <p className="text-xs text-slate-400">{formatDate(item.changedAt)}</p>
                                            {item.note && <p className="text-xs text-slate-500 mt-0.5">{item.note}</p>}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Info({ label, value }) {
    return (
        <div className="rounded-xl bg-ocean-50/30 border border-ocean-100 p-4">
            <p className="text-xs font-semibold text-ocean-500 uppercase tracking-wide">{label}</p>
            <p className="mt-1 text-slate-700 font-semibold">{value}</p>
        </div>
    )
}

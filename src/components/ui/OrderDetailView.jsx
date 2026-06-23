import { Link } from 'react-router-dom'

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

export default function OrderDetailView({ order, title, subtitle, backLink, backLabel }) {
    if (!order) return null

    const currentIdx = STATUS_FLOW.indexOf(order.status)

    return (
        <div className="space-y-6">
            <Link
                to={backLink}
                className="inline-block text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
                {backLabel}
            </Link>
            <div className="-mt-2">
                <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">{subtitle}</p>
                <h1 className="text-3xl font-bold text-slate-800 mt-1">{title}</h1>
                <p className="text-slate-400 mt-1">#{order.orderId}</p>
            </div>

            <div className="bg-white border border-blue-100 rounded-2xl p-5">
                <h2 className="font-bold text-slate-800 mb-4">Progress Pengiriman</h2>
                <div className="flex items-start justify-between gap-1">
                    {STATUS_FLOW.map((key, idx) => {
                        const completed = idx < currentIdx
                        const current = idx === currentIdx
                        return (
                            <div key={key} className="flex-1 flex flex-col items-center relative">
                                {idx > 0 && (
                                    <div className={`hidden sm:block absolute -left-[calc(50%+12px)] top-4 w-[calc(100%-24px)] h-0.5 -translate-y-1/2 ${idx <= currentIdx ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                                )}
                                <div className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${completed ? 'bg-emerald-500 border-emerald-500 text-white' : current ? 'bg-blue-500 border-blue-500 text-white ring-4 ring-blue-200' : 'bg-white border-slate-300 text-slate-300'}`}>
                                    {completed ? '✓' : current ? '●' : '○'}
                                </div>
                                <p className={`mt-2 text-[11px] font-semibold text-center leading-tight ${completed || current ? 'text-slate-700' : 'text-slate-400'}`}>
                                    {STATUS_LABELS[key]}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white border border-blue-100 rounded-2xl p-5">
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                                {order.statusLabel}
                            </span>
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                                {order.deliveryMethodLabel}
                            </span>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3 text-sm">
                            <Info label="Toko" value={<Link to={`/stores/${order.storeId}`} className="text-blue-600 hover:underline">{order.storeName}</Link>} />
                            {order.buyerUsername && <Info label="Buyer" value={order.buyerUsername} />}
                        </div>
                    </div>

                    <div className="bg-white border border-blue-100 rounded-2xl p-5">
                        <h2 className="font-bold text-slate-800 mb-4">Item Pesanan</h2>
                        <div className="space-y-3">
                            {order.items.map(item => (
                                <div key={item.productId} className="border border-slate-200 rounded-xl p-4">
                                    <div className="flex justify-between gap-4">
                                        <div>
                                            <Link to={`/products/${item.productId}`} className="font-semibold text-slate-800 hover:text-blue-600 hover:underline">{item.productName}</Link>
                                            <p className="text-xs text-slate-400 mt-1">
                                                {formatRupiah(item.unitPrice)} x {item.quantity}
                                            </p>
                                        </div>
                                        <p className="font-semibold text-slate-700">{formatRupiah(item.subtotal)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-blue-100 rounded-2xl p-5">
                        <h2 className="font-bold text-slate-800 mb-4">Ringkasan Pembayaran</h2>
                        <div className="rounded-xl border border-slate-200 p-4 space-y-2 bg-slate-50/50 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Subtotal</span>
                                <span className="font-semibold text-slate-800">{formatRupiah(order.subtotal)}</span>
                            </div>
                            {order.discountSource && order.discountSource !== 'NONE' && (
                                <div className="flex justify-between text-emerald-600">
                                    <span>Diskon {order.discountLabel || `(${order.discountSource})`}</span>
                                    <span className="font-semibold">−{formatRupiah(order.discountAmount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-slate-400 text-xs border-t border-slate-200 pt-1">
                                <span>Dasar Pengenaan Pajak</span>
                                <span className="font-medium">{formatRupiah(order.taxBase)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Delivery fee</span>
                                <span className="font-semibold text-slate-800">{formatRupiah(order.deliveryFee)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">PPN {order.taxRatePercent}%</span>
                                <span className="font-semibold text-slate-800">{formatRupiah(order.taxAmount)}</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-200 pt-2">
                                <span className="font-bold text-slate-700">Total</span>
                                <span className="font-extrabold text-blue-700">{formatRupiah(order.totalAmount)}</span>
                            </div>
                            <p className="text-xs text-slate-400 pt-1">
                                Diskon dipotong dari subtotal sebelum PPN 12%.
                                PPN dihitung dari dasar pengenaan pajak (subtotal − diskon).
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-white border border-blue-100 rounded-2xl p-5">
                        <h2 className="font-bold text-slate-800 mb-4">Alamat Kirim</h2>
                        <p className="text-sm font-semibold text-slate-700">{order.shippingAddress?.recipientName}</p>
                        <p className="text-sm text-slate-500">{order.shippingAddress?.phone}</p>
                        <p className="text-sm text-slate-500 mt-2">{order.shippingAddress?.fullAddress}</p>
                        <p className="text-sm text-slate-500">
                            {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
                        </p>
                    </div>

                    <div className="bg-white border border-blue-100 rounded-2xl p-5">
                        <h2 className="font-bold text-slate-800 mb-4">Riwayat Status</h2>
                        <div className="space-y-3">
                            {order.statusHistory.map(item => (
                                <div key={`${item.status}-${item.changedAt}`} className="border-l-2 border-blue-200 pl-3">
                                    <p className="font-semibold text-slate-700 text-sm">{item.statusLabel}</p>
                                    <p className="text-xs text-slate-400">{formatDate(item.changedAt)}</p>
                                    {item.note && <p className="text-xs text-slate-500 mt-1">{item.note}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Info({ label, value, strong = false }) {
    return (
        <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">{label}</p>
            <p className={`mt-1 ${strong ? 'text-lg font-bold text-blue-700' : 'text-slate-700 font-semibold'}`}>
                {value}
            </p>
        </div>
    )
}

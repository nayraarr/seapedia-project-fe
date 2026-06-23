import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import Button from '../../../components/ui/Button'
import { getSellerIncomingOrders } from '../../../services/orderApi'

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

export default function IncomingOrdersPage() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        getSellerIncomingOrders()
            .then(res => setOrders(res.data.data || []))
            .catch(() => setError('Gagal memuat pesanan masuk.'))
            .finally(() => setLoading(false))
    }, [])

    return (
        <MainLayout>
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Seller</span>
                    <h1 className="text-3xl font-bold text-slate-800 mt-1">Pesanan Masuk</h1>
                    <p className="text-slate-400 mt-1">Daftar order yang masuk ke toko kamu</p>
                </div>
                <Link to="/dashboard/seller">
                    <Button variant="outline">Dashboard Seller</Button>
                </Link>
            </div>

            {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-2xl h-28 border border-emerald-50 animate-pulse" />
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-20 bg-white border border-emerald-100 rounded-2xl">
                    <p className="text-4xl mb-3">📬</p>
                    <p className="font-semibold text-slate-700">Belum ada pesanan masuk.</p>
                    <p className="text-sm text-slate-400 mt-1">Order baru akan muncul di sini setelah buyer checkout.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {orders.map(order => (
                        <div key={order.orderId} className="bg-white border border-emerald-100 rounded-2xl p-5">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-bold text-slate-800">{order.buyerUsername}</span>
                                        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
                                            {order.statusLabel}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-400 mt-1">{order.storeName}</p>
                                    <p className="text-sm text-slate-500 mt-2">
                                        {order.deliveryMethodLabel} • {order.itemCount} item • {formatDate(order.createdAt)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-left md:text-right">
                                        <p className="text-xs text-slate-400">Total</p>
                                        <p className="text-lg font-bold text-emerald-700">{formatRupiah(order.totalAmount)}</p>
                                    </div>
                                    <Link to={`/dashboard/seller/orders/${order.orderId}`}>
                                        <Button variant="outline">Lihat Detail</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </MainLayout>
    )
}

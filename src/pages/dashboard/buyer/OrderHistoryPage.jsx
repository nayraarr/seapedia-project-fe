import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import Button from '../../../components/ui/Button'
import BackButton from '../../../components/ui/BackButton'
import { getBuyerOrders } from '../../../services/orderApi'

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

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        getBuyerOrders()
            .then(res => setOrders(res.data.data || []))
            .catch(() => setError('Gagal memuat riwayat pesanan.'))
            .finally(() => setLoading(false))
    }, [])

    return (
        <MainLayout>
            <BackButton className="mb-3" />
            <div className="mb-6 flex items-start justify-between gap-4 animate-fade-in">
                <div>
                    <span className="text-xs font-bold text-ocean-500 uppercase tracking-widest">Buyer</span>
                    <h1 className="text-3xl font-bold text-slate-800 mt-1">Riwayat Pesanan</h1>
                    <p className="text-slate-400 mt-1">Lihat daftar checkout yang sudah berhasil dibuat</p>
                </div>
                <Link to="/dashboard/buyer/cart">
                    <Button variant="outline">Kembali ke Keranjang</Button>
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
                        <div key={i} className="skeleton h-28" />
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-20 card">
                    <p className="text-4xl mb-3">{'\u{1F4E6}'}</p>
                    <p className="font-semibold text-slate-700">Belum ada pesanan.</p>
                    <p className="text-sm text-slate-400 mt-1">Checkout pertama kamu akan muncul di sini.</p>
                </div>
            ) : (
                <div className="space-y-3 animate-slide-up">
                    {orders.map(order => (
                        <Link
                            key={order.orderId}
                            to={`/dashboard/buyer/orders/${order.orderId}`}
                            className="block card-hover p-5"
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-bold text-slate-800">{order.storeName}</span>
                                        <span className="badge-blue">
                                            {order.statusLabel}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-400 mt-1">{formatDate(order.createdAt)}</p>
                                    <p className="text-sm text-slate-500 mt-2">
                                        {order.deliveryMethodLabel} • {order.itemCount} item
                                    </p>
                                </div>
                                <div className="text-left md:text-right">
                                    <p className="text-xs text-slate-400">Total</p>
                                    <p className="text-lg font-bold text-ocean-700">{formatRupiah(order.totalAmount)}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </MainLayout>
    )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import Button from '../../../components/ui/Button'
import BackButton from '../../../components/ui/BackButton'
import { getSellerIncomingOrders, processSellerOrder } from '../../../services/orderApi'
import { Inbox, Package, TriangleAlert } from 'lucide-react'

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
    const [processingId, setProcessingId] = useState(null)
    const [filterTab, setFilterTab] = useState('incoming')

    const incomingOrders = orders.filter(o => o.status === 'SEDANG_DIKEMAS')
    const processedOrders = orders.filter(o => o.status !== 'SEDANG_DIKEMAS')
    const displayedOrders = filterTab === 'incoming' ? incomingOrders : processedOrders

    useEffect(() => {
        getSellerIncomingOrders()
            .then(res => setOrders(res.data.data || []))
            .catch(() => setError('Gagal memuat pesanan masuk.'))
            .finally(() => setLoading(false))
    }, [])

    const handleProcess = async (orderId) => {
        setProcessingId(orderId)
        try {
            await processSellerOrder(orderId)
            setOrders(prev => prev.map(o =>
                o.orderId === orderId
                    ? { ...o, status: 'MENUNGGU_PENGIRIM', statusLabel: 'Menunggu Pengirim' }
                    : o
            ))
        } catch {
            setError('Gagal memproses pesanan.')
        } finally {
            setProcessingId(null)
        }
    }

    return (
        <MainLayout>
            <BackButton className="mb-3" />
            <div className="mb-6 flex items-start justify-between gap-4 animate-fade-in">
                <div>
                    <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Seller</span>
                    <h1 className="text-3xl font-bold text-slate-800 mt-1">Pesanan Saya</h1>
                    <p className="text-slate-400 mt-1">Daftar order toko kamu</p>
                </div>
                <Link to="/dashboard/seller/report">
                    <Button variant="outline">Laporan</Button>
                </Link>
            </div>

            <div className="flex gap-1 mb-6 bg-emerald-50 rounded-xl p-1 w-fit">
                <button
                    onClick={() => setFilterTab('incoming')}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
                        filterTab === 'incoming' ? 'bg-white text-emerald-700 shadow-sm' : 'text-emerald-500 hover:text-emerald-700'
                    }`}
                >
                    Masuk ({incomingOrders.length})
                </button>
                <button
                    onClick={() => setFilterTab('processed')}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
                        filterTab === 'processed' ? 'bg-white text-emerald-700 shadow-sm' : 'text-emerald-500 hover:text-emerald-700'
                    }`}
                >
                    Diproses ({processedOrders.length})
                </button>
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
            ) : displayedOrders.length === 0 ? (
                <div className="text-center py-20 card animate-fade-in">
                    <div className="flex justify-center mb-3">{filterTab === 'incoming' ? <Inbox size={48} strokeWidth={1.5} /> : <Package size={48} strokeWidth={1.5} />}</div>
                    <p className="font-semibold text-slate-700">
                        {filterTab === 'incoming' ? 'Belum ada pesanan masuk.' : 'Belum ada pesanan diproses.'}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                        {filterTab === 'incoming'
                            ? 'Order baru akan muncul di sini setelah buyer checkout.'
                            : 'Pesanan yang sudah diproses akan muncul di sini.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3 animate-fade-in">
                    {displayedOrders.map(order => (
                        <div key={order.orderId} className={`card-hover p-5 ${
                            order.overdue
                                ? 'border-red-200'
                                : ''
                        }`}>
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-bold text-slate-800 text-lg">{order.storeName}</span>
                                        {order.overdue ? (
                                            <span className="badge-red">
                                                {order.statusLabel} <TriangleAlert size={14} strokeWidth={1.5} className="inline" />
                                            </span>
                                        ) : (
                                            <span className="badge-emerald">
                                                {order.statusLabel}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {order.deliveryMethodLabel} • {order.itemCount} item • {formatDate(order.createdAt)}
                                    </p>
                                    {order.discountSource && order.discountSource !== 'NONE' && (
                                        <p className="text-xs text-emerald-600 mt-1">
                                            Diskon {order.discountLabel || `(${order.discountSource})`}: −{formatRupiah(order.discountAmount)}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <div className="text-right">
                                        <p className="text-xs text-slate-400">Total</p>
                                        <p className="text-lg font-bold text-emerald-700">{formatRupiah(order.totalAmount)}</p>
                                    </div>
                                    {order.status === 'SEDANG_DIKEMAS' && (
                                        <Button
                                            variant="emerald"
                                            disabled={processingId === order.orderId}
                                            onClick={() => handleProcess(order.orderId)}
                                        >
                                            {processingId === order.orderId ? 'Memproses...' : 'Proses'}
                                        </Button>
                                    )}
                                    <Link to={`/dashboard/seller/orders/${order.orderId}`}>
                                        <Button variant="outline">Detail</Button>
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

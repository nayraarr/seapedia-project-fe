import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import Button from '../../../components/ui/Button'
import BackButton from '../../../components/ui/BackButton'
import { getBuyerSpendingReport } from '../../../services/orderApi'

function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
    }).format(amount ?? 0)
}

function formatDate(iso) {
    if (!iso) return '-'
    return new Date(iso).toLocaleString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    })
}

export default function SpendingReportPage() {
    const [report, setReport] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        getBuyerSpendingReport()
            .then(res => setReport(res.data.data))
            .catch(() => setError('Gagal memuat laporan pengeluaran.'))
            .finally(() => setLoading(false))
    }, [])

    return (
        <MainLayout>
            <BackButton className="mb-3" />
            <div className="mb-6 flex items-start justify-between gap-4 animate-fade-in">
                <div>
                    <span className="text-xs font-bold text-ocean-500 uppercase tracking-widest">Buyer</span>
                    <h1 className="text-3xl font-bold text-slate-800 mt-1">Laporan Pengeluaran</h1>
                    <p className="text-slate-400 mt-1">Ringkasan transaksi belanjamu di SEAPEDIA</p>
                </div>
                <Link to="/dashboard/buyer/orders">
                    <Button variant="outline">Lihat Riwayat Pesanan</Button>
                </Link>
            </div>

            {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="grid md:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="skeleton h-28" />
                    ))}
                </div>
            ) : report && (
                <div className="space-y-6 animate-slide-up">
                    <div className="grid md:grid-cols-3 gap-4">
                        <SummaryCard label="Total Belanja" value={formatRupiah(report.totalSpent)} accent="text-ocean-700" />
                        <SummaryCard label="Total Hemat dari Diskon" value={formatRupiah(report.totalDiscountSaved)} accent="text-emerald-600" />
                        <SummaryCard label="Total Pesanan" value={`${report.totalOrders} pesanan`} accent="text-slate-700" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <SummaryCard label="Total PPN Dibayar" value={formatRupiah(report.totalTax)} accent="text-slate-700" small />
                        <SummaryCard label="Total Ongkos Kirim" value={formatRupiah(report.totalDeliveryFee)} accent="text-slate-700" small />
                    </div>

                    <div className="card-hover p-4">
                        <h2 className="font-bold text-slate-800 mb-3 text-sm">Status Pesanan</h2>
                        <div className="flex flex-wrap gap-2">
                            {report.statusBreakdown.map(s => (
                                <span key={s.status} className="badge-blue">
                                    {s.statusLabel}: {s.count}
                                </span>
                            ))}
                        </div>
                        {report.cancelledOrders > 0 && (
                            <p className="text-xs text-slate-400 mt-3">
                                *Total belanja tidak menghitung {report.cancelledOrders} pesanan yang dibatalkan.
                            </p>
                        )}
                    </div>

                    <div className="card-hover p-4">
                        <h2 className="font-bold text-slate-800 mb-3 text-sm">Transaksi Terakhir</h2>
                        {report.recentOrders.length === 0 ? (
                            <p className="text-sm text-slate-400">Belum ada transaksi.</p>
                        ) : (
                            <div className="space-y-3">
                                {report.recentOrders.map(order => (
                                    <Link
                                        key={order.orderId}
                                        to={`/dashboard/buyer/orders/${order.orderId}`}
                                        className="block card-hover p-3"
                                    >
                                        <div className="flex justify-between items-center gap-3">
                                            <div>
                                                <p className="font-semibold text-slate-700 text-sm">{order.storeName}</p>
                                                <p className="text-xs text-slate-400">{formatDate(order.createdAt)} • {order.statusLabel}</p>
                                            </div>
                                            <p className="font-bold text-ocean-700">{formatRupiah(order.totalAmount)}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </MainLayout>
    )
}

function SummaryCard({ label, value, accent, small }) {
    return (
        <div className="card-hover p-4">
            <p className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">{label}</p>
            <p className={`mt-1 font-bold ${small ? 'text-base' : 'text-xl'} ${accent || 'text-slate-800'}`}>{value}</p>
        </div>
    )
}

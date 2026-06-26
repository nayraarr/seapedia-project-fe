import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import Button from '../../../components/ui/Button'
import { getSellerIncomeReport } from '../../../services/orderApi'

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

export default function IncomeReportPage() {
    const [report, setReport] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        getSellerIncomeReport()
            .then(res => setReport(res.data.data))
            .catch(() => setError('Gagal memuat laporan pendapatan.'))
            .finally(() => setLoading(false))
    }, [])

    return (
        <MainLayout>
            <Link
                to="/dashboard/seller"
                className="inline-block mb-2 text-sm font-semibold text-ocean-600 hover:text-ocean-700 hover:underline"
            >
                ← Kembali
            </Link>
            <div className="mb-6 flex items-start justify-between gap-4 animate-fade-in">
                <div>
                    <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Seller</span>
                    <h1 className="text-3xl font-bold text-slate-800 mt-1">Laporan Pendapatan</h1>
                    <p className="text-slate-400 mt-1">Ringkasan transaksi tokomu di SEAPEDIA</p>
                </div>
                <Link to="/dashboard/seller/orders/incoming">
                    <Button variant="outline">Lihat Pesanan Masuk</Button>
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
                <div className="space-y-6 animate-fade-in">
                    <div className="grid md:grid-cols-3 gap-4">
                        <SummaryCard label="Total Pendapatan" value={formatRupiah(report.totalIncome)} accent="text-emerald-700" />
                        <SummaryCard label="Pesanan Belum Diproses" value={`${report.incomingOrders} pesanan`} accent="text-amber-600" />
                        <SummaryCard label="Pesanan Sudah Diproses" value={`${report.processedOrders} pesanan`} accent="text-slate-700" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <SummaryCard label="Total Pesanan" value={`${report.totalOrders} pesanan`} accent="text-slate-700" small />
                        <SummaryCard label="Total Diskon Diberikan ke Buyer" value={formatRupiah(report.totalDiscountGiven)} accent="text-slate-700" small />
                    </div>

                    <div className="card-hover p-5">
                        <h2 className="font-bold text-slate-800 mb-4">Status Pesanan</h2>
                        <div className="flex flex-wrap gap-2">
                            {report.statusBreakdown.map(s => (
                                <span key={s.status} className="badge-emerald">
                                    {s.statusLabel}: {s.count}
                                </span>
                            ))}
                        </div>
                        {report.cancelledOrders > 0 && (
                            <p className="text-xs text-slate-400 mt-3">
                                *Total pendapatan tidak menghitung {report.cancelledOrders} pesanan yang dibatalkan.
                            </p>
                        )}
                    </div>

                    <div className="card-hover p-5">
                        <h2 className="font-bold text-slate-800 mb-4">Pesanan Terakhir</h2>
                        {report.recentOrders.length === 0 ? (
                            <p className="text-sm text-slate-400">Belum ada pesanan masuk.</p>
                        ) : (
                            <div className="space-y-3">
                                {report.recentOrders.map(order => (
                                    <Link
                                        key={order.orderId}
                                        to={`/dashboard/seller/orders/${order.orderId}`}
                                        className="block card-hover p-4"
                                    >
                                        <div className="flex justify-between items-center gap-3">
                                            <div>
                                                <p className="font-semibold text-slate-700 text-sm">{order.buyerUsername}</p>
                                                <p className="text-xs text-slate-400">{formatDate(order.createdAt)} • {order.statusLabel}</p>
                                            </div>
                                            <p className="font-bold text-emerald-700">{formatRupiah(order.totalAmount)}</p>
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
        <div className="card-hover p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">{label}</p>
            <p className={`mt-1 font-bold ${small ? 'text-lg' : 'text-2xl'} ${accent}`}>{value}</p>
        </div>
    )
}

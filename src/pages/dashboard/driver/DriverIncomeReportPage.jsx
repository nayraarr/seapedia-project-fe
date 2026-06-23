import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import { getDriverReport, getJobHistory } from '../../../services/deliveryApi'

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

export default function DriverIncomeReportPage() {
    const [report, setReport] = useState(null)
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        Promise.all([
            getDriverReport(),
            getJobHistory()
        ])
            .then(([reportRes, historyRes]) => {
                setReport(reportRes.data.data)
                setHistory(historyRes.data.data || [])
            })
            .catch(() => setError('Gagal memuat laporan.'))
            .finally(() => setLoading(false))
    }, [])

    const summaryCards = report ? [
        { label: 'Total Job Diambil', value: report.totalJobsTaken, icon: '📋', color: 'blue' },
        { label: 'Job Selesai', value: report.completedJobs, icon: '✅', color: 'emerald' },
        { label: 'Job Aktif', value: report.activeJobs, icon: '🚗', color: 'orange' },
        { label: 'Total Pendapatan', value: formatRupiah(report.totalIncome), icon: '💰', color: 'blue' },
    ] : []

    return (
        <MainLayout>
            <Link
                to="/dashboard/driver"
                className="inline-block mb-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
                ← Kembali
            </Link>
            <div className="mb-6">
                <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Driver</span>
                <h1 className="text-3xl font-bold text-slate-800 mt-1">Riwayat & Penghasilan</h1>
                <p className="text-slate-400 mt-1">Rekap penghasilan harian</p>
            </div>

            {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white rounded-2xl h-28 border border-orange-50 animate-pulse" />
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {summaryCards.map(card => (
                            <div key={card.label} className={`bg-white border border-${card.color}-100 rounded-2xl p-5`}>
                                <p className="text-2xl mb-2">{card.icon}</p>
                                <p className="text-2xl font-bold text-slate-800">{card.value}</p>
                                <p className="text-xs text-slate-400 mt-1">{card.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white border border-orange-100 rounded-2xl p-5">
                        <h2 className="font-bold text-slate-800 mb-4">Riwayat Job Selesai</h2>
                        {history.length === 0 ? (
                            <p className="text-sm text-slate-400 text-center py-8">
                                Belum ada job yang selesai.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {history.map(job => (
                                    <div key={job.deliveryJobId} className="border border-slate-200 rounded-xl p-4">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <p className="font-semibold text-slate-800">{job.storeName}</p>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    {job.deliveryMethodLabel} • {job.itemCount} item • {job.recipientName}
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    {formatDate(job.availableSince)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-semibold text-emerald-600">{formatRupiah(job.totalAmount)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </MainLayout>
    )
}
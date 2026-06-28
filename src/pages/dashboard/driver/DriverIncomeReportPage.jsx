import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import BackButton from '../../../components/ui/BackButton'
import { getDriverReport, getJobHistory } from '../../../services/deliveryApi'
import { ClipboardList, CheckCircle, Car, Wallet } from 'lucide-react'

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
        { label: 'Total Job Diambil', value: report.totalJobsTaken, icon: <ClipboardList size={24} strokeWidth={1.5} />, color: 'blue' },
        { label: 'Job Selesai', value: report.completedJobs, icon: <CheckCircle size={24} strokeWidth={1.5} />, color: 'emerald' },
        { label: 'Job Aktif', value: report.activeJobs, icon: <Car size={24} strokeWidth={1.5} />, color: 'orange' },
        { label: 'Total Pendapatan', value: formatRupiah(report.totalIncome), icon: <Wallet size={24} strokeWidth={1.5} />, color: 'blue' },
    ] : []

    return (
        <MainLayout>
            <BackButton className="mb-3" />
            <div className="mb-6 animate-fade-in">
                <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Driver</span>
                <h1 className="text-3xl font-bold text-slate-800 mt-1">Riwayat & Penghasilan</h1>
                <p className="text-slate-400 mt-1">Rekap penghasilan</p>
            </div>

            {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 animate-fade-in">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="skeleton h-28" />
                    ))}
                </div>
            ) : (
                <div className="animate-slide-up">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {summaryCards.map(card => (
                            <div key={card.label} className="card-hover p-4">
                                <p className="text-lg mb-1">{card.icon}</p>
                                <p className="text-lg font-bold text-slate-800">{card.value}</p>
                                <p className="text-[11px] text-slate-500 mt-0.5">{card.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="card-hover p-4">
                        <h2 className="font-bold text-slate-800 mb-3 text-sm">Riwayat Job Selesai</h2>
                        {history.length === 0 ? (
                            <p className="text-sm text-slate-400 text-center py-8">
                                Belum ada job yang selesai.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {history.map((job, i) => (
                                    <Link
                                        key={job.deliveryJobId}
                                        to={`/dashboard/driver/jobs/${job.deliveryJobId}`}
                                        className="block card-hover p-3"
                                        style={{ animationDelay: `${i * 0.05}s` }}
                                    >
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
                                                <p className="text-[11px] text-slate-400">Pendapatan</p>
                                                <p className="text-sm font-semibold text-emerald-600">{formatRupiah(job.deliveryFee)}</p>
                                            </div>
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

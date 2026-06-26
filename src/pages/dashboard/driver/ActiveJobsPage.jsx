import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import Button from '../../../components/ui/Button'
import { getActiveJobs, completeJob } from '../../../services/deliveryApi'

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

export default function ActiveJobsPage() {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [completingId, setCompletingId] = useState(null)

    useEffect(() => {
        getActiveJobs()
            .then(res => setJobs(res.data.data || []))
            .catch(() => setError('Gagal memuat job aktif.'))
            .finally(() => setLoading(false))
    }, [])

    const handleComplete = async (jobId) => {
        if (!confirm('Selesaikan pengiriman ini?')) return
        setCompletingId(jobId)
        try {
            await completeJob(jobId)
            setJobs(prev => prev.filter(j => j.deliveryJobId !== jobId))
        } catch {
            alert('Gagal menyelesaikan job.')
        } finally {
            setCompletingId(null)
        }
    }

    return (
        <MainLayout>
            <Link
                to="/dashboard/driver"
                className="inline-block mb-2 text-sm font-semibold text-ocean-600 hover:text-ocean-700 hover:underline"
            >
                ← Kembali
            </Link>
            <div className="mb-6 animate-fade-in">
                <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Driver</span>
                <h1 className="text-3xl font-bold text-slate-800 mt-1">Job Aktif</h1>
                <p className="text-slate-400 mt-1">Pesanan yang sedang kamu antar</p>
            </div>

            {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 animate-fade-in">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="space-y-3">
                    {[1, 2].map(i => (
                        <div key={i} className="skeleton h-28" />
                    ))}
                </div>
            ) : jobs.length === 0 ? (
                <div className="card text-center py-20 animate-fade-in">
                    <p className="text-4xl mb-3">🚗</p>
                    <p className="font-semibold text-slate-700">Belum ada job aktif.</p>
                    <p className="text-sm text-slate-400 mt-1">
                        Ambil job dari halaman Job Tersedia.
                    </p>
                    <Link to="/dashboard/driver/jobs" className="inline-block mt-4">
                        <Button variant="orange">Lihat Job Tersedia</Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-3 animate-slide-up">
                    {jobs.map((job, i) => (
                        <div key={job.deliveryJobId} className="card card-hover p-5" style={{ animationDelay: `${i * 0.05}s` }}>
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-bold text-slate-800 text-lg">{job.storeName}</span>
                                        {job.statusLabel && (
                                            <span className="badge-blue">
                                                {job.statusLabel}
                                            </span>
                                        )}
                                        <span className="badge-slate">
                                            {job.deliveryMethodLabel}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {job.itemCount} item • Tujuan: {job.recipientName}, {job.city} {job.postalCode}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Tersedia sejak {formatDate(job.availableSince)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <div className="text-right">
                                        <p className="text-xs text-slate-400">Total</p>
                                        <p className="text-lg font-bold text-ocean-700">{formatRupiah(job.totalAmount)}</p>
                                    </div>
                                    <Link to={`/dashboard/driver/jobs/${job.deliveryJobId}`}>
                                        <Button variant="outline">Detail</Button>
                                    </Link>
                                    <Button
                                        onClick={() => handleComplete(job.deliveryJobId)}
                                        disabled={completingId === job.deliveryJobId}
                                    >
                                        {completingId === job.deliveryJobId ? 'Menyelesaikan...' : 'Selesaikan'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </MainLayout>
    )
}

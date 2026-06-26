import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import Button from '../../../components/ui/Button'
import BackButton from '../../../components/ui/BackButton'
import { getAvailableJobs, takeJob } from '../../../services/deliveryApi'

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

export default function AvailableJobsPage() {
    const navigate = useNavigate()
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [takingId, setTakingId] = useState(null)

    useEffect(() => {
        getAvailableJobs()
            .then(res => setJobs(res.data.data || []))
            .catch(() => setError('Gagal memuat job yang tersedia.'))
            .finally(() => setLoading(false))
    }, [])

    const handleTake = useCallback(async (jobId) => {
        setTakingId(jobId)
        try {
            await takeJob(jobId)
            navigate('/dashboard/driver/active')
        } catch {
            setError('Gagal mengambil job. Mungkin sudah diambil driver lain.')
        } finally {
            setTakingId(null)
        }
    }, [navigate])

    return (
        <MainLayout>
            <BackButton className="mb-3" />
            <div className="mb-6 animate-fade-in">
                <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Driver</span>
                <h1 className="text-3xl font-bold text-slate-800 mt-1">Job Tersedia</h1>
                <p className="text-slate-400 mt-1">Pesanan yang siap diantar (status Menunggu Pengirim)</p>
            </div>

            {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 animate-fade-in">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="skeleton h-28" />
                    ))}
                </div>
            ) : jobs.length === 0 ? (
                <div className="card text-center py-20">
                    <p className="text-4xl mb-3">📍</p>
                    <p className="font-semibold text-slate-700">Belum ada job tersedia.</p>
                    <p className="text-sm text-slate-400 mt-1">
                        Job baru akan muncul di sini setelah seller memproses pesanan.
                    </p>
                </div>
            ) : (
                <div className="space-y-3 animate-slide-up">
                    {jobs.map((job, i) => (
                        <div key={job.deliveryJobId} className="card card-hover p-5" style={{ animationDelay: `${i * 0.05}s` }}>
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-bold text-slate-800 text-lg">{job.storeName}</span>
                                        <span className="badge-orange">
                                            Menunggu Pengirim
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {job.deliveryMethodLabel} • {job.itemCount} item • Tujuan: {job.recipientName}, {job.city} {job.postalCode}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Tersedia sejak {formatDate(job.availableSince)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <div className="text-right">
                                        <p className="text-xs text-slate-400">Total</p>
                                        <p className="text-lg font-bold text-orange-700">{formatRupiah(job.totalAmount)}</p>
                                    </div>
                                    <Button
                                        variant="orange"
                                        disabled={takingId === job.deliveryJobId}
                                        onClick={() => handleTake(job.deliveryJobId)}
                                    >
                                        {takingId === job.deliveryJobId ? 'Mengambil...' : 'Ambil'}
                                    </Button>
                                    <Link to={`/dashboard/driver/jobs/${job.deliveryJobId}`}>
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

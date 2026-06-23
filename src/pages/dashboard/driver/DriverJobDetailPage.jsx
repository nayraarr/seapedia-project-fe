import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import Button from '../../../components/ui/Button'
import OrderDetailView from '../../../components/ui/OrderDetailView'
import { getJobDetail, takeJob, completeJob } from '../../../services/deliveryApi'

function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount ?? 0)
}

export default function DriverJobDetailPage() {
    const navigate = useNavigate()
    const { jobId } = useParams()
    const [job, setJob] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [actionLoading, setActionLoading] = useState(false)

    const loadJob = () => {
        getJobDetail(jobId)
            .then(res => setJob(res.data.data))
            .catch(() => setError('Gagal memuat detail job.'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { loadJob() }, [jobId])

    const handleTake = async () => {
        setActionLoading(true)
        try {
            await takeJob(jobId)
            navigate('/dashboard/driver/active')
        } catch {
            setError('Gagal mengambil job. Mungkin sudah diambil driver lain.')
        } finally {
            setActionLoading(false)
        }
    }

    const handleComplete = async () => {
        setActionLoading(true)
        try {
            await completeJob(jobId)
            navigate('/dashboard/driver/active')
        } catch {
            setError('Gagal menyelesaikan pengiriman.')
        } finally {
            setActionLoading(false)
        }
    }

    return (
        <MainLayout>
            {loading ? (
                <div className="space-y-4">
                    <div className="bg-white rounded-2xl h-24 border border-orange-50 animate-pulse" />
                    <div className="bg-white rounded-2xl h-96 border border-orange-50 animate-pulse" />
                </div>
            ) : error ? (
                <div className="bg-white border border-red-100 rounded-2xl p-8 text-center">
                    <p className="text-red-600 font-semibold">{error}</p>
                    <Link to="/dashboard/driver/jobs" className="inline-block mt-4">
                        <Button variant="outline">Kembali ke Job Tersedia</Button>
                    </Link>
                </div>
            ) : (
                <>
                    <OrderDetailView
                        order={job}
                        title="Detail Job Pengiriman"
                        subtitle="Driver"
                        backLink="/dashboard/driver/jobs"
                        backLabel="← Kembali ke daftar job"
                    />
                    {job.status === 'SELESAI' && (
                        <div className="bg-gradient-to-r from-emerald-50 to-white border border-emerald-200 rounded-2xl p-5 mt-6">
                            <h2 className="font-bold text-slate-800 mb-3">Pendapatan</h2>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500">Biaya Pengiriman</p>
                                    <p className="text-sm text-slate-400 text-xs">{job.deliveryMethodLabel}</p>
                                </div>
                                <p className="text-2xl font-extrabold text-emerald-600">{formatRupiah(job.deliveryFee)}</p>
                            </div>
                        </div>
                    )}
                    {job.status === 'MENUNGGU_PENGIRIM' && (
                        <div className="mt-6 flex justify-center">
                            <Button variant="orange" disabled={actionLoading} onClick={handleTake} className="min-w-[240px] text-base py-3">
                                {actionLoading ? 'Mengambil...' : 'Ambil Job Ini'}
                            </Button>
                        </div>
                    )}
                    {job.status === 'SEDANG_DIKIRIM' && (
                        <div className="mt-6 flex justify-center">
                            <Button variant="emerald" disabled={actionLoading} onClick={handleComplete} className="min-w-[240px] text-base py-3">
                                {actionLoading ? 'Menyelesaikan...' : 'Selesaikan Pengiriman'}
                            </Button>
                        </div>
                    )}
                </>
            )}
        </MainLayout>
    )
}
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import Button from '../../../components/ui/Button'
import OrderDetailView from '../../../components/ui/OrderDetailView'
import { getJobDetail, takeJob } from '../../../services/deliveryApi'

export default function DriverJobDetailPage() {
    const navigate = useNavigate()
    const { jobId } = useParams()
    const [job, setJob] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [taking, setTaking] = useState(false)

    const loadJob = () => {
        getJobDetail(jobId)
            .then(res => setJob(res.data.data))
            .catch(() => setError('Gagal memuat detail job.'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { loadJob() }, [jobId])

    const handleTake = async () => {
        setTaking(true)
        try {
            await takeJob(jobId)
            navigate('/dashboard/driver/active')
        } catch {
            setError('Gagal mengambil job. Mungkin sudah diambil driver lain.')
        } finally {
            setTaking(false)
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
                    {job.status === 'MENUNGGU_PENGIRIM' && (
                        <div className="mt-6 flex justify-center">
                            <Button variant="orange" disabled={taking} onClick={handleTake} className="min-w-[240px] text-base py-3">
                                {taking ? 'Mengambil...' : 'Ambil Job Ini'}
                            </Button>
                        </div>
                    )}
                </>
            )}
        </MainLayout>
    )
}
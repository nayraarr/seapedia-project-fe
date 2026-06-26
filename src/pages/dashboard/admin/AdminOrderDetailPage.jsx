import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import OrderDetailView from '../../../components/ui/OrderDetailView'
import { getAdminOrderDetail } from '../../../services/adminApi'

export default function AdminOrderDetailPage() {
    const { orderId } = useParams()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        getAdminOrderDetail(orderId)
            .then(res => setOrder(res.data.data))
            .catch(() => setError('Gagal memuat detail pesanan.'))
            .finally(() => setLoading(false))
    }, [orderId])

    return (
        <MainLayout>
            {loading ? (
                <div className="space-y-4">
                    <div className="skeleton h-24" />
                    <div className="skeleton h-96" />
                </div>
            ) : error ? (
                <div className="card p-8 text-center animate-fade-in">
                    <p className="text-red-600 font-semibold">{error}</p>
                    <Link to="/dashboard/admin" className="inline-block mt-4 text-sm font-semibold text-ocean-600 hover:underline">
                        ← Kembali ke Dashboard Admin
                    </Link>
                </div>
            ) : (
                <div className="animate-fade-in">
                    <OrderDetailView
                        order={order}
                        title="Detail Pesanan"
                        subtitle="Admin"
                        backLabel="← Kembali"
                    />
                </div>
            )}
        </MainLayout>
    )
}

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
                    <div className="bg-white rounded-2xl h-24 border border-red-50 animate-pulse" />
                    <div className="bg-white rounded-2xl h-96 border border-red-50 animate-pulse" />
                </div>
            ) : error ? (
                <div className="bg-white border border-red-100 rounded-2xl p-8 text-center">
                    <p className="text-red-600 font-semibold">{error}</p>
                    <Link to="/dashboard/admin" className="inline-block mt-4 text-sm font-semibold text-blue-600 hover:underline">
                        ← Kembali ke Dashboard Admin
                    </Link>
                </div>
            ) : (
                <OrderDetailView
                    order={order}
                    title="Detail Pesanan"
                    subtitle="Admin"
                    backLabel="← Kembali"
                />
            )}
        </MainLayout>
    )
}

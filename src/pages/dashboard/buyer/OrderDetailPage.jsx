import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import Button from '../../../components/ui/Button'
import OrderDetailView from '../../../components/ui/OrderDetailView'
import { getBuyerOrderDetail } from '../../../services/orderApi'

export default function OrderDetailPage() {
    const { orderId } = useParams()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        getBuyerOrderDetail(orderId)
            .then(res => setOrder(res.data.data))
            .catch(() => setError('Gagal memuat detail pesanan.'))
            .finally(() => setLoading(false))
    }, [orderId])

    return (
        <MainLayout>
            {loading ? (
                <div className="space-y-4 animate-fade-in">
                    <div className="skeleton h-24" />
                    <div className="skeleton h-96" />
                </div>
            ) : error ? (
                <div className="card border-red-200 p-8 text-center animate-fade-in">
                    <p className="text-red-600 font-semibold">{error}</p>
                    <Link to="/dashboard/buyer/orders" className="inline-block mt-4">
                        <Button variant="outline">Kembali ke Riwayat</Button>
                    </Link>
                </div>
            ) : (
                <OrderDetailView
                    order={order}
                    title="Detail Pesanan"
                    subtitle="Buyer"
                    backLabel={'\u2190 Kembali'}
                />
            )}
        </MainLayout>
    )
}

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import Button from '../../../components/ui/Button'
import OrderDetailView from '../../../components/ui/OrderDetailView'
import { getSellerOrderDetail } from '../../../services/orderApi'

export default function SellerOrderDetailPage() {
    const { orderId } = useParams()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        getSellerOrderDetail(orderId)
            .then(res => setOrder(res.data.data))
            .catch(() => setError('Gagal memuat detail pesanan.'))
            .finally(() => setLoading(false))
    }, [orderId])

    return (
        <MainLayout>
            {loading ? (
                <div className="space-y-4">
                    <div className="bg-white rounded-2xl h-24 border border-emerald-50 animate-pulse" />
                    <div className="bg-white rounded-2xl h-96 border border-emerald-50 animate-pulse" />
                </div>
            ) : error ? (
                <div className="bg-white border border-red-100 rounded-2xl p-8 text-center">
                    <p className="text-red-600 font-semibold">{error}</p>
                    <Link to="/dashboard/seller/orders/incoming" className="inline-block mt-4">
                        <Button variant="outline">Kembali ke Pesanan Masuk</Button>
                    </Link>
                </div>
            ) : (
                <OrderDetailView
                    order={order}
                    title="Detail Pesanan Masuk"
                    subtitle="Seller"
                    backLink="/dashboard/seller/orders/incoming"
                    backLabel="← Kembali ke pesanan masuk"
                />
            )}
        </MainLayout>
    )
}

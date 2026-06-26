import { useEffect, useState, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import Button from '../../../components/ui/Button'
import OrderDetailView from '../../../components/ui/OrderDetailView'
import { getSellerOrderDetail, processSellerOrder } from '../../../services/orderApi'

export default function SellerOrderDetailPage() {
    const { orderId } = useParams()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [processing, setProcessing] = useState(false)

    const loadOrder = useCallback(() => {
        getSellerOrderDetail(orderId)
            .then(res => setOrder(res.data.data))
            .catch(() => setError('Gagal memuat detail pesanan.'))
            .finally(() => setLoading(false))
    }, [orderId])

    useEffect(() => { loadOrder() }, [loadOrder])

    const handleProcess = async () => {
        setProcessing(true)
        try {
            await processSellerOrder(orderId)
            loadOrder()
        } catch {
            setError('Gagal memproses pesanan.')
        } finally {
            setProcessing(false)
        }
    }

    return (
        <MainLayout>
            {loading ? (
                <div className="space-y-4 animate-fade-in">
                    <div className="skeleton h-24" />
                    <div className="skeleton h-96" />
                </div>
            ) : error ? (
                <div className="card border-red-100 p-8 text-center animate-fade-in">
                    <p className="text-red-600 font-semibold">{error}</p>
                    <Link to="/dashboard/seller/orders/incoming" className="inline-block mt-4">
                        <Button variant="outline">Kembali ke Pesanan Masuk</Button>
                    </Link>
                </div>
            ) : (
                <div className="animate-fade-in">
                    <OrderDetailView
                        order={order}
                        title="Detail Pesanan Masuk"
                        subtitle="Seller"
                    />
                    {order.status === 'SEDANG_DIKEMAS' && (
                        <div className="mt-6 flex justify-center">
                            <Button variant="emerald" disabled={processing} onClick={handleProcess} className="w-full sm:w-auto sm:min-w-[240px] text-base py-3">
                                {processing ? 'Memproses...' : 'Proses Pesanan'}
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </MainLayout>
    )
}

import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import api from '../../services/api'

export default function ProductDetailPage() {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    const formatPrice = (price) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)

    useEffect(() => {
        api.get(`/products/${id}`)
            .then(res => setProduct(res.data.data))
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return (
        <MainLayout>
            <div className="animate-pulse space-y-4">
                <div className="bg-gray-200 h-64 rounded-xl" />
                <div className="bg-gray-200 h-8 w-1/2 rounded" />
                <div className="bg-gray-200 h-4 w-1/4 rounded" />
            </div>
        </MainLayout>
    )

    if (notFound) return (
        <MainLayout>
            <div className="text-center py-20">
                <p className="text-gray-500 text-lg mb-4">Produk tidak ditemukan.</p>
                <Link to="/products" className="text-blue-600 hover:underline">← Kembali ke produk</Link>
            </div>
        </MainLayout>
    )

    return (
        <MainLayout>
            <Link to="/products" className="text-blue-600 hover:underline text-sm mb-6 inline-block">
                ← Kembali ke produk
            </Link>

            <div className="bg-white rounded-xl border border-gray-200 p-6 md:flex gap-8">
                {/* Image placeholder */}
                <div className="bg-gray-100 rounded-xl w-full md:w-64 h-64 flex items-center justify-center text-gray-400 flex-shrink-0 mb-6 md:mb-0">
                    No Image
                </div>

                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
                    <p className="text-3xl font-bold text-blue-600 mb-4">{formatPrice(product.price)}</p>
                    <p className="text-gray-600 mb-4">{product.description || 'Tidak ada deskripsi.'}</p>
                    <p className="text-sm text-gray-500 mb-6">Stok tersedia: <span className="font-semibold">{product.stock}</span></p>

                    {/* Guest: tidak bisa checkout */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
                        <Link to="/login" className="font-semibold underline">Masuk</Link> atau{' '}
                        <Link to="/register" className="font-semibold underline">daftar</Link>{' '}
                        untuk membeli produk ini.
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import api from '../../services/api'
import {useAuth} from "../../contexts/useAuth.jsx";

export default function ProductDetailPage() {
    const { id } = useParams()
    const { token } = useAuth()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    const formatPrice = (price) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price)

    useEffect(() => {
        api.get(`/products/${id}`)
            .then(res => setProduct(res.data.data))
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return (
        <MainLayout>
            <div className="animate-pulse space-y-4">
                <div className="bg-white rounded-2xl h-72 border border-blue-50" />
                <div className="bg-white rounded-xl h-8 w-1/2 border border-blue-50" />
                <div className="bg-white rounded-xl h-4 w-1/4 border border-blue-50" />
            </div>
        </MainLayout>
    )

    if (notFound) return (
        <MainLayout>
            <div className="text-center py-24">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-slate-600 text-lg font-semibold mb-2">Produk tidak ditemukan</p>
                <p className="text-slate-400 text-sm mb-6">Produk mungkin telah dihapus atau tidak tersedia.</p>
                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline"
                >
                    ← Kembali ke produk
                </Link>
            </div>
        </MainLayout>
    )

    return (
        <MainLayout>
            <Link
                to="/products"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium mb-6"
            >
                ← Kembali ke produk
            </Link>

            <div className="bg-white rounded-2xl border border-blue-100 p-6 md:flex gap-8">
                {/* Image */}
                <div className="bg-blue-50 rounded-2xl w-full md:w-72 h-72 flex flex-col items-center justify-center text-blue-300 flex-shrink-0 mb-6 md:mb-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm mt-2 text-blue-300">Belum ada gambar</span>
                </div>

                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">{product.name}</h1>
                    <p className="text-3xl font-extrabold text-blue-600 mb-4">{formatPrice(product.price)}</p>

                    <div className="flex items-center gap-2 mb-4">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${product.stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                            {product.stock > 0 ? `Stok: ${product.stock}` : 'Habis'}
                        </span>
                    </div>

                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                        {product.description || 'Tidak ada deskripsi untuk produk ini.'}
                    </p>

                    {/* blok info toko */}
                    {product.storeId && (
                        <Link
                            to={`/stores/${product.storeId}`}
                            className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 hover:bg-emerald-100 transition"
                        >
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl flex-shrink-0">
                                🏪
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-emerald-500 font-medium">Dijual oleh</p>
                                <p className="text-sm font-bold text-slate-800 truncate">{product.storeName}</p>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    )}

                    {!token && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
                            <Link to="/login" className="font-bold hover:underline">Masuk</Link>{' '}
                            atau{' '}
                            <Link to="/register" className="font-bold hover:underline">daftar</Link>{' '}
                            untuk membeli produk ini.
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    )
}
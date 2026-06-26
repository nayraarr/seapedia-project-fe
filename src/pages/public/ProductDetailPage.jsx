import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import Button from '../../components/ui/Button'
import BackButton from '../../components/ui/BackButton'
import api from '../../services/api'
import { useAuth } from '../../contexts/useAuth'
import { useCart } from '../../contexts/useCart'

export default function ProductDetailPage() {
    const { id } = useParams()
    const { token, activeRole } = useAuth()
    const { add } = useCart()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [quantity, setQuantity] = useState(1)
    const [adding, setAdding] = useState(false)
    const [message, setMessage] = useState(null)

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

    const handleAddToCart = async () => {
        setAdding(true)
        setMessage(null)
        const result = await add(product.id, quantity, product.storeId)
        setMessage(result.ok ? 'Produk ditambahkan ke keranjang' : result.message)
        setAdding(false)
    }

    if (loading) return (
        <MainLayout>
            <BackButton className="mb-3" />
            <div className="animate-pulse space-y-4">
                <div className="skeleton rounded-2xl h-72" />
                <div className="skeleton rounded-xl h-8 w-1/2" />
                <div className="skeleton rounded-xl h-4 w-1/4" />
            </div>
        </MainLayout>
    )

    if (notFound) return (
        <MainLayout>
            <BackButton className="mb-3" />
            <div className="text-center py-24 animate-fade-in">
                <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-700 mb-2">Produk tidak ditemukan</h2>
                <p className="text-slate-400 text-sm mb-6">Produk mungkin telah dihapus atau tidak tersedia.</p>
                <BackButton to="/products" label="Kembali ke produk" />
            </div>
        </MainLayout>
    )

    return (
        <MainLayout>
            <BackButton className="mb-3" />

            <div className="card p-6 sm:p-8 md:flex gap-8 animate-fade-in">
                <div className="ocean-gradient-subtle rounded-2xl w-full md:w-80 h-72 flex flex-col items-center justify-center text-ocean-300 flex-shrink-0 mb-6 md:mb-0 border border-ocean-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm mt-2 text-ocean-300 font-medium">Belum ada gambar</span>
                </div>

                <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-3 tracking-tight">{product.name}</h1>
                    <p className="text-3xl sm:text-4xl font-extrabold text-gradient mb-5">{formatPrice(product.price)}</p>

                    <div className="flex flex-wrap items-center gap-3 mb-5">
                        <span className={`badge ${product.stock > 0 ? 'badge-emerald' : 'badge-red'}`}>
                            {product.stock > 0 ? `Stok: ${product.stock}` : 'Habis'}
                        </span>
                        {product.storeName && (
                            <span className="badge-orange">{product.storeName}</span>
                        )}
                    </div>

                    <p className="text-slate-500 text-sm leading-relaxed mb-6 border-l-2 border-ocean-200 pl-4">
                        {product.description || 'Tidak ada deskripsi untuk produk ini.'}
                    </p>

                    {product.storeId && (
                        <Link
                            to={`/stores/${product.storeId}`}
                            className="flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-emerald-50/50 border border-emerald-200 rounded-xl p-4 mb-6 hover:from-emerald-100 hover:to-emerald-50 transition group"
                        >
                            <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-emerald-500 font-medium">Dijual oleh</p>
                                <p className="text-sm font-bold text-slate-800 truncate">{product.storeName}</p>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-400 flex-shrink-0 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    )}

                    {!token && (
                        <div className="bg-gradient-to-r from-ocean-50 to-ocean-50/30 border border-ocean-200 rounded-xl p-4 text-sm text-ocean-700">
                            <Link to="/login" className="font-bold hover:underline">Masuk</Link>{' '}
                            atau{' '}
                            <Link to="/register" className="font-bold hover:underline">daftar</Link>{' '}
                            untuk membeli produk ini.
                        </div>
                    )}

                    {token && activeRole === 'BUYER' && (
                        <div className="card bg-ocean-50/40 border-ocean-100 p-5">
                            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Jumlah</label>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            disabled={quantity <= 1}
                                            className="w-9 h-9 rounded-lg border-2 border-ocean-200 text-ocean-600 font-bold text-lg hover:bg-ocean-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                        >
                                            −
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                                            className="w-16 text-center border-2 border-ocean-200 rounded-lg px-2 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-ocean-300"
                                        />
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-9 h-9 rounded-lg border-2 border-ocean-200 text-ocean-600 font-bold text-lg hover:bg-ocean-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <Button
                                    variant="primary"
                                    onClick={handleAddToCart}
                                    disabled={adding || product.stock <= 0}
                                    className="flex-1 sm:flex-none"
                                >
                                    {adding ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Menambahkan...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 4h13m-6 0a1 1 0 100 2 1 1 0 000-2zm7 0a1 1 0 100 2 1 1 0 000-2z" />
                                            </svg>
                                            Tambah ke Keranjang
                                        </span>
                                    )}
                                </Button>
                            </div>
                            <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Keranjang buyer hanya bisa berisi produk dari satu toko.
                            </p>
                            {message && (
                                <p className={`text-sm mt-3 font-semibold ${message.includes('ditambahkan') ? 'text-emerald-600' : 'text-red-500'}`}>
                                    {message}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    )
}

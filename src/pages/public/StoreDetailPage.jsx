import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import ProductCard from '../../components/ui/ProductCard'
import { getStoreById } from '../../services/storeApi'
import api from '../../services/api'

export default function StoreDetailPage() {
    const { id } = useParams()
    const [store, setStore] = useState(null)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        Promise.all([
            getStoreById(id),
            api.get(`/products/store/${id}`)
        ])
            .then(([storeRes, productsRes]) => {
                setStore(storeRes.data.data)
                setProducts(productsRes.data.data || [])
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return (
        <MainLayout>
            <div className="max-w-2xl mx-auto space-y-4">
                <div className="bg-white animate-pulse rounded-2xl h-36 border border-blue-50" />
                <div className="bg-white animate-pulse rounded-2xl h-24 border border-blue-50" />
            </div>
        </MainLayout>
    )

    if (notFound) return (
        <MainLayout>
            <div className="text-center py-24">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-slate-600 font-semibold text-lg mb-2">Toko tidak ditemukan</p>
                <p className="text-slate-400 text-sm mb-6">Toko mungkin sudah tidak aktif.</p>
                <Link
                    to="/stores"
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline"
                >
                    ← Kembali ke pencarian toko
                </Link>
            </div>
        </MainLayout>
    )

    return (
        <MainLayout>
            <Link
                to="/stores"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium mb-6"
            >
                ← Kembali ke pencarian toko
            </Link>

            <div className="max-w-2xl mx-auto space-y-5">

                {/* Store Header */}
                <div className="bg-white border border-blue-100 rounded-2xl p-6">
                    <div className="flex items-start gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-3xl flex-shrink-0">
                            🏪
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-slate-800">{store.name}</h1>
                            <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                                {store.description || 'Belum ada deskripsi toko.'}
                            </p>
                            <div className="flex items-center gap-3 mt-3">
                                <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">
                                    Toko Aktif
                                </span>
                                <span className="text-slate-300 text-xs">
                                    Seller: {store.sellerUsername}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Store Info */}
                <div className="bg-white border border-blue-100 rounded-2xl p-6">
                    <h2 className="text-base font-bold text-slate-700 mb-4">Informasi Toko</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                            <span className="text-sm text-slate-400">Nama Toko</span>
                            <span className="text-sm font-semibold text-slate-700">{store.name}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                            <span className="text-sm text-slate-400">Penjual</span>
                            <span className="text-sm font-semibold text-slate-700">{store.sellerUsername}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-slate-400">Bergabung sejak</span>
                            <span className="text-sm font-semibold text-slate-700">
                                {store.createdAt
                                    ? new Date(store.createdAt).toLocaleDateString('id-ID', {
                                        day: 'numeric', month: 'long', year: 'numeric'
                                    })
                                    : '-'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Products */}
                <div className="bg-white border border-blue-100 rounded-2xl p-6">
                    <h2 className="text-base font-bold text-slate-700 mb-4">
                        Produk Toko
                        <span className="ml-2 text-xs font-normal text-slate-400">({products.length} produk)</span>
                    </h2>
                    {products.length === 0 ? (
                        <div className="bg-emerald-50 rounded-xl p-6 text-center">
                            <p className="text-emerald-300 text-sm font-medium">Belum ada produk di toko ini</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </MainLayout>
    )
}
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import ProductCard from '../../components/ui/ProductCard'
import Button from '../../components/ui/Button'
import BackButton from '../../components/ui/BackButton'

import { getStoreById, getMyStore } from '../../services/storeApi'
import { useAuth } from '../../contexts/useAuth'
import api from '../../services/api'
import { Store, AlertCircle, Package } from 'lucide-react'

export default function StoreDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { activeRole } = useAuth()
    const [store, setStore] = useState(null)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [isOwner, setIsOwner] = useState(false)

    useEffect(() => {
        Promise.all([
            getStoreById(id),
            api.get(`/products/store/${id}`),
            activeRole === 'SELLER' ? getMyStore().catch(() => null) : Promise.resolve(null)
        ])
            .then(([storeRes, productsRes, myStore]) => {
                setStore(storeRes.data.data)
                setProducts(productsRes.data.data || [])
                if (myStore) {
                    setIsOwner(String(myStore.data.data.id) === String(id))
                }
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false))
    }, [id, activeRole])

    if (loading) return (
        <MainLayout>
            <BackButton className="mb-4" />
            <div className="animate-pulse space-y-4">
                <div className="skeleton h-8 w-48" />
                <div className="skeleton h-32 rounded-lg" />
                <div className="skeleton h-48 rounded-lg" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[...Array(4)].map((_, i) => <div key={i} className="skeleton aspect-[3/4]" />)}
                </div>
            </div>
        </MainLayout>
    )

    if (notFound) return (
        <MainLayout>
            <BackButton className="mb-4" />
            <div className="text-center py-24">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle size={28} className="text-red-300" strokeWidth={1.5} />
                </div>
                <h2 className="text-lg font-bold text-slate-700 mb-1">Toko tidak ditemukan</h2>
                <p className="text-sm text-slate-400 mb-5">Toko mungkin sudah tidak aktif.</p>
                <Button onClick={() => navigate('/stores')} variant="primary" size="sm">Kembali ke toko</Button>
            </div>
        </MainLayout>
    )

    return (
        <MainLayout>
            <BackButton className="mb-4" />

            {/* Store Info */}
            <div className="rounded-lg border border-slate-200 p-5">
                <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-lg bg-ocean-100 flex items-center justify-center flex-shrink-0">
                        <Store size={26} className="text-ocean-600" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">{store.name}</h1>
                                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                    {store.description || 'Belum ada deskripsi toko.'}
                                </p>
                                <div className="flex items-center gap-3 mt-3">
                                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">Toko Aktif</span>
                                    <span className="text-xs text-slate-400">Seller: {store.ownerUsername}</span>
                                </div>
                            </div>
                            {isOwner && (
                                <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/seller/store')}>
                                    Edit
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Tabs */}
            <div className="mt-4 rounded-lg border border-slate-200">
                <div className="flex border-b border-slate-200">
                    <div className="px-5 py-3 text-sm font-semibold text-ocean-600 border-b-2 border-ocean-600">
                        Informasi Toko
                    </div>
                </div>
                <div className="p-5 space-y-3">
                    <InfoRow label="Nama Toko" value={store.name} />
                    <InfoRow label="Penjual" value={store.ownerUsername} />
                    <InfoRow label="Bergabung sejak" value={store.createdAt
                        ? new Date(store.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                        : '-'
                    } />
                </div>
            </div>

            {/* Products */}
            <div className="mt-4 rounded-lg border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Package size={16} strokeWidth={1.5} className="text-ocean-500" />
                        Produk Toko
                        <span className="ml-1 text-xs font-normal text-slate-400">({products.length} produk)</span>
                    </h2>
                    {isOwner && (
                        <Button size="sm" onClick={() => navigate('/dashboard/seller/products/new')}>
                            + Tambah Produk
                        </Button>
                    )}
                </div>
                {products.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-lg">
                        <Package size={28} className="text-slate-300 mx-auto mb-2" strokeWidth={1.5} />
                        <p className="text-sm font-medium text-slate-500">Belum ada produk di toko ini</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    )
}

function InfoRow({ label, value }) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
            <span className="text-sm text-slate-500">{label}</span>
            <span className="text-sm font-semibold text-slate-700">{value}</span>
        </div>
    )
}

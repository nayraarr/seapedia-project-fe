import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import ProductCard from '../../components/ui/ProductCard'
import Button from '../../components/ui/Button'
import BackButton from '../../components/ui/BackButton'
import { getStoreById, getMyStore } from '../../services/storeApi'
import { useAuth } from '../../contexts/useAuth'
import api from '../../services/api'

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
            <BackButton className="mb-3" />
            <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
                <div className="skeleton rounded-2xl h-36" />
                <div className="skeleton rounded-2xl h-72" />
            </div>
        </MainLayout>
    )

    if (notFound) return (
        <MainLayout>
            <BackButton className="mb-3" />
            <div className="text-center py-24 animate-fade-in">
                <div className="w-20 h-20 rounded-2xl bg-ocean-50 flex items-center justify-center mx-auto mb-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-ocean-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-700 mb-2">Toko tidak ditemukan</h2>
                <p className="text-slate-400 text-sm mb-6">Toko mungkin sudah tidak aktif.</p>
                <BackButton to="/stores" label="Kembali ke toko" />
            </div>
        </MainLayout>
    )

    return (
        <MainLayout>
            <BackButton className="mb-3" />

            <div className="max-w-2xl mx-auto space-y-5">
                <div className="card p-6 animate-fade-in">
                    <div className="flex items-start gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">{store.name}</h1>
                                    <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                                        {store.description || 'Belum ada deskripsi toko.'}
                                    </p>
                                    <div className="flex items-center gap-3 mt-3">
                                        <span className="badge-emerald text-xs">Toko Aktif</span>
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

                <div className="card p-6 animate-fade-in">
                    <h2 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-ocean-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Informasi Toko
                    </h2>
                    <div className="space-y-3">
                        <InfoRow label="Nama Toko" value={store.name} />
                        <InfoRow label="Penjual" value={store.ownerUsername} />
                        <InfoRow label="Bergabung sejak" value={store.createdAt
                            ? new Date(store.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                            : '-'
                        } />
                    </div>
                </div>

                <div className="card p-6 animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-slate-700 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-ocean-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
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
                        <div className="bg-gradient-to-r from-emerald-50 to-emerald-50/50 rounded-xl p-8 text-center border border-emerald-100">
                            <p className="text-emerald-500 font-medium">Belum ada produk di toko ini</p>
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

function InfoRow({ label, value }) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-ocean-50 last:border-0">
            <span className="text-sm text-slate-400">{label}</span>
            <span className="text-sm font-semibold text-slate-700">{value}</span>
        </div>
    )
}

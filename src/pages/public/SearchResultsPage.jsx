import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import ProductCard from '../../components/ui/ProductCard'
import api from '../../services/api'

export default function SearchResultsPage() {
    const [searchParams] = useSearchParams()
    const q = searchParams.get('q') || ''
    const [products, setProducts] = useState([])
    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!q.trim()) { setLoading(false); return }
        setLoading(true)
        Promise.all([
            api.get('/products'),
            api.get('/stores'),
        ])
            .then(([productsRes, storesRes]) => {
                const query = q.toLowerCase()
                setProducts((productsRes.data.data || []).filter(p =>
                    p.name?.toLowerCase().includes(query) ||
                    p.description?.toLowerCase().includes(query)
                ))
                setStores((storesRes.data.data || []).filter(s =>
                    s.name?.toLowerCase().includes(query) ||
                    s.description?.toLowerCase().includes(query)
                ))
            })
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [q])

    return (
        <MainLayout>
            <div className="mb-6">
                <p className="text-xs font-bold text-ocean-500 uppercase tracking-widest">Pencarian</p>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1 tracking-tight">
                    Hasil untuk "{q}"
                </h1>
                {!loading && products.length === 0 && stores.length === 0 && (
                    <p className="text-slate-400 text-sm mt-2">Tidak ada hasil yang ditemukan.</p>
                )}
            </div>

            {loading ? (
                <div className="space-y-4">
                    <div className="skeleton h-6 w-32" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[...Array(4)].map((_, i) => <div key={i} className="skeleton aspect-[3/4]" />)}
                    </div>
                </div>
            ) : (
                <>
                    {products.length > 0 && (
                        <section className="mb-8">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-sm font-bold text-slate-700">Produk ({products.length})</h2>
                                <Link to={`/products?search=${encodeURIComponent(q)}`} className="text-ocean-600 text-xs font-semibold hover:underline">
                                    Lihat Semua
                                </Link>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {products.slice(0, 4).map(p => (
                                    <ProductCard key={p.id} product={p} />
                                ))}
                            </div>
                        </section>
                    )}

                    {stores.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-sm font-bold text-slate-700 mb-3">Toko ({stores.length})</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {stores.map(store => (
                                    <Link key={store.id} to={`/stores/${store.id}`} className="block group">
                                        <div className="card-hover p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-ocean-100 flex items-center justify-center text-ocean-600 font-bold flex-shrink-0">
                                                    {store.name?.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-sm text-slate-800 truncate group-hover:text-ocean-600 transition">
                                                        {store.name}
                                                    </p>
                                                    <p className="text-xs text-slate-400 truncate">{store.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </>
            )}
        </MainLayout>
    )
}

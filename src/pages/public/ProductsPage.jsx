import { useEffect, useState } from 'react'
import MainLayout from '../../components/layout/MainLayout'
import ProductCard from '../../components/ui/ProductCard'
import BackButton from '../../components/ui/BackButton'
import api from '../../services/api'

export default function ProductsPage() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        api.get('/products')
            .then(res => setProducts(res.data.data || []))
            .catch(() => setProducts([]))
            .finally(() => setLoading(false))
    }, [])

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <MainLayout>
            <BackButton className="mb-3" />
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                    <span className="text-xs font-bold text-ocean-500 uppercase tracking-widest">Katalog</span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1 tracking-tight">Semua Produk</h1>
                    <p className="text-slate-400 text-sm mt-1">Temukan produk dari berbagai penjual di SEAPEDIA</p>
                </div>

                <div className="relative w-full sm:w-72">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Cari produk..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="input-field pl-10"
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="skeleton rounded-2xl h-64" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-20 h-20 rounded-2xl bg-ocean-50 flex items-center justify-center mx-auto mb-5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-ocean-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <p className="text-lg font-semibold text-slate-600 mb-1">Produk tidak ditemukan</p>
                    <p className="text-sm text-slate-400">Coba kata kunci lain</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {filtered.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </MainLayout>
    )
}

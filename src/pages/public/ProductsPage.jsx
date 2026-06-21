import { useEffect, useState } from 'react'
import MainLayout from '../../components/layout/MainLayout'
import ProductCard from '../../components/ui/ProductCard'
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
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-1">Semua Produk</h1>
                <p className="text-slate-400">Temukan produk dari berbagai penjual di SEAPEDIA</p>
            </div>

            {/* Search */}
            <div className="relative mb-8 max-w-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    placeholder="Cari produk..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition"
                />
            </div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white animate-pulse rounded-2xl h-52 border border-blue-50" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                    <p className="text-lg font-medium">Produk tidak ditemukan</p>
                    <p className="text-sm mt-1">Coba kata kunci lain</p>
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
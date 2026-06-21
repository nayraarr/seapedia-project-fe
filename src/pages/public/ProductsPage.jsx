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
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Semua Produk</h1>
                <p className="text-gray-500">Temukan produk dari berbagai penjual di SEAPEDIA</p>
            </div>

            {/* Search */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Cari produk..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full md:w-80 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-48" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <p className="text-gray-400">Produk tidak ditemukan.</p>
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
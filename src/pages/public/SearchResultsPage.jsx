import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import ProductCard from '../../components/ui/ProductCard'
import StoreCard from '../../components/ui/StoreCard'
import api from '../../services/api'
import { Search, Store } from 'lucide-react'

const sortOptions = [
    { key: 'relevance', label: 'Paling Sesuai' },
    { key: 'newest', label: 'Terbaru' },
    { key: 'cheapest', label: 'Termurah' },
    { key: 'most_expensive', label: 'Termahal' },
]

const tabs = [
    { key: 'produk', label: 'Produk' },
    { key: 'toko', label: 'Toko' },
]

export default function SearchResultsPage() {
    const [searchParams] = useSearchParams()
    const q = searchParams.get('q') || ''
    const [allProducts, setAllProducts] = useState([])
    const [allStores, setAllStores] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('produk')
    const [sortBy, setSortBy] = useState('relevance')

    useEffect(() => {
        if (!q.trim()) { setLoading(false); return }
        setLoading(true)
        Promise.all([
            api.get('/products'),
            api.get('/stores'),
        ])
            .then(([productsRes, storesRes]) => {
                setAllProducts(productsRes.data.data || [])
                setAllStores(storesRes.data.data || [])
            })
            .catch(() => {
                setAllProducts([])
                setAllStores([])
            })
            .finally(() => setLoading(false))
    }, [q])

    const query = q.toLowerCase().trim()

    const filteredProducts = useMemo(() => {
        if (!query) return []
        return allProducts.filter(p =>
            p.name?.toLowerCase().includes(query) ||
            p.description?.toLowerCase().includes(query)
        )
    }, [allProducts, query])

    const filteredStores = useMemo(() => {
        if (!query) return []
        return allStores.filter(s =>
            s.name?.toLowerCase().includes(query) ||
            s.description?.toLowerCase().includes(query)
        )
    }, [allStores, query])

    const sortedProducts = useMemo(() => {
        const list = [...filteredProducts]
        if (sortBy === 'newest') {
            list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        } else if (sortBy === 'cheapest') {
            list.sort((a, b) => (a.price || 0) - (b.price || 0))
        } else if (sortBy === 'most_expensive') {
            list.sort((a, b) => (b.price || 0) - (a.price || 0))
        }
        return list
    }, [filteredProducts, sortBy])

    const storeProductMap = useMemo(() => {
        const map = {}
        for (const p of allProducts) {
            if (!map[p.storeId]) map[p.storeId] = []
            map[p.storeId].push(p)
        }
        return map
    }, [allProducts])

    const currentCount = activeTab === 'produk' ? sortedProducts.length : filteredStores.length

    const handleTabChange = (key) => {
        setActiveTab(key)
        setSortBy('relevance')
    }

    if (!q.trim()) {
        return (
            <MainLayout>
                <div className="text-center py-24">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                        <Search size={24} className="text-slate-400" strokeWidth={1.5} />
                    </div>
                    <p className="text-base font-semibold text-slate-600">Masukkan kata kunci pencarian</p>
                    <p className="text-sm text-slate-400 mt-1">Gunakan kolom pencarian di atas untuk mencari produk atau toko</p>
                </div>
            </MainLayout>
        )
    }

    return (
        <MainLayout>
            {/* Header */}
            <div className="mb-5">
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">Hasil Pencarian</h1>
                <p className="text-sm text-slate-500 mt-0.5">
                    untuk &ldquo;<span className="font-semibold">{q}</span>&rdquo;
                </p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-200 mb-4">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => handleTabChange(tab.key)}
                        className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
                            activeTab === tab.key
                                ? 'text-ocean-600 border-ocean-600'
                                : 'text-slate-500 border-transparent hover:text-slate-700'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Info bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <p className="text-xs text-slate-500">
                    {loading ? 'Memuat...' : (
                        currentCount > 0
                            ? `Menampilkan 1–${currentCount} dari total ${currentCount} untuk "${q}"`
                            : `Tidak ada ${activeTab === 'produk' ? 'produk' : 'toko'} ditemukan untuk "${q}"`
                    )}
                </p>
                {activeTab === 'produk' && !loading && currentCount > 0 && (
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition self-start sm:self-auto"
                    >
                        {sortOptions.map(opt => (
                            <option key={opt.key} value={opt.key}>{opt.label}</option>
                        ))}
                    </select>
                )}
            </div>

            {/* Content */}
            {loading ? (
                activeTab === 'produk' ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[...Array(8)].map((_, i) => <div key={i} className="skeleton aspect-[3/4]" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-lg" />)}
                    </div>
                )
            ) : activeTab === 'produk' ? (
                sortedProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                            <Search size={24} className="text-slate-400" strokeWidth={1.5} />
                        </div>
                        <p className="text-base font-semibold text-slate-600 mb-1">Produk tidak ditemukan</p>
                        <p className="text-sm text-slate-400">Coba kata kunci lain</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {sortedProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )
            ) : (
                filteredStores.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                            <Store size={24} className="text-slate-400" strokeWidth={1.5} />
                        </div>
                        <p className="text-base font-semibold text-slate-600 mb-1">Toko tidak ditemukan</p>
                        <p className="text-sm text-slate-400">Coba kata kunci lain</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {filteredStores.map(store => (
                            <StoreCard
                                key={store.id}
                                store={store}
                                previewProducts={storeProductMap[store.id] || []}
                            />
                        ))}
                    </div>
                )
            )}
        </MainLayout>
    )
}

import { useEffect, useState, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import ProductCard from '../../components/ui/ProductCard'
import api from '../../services/api'
import { Search, X } from 'lucide-react'

const sortTabs = [
    { key: '', label: 'Semua' },
    { key: 'termurah', label: 'Termurah' },
    { key: 'termahal', label: 'Termahal' },
    { key: 'terbaru', label: 'Terbaru' },
]

const categoryLabels = {
    FASHION: 'Fashion',
    ELEKTRONIK: 'Elektronik',
    RUMAH_TANGGA: 'Rumah Tangga',
    BUKU: 'Buku',
    GAME: 'Game',
    MAKANAN: 'Makanan',
    HADIAH: 'Hadiah',
    LAINNYA: 'Lainnya',
}

export default function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const initialSearch = searchParams.get('search') || ''
    const initialCategory = searchParams.get('category') || ''
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState(initialSearch)
    const [sortBy, setSortBy] = useState('')

    useEffect(() => {
        api.get('/products')
            .then(res => setProducts(res.data.data || []))
            .catch(() => setProducts([]))
            .finally(() => setLoading(false))
    }, [])

    const handleSearch = (e) => {
        e.preventDefault()
        const params = {}
        if (search.trim()) params.search = search.trim()
        if (initialCategory) params.category = initialCategory
        setSearchParams(params)
    }

    const handleClearCategory = () => {
        const params = {}
        if (search.trim()) params.search = search.trim()
        setSearchParams(params)
    }

    let filtered = products

    const category = searchParams.get('category') || initialCategory
    if (category && categoryLabels[category]) {
        filtered = filtered.filter(p => p.category === category)
    }

    const query = searchParams.get('search') || ''
    if (query) {
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
        )
    }

    const sorted = [...filtered]
    if (sortBy === 'termurah') {
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0))
    } else if (sortBy === 'termahal') {
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0))
    } else if (sortBy === 'terbaru') {
        sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    }

    return (
        <MainLayout>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Semua Produk</h1>
                    {category && categoryLabels[category] && (
                        <div className="flex items-center gap-3 mt-2">
                            <span className="inline-flex items-center gap-2 text-sm font-bold text-ocean-700 bg-ocean-50 border border-ocean-200 px-4 py-2 rounded-lg">
                                {categoryLabels[category]}
                                <button onClick={handleClearCategory} className="hover:text-ocean-900">
                                    <X size={14} strokeWidth={2} />
                                </button>
                            </span>
                            {query && (
                                <span className="text-sm text-slate-500">
                                    Hasil untuk "<span className="font-semibold">{query}</span>"
                                </span>
                            )}
                        </div>
                    )}
                    {!category && query && (
                        <p className="text-sm text-slate-500 mt-0.5">
                            Hasil untuk "<span className="font-semibold">{query}</span>"
                        </p>
                    )}
                </div>

                <form onSubmit={handleSearch} className="relative w-full sm:w-64">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" strokeWidth={2} />
                    <input
                        type="text"
                        placeholder="Cari produk..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition"
                    />
                </form>
            </div>

            <div className="flex items-center gap-1 mb-5 border-b border-slate-200 overflow-x-auto">
                {sortTabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setSortBy(tab.key)}
                        className={`px-4 py-2 text-sm font-semibold border-b-2 transition whitespace-nowrap ${
                            sortBy === tab.key
                                ? 'text-ocean-600 border-ocean-600'
                                : 'text-slate-500 border-transparent hover:text-slate-700'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
                <div className="flex-1" />
                <span className="text-xs text-slate-400 flex-shrink-0">{sorted.length} produk</span>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="skeleton aspect-[3/4]" />
                    ))}
                </div>
            ) : sorted.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                        <Search size={24} className="text-slate-400" strokeWidth={1.5} />
                    </div>
                    <p className="text-base font-semibold text-slate-600 mb-1">Produk tidak ditemukan</p>
                    <p className="text-sm text-slate-400">Coba kata kunci atau filter lain</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {sorted.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </MainLayout>
    )
}

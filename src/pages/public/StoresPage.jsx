import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import { getAllStores } from '../../services/storeApi'

export default function StoresPage() {
    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        getAllStores()
            .then(res => setStores(res.data.data || []))
            .catch(() => setStores([]))
            .finally(() => setLoading(false))
    }, [])

    const filtered = stores.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <MainLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-1">Semua Toko</h1>
                <p className="text-slate-400">Temukan toko penjual terpercaya di SEAPEDIA</p>
            </div>

            {/* Search */}
            <div className="relative mb-8 max-w-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    placeholder="Cari toko..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition"
                />
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white animate-pulse rounded-2xl h-28 border border-blue-50" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-4xl mb-3">🔍</p>
                    <p className="text-slate-600 font-semibold">Toko tidak ditemukan</p>
                    <p className="text-slate-400 text-sm mt-1">Coba kata kunci lain</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map(store => (
                        <Link to={`/stores/${store.id}`} key={store.id} className="group">
                            <div className="bg-white border border-blue-100 rounded-2xl p-5 hover:shadow-md hover:border-blue-300 transition">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl flex-shrink-0">
                                        🏪
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h2 className="font-bold text-slate-800 truncate">{store.name}</h2>
                                        <p className="text-slate-400 text-sm mt-0.5 truncate">
                                            {store.description || 'Belum ada deskripsi toko.'}
                                        </p>
                                        <p className="text-slate-300 text-xs mt-1">
                                            Seller: {store.sellerUsername}
                                        </p>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </MainLayout>
    )
}
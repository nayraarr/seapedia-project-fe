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
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                    <span className="text-xs font-bold text-ocean-500 uppercase tracking-widest">Toko</span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1 tracking-tight">Semua Toko</h1>
                    <p className="text-slate-400 text-sm mt-1">Temukan toko penjual terpercaya di SEAPEDIA</p>
                </div>
                <div className="relative w-full sm:w-72">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Cari toko..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="input-field pl-10"
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="skeleton rounded-2xl h-28" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 animate-fade-in">
                    <div className="w-20 h-20 rounded-2xl bg-ocean-50 flex items-center justify-center mx-auto mb-5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-ocean-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <p className="text-lg font-semibold text-slate-600 mb-1">Toko tidak ditemukan</p>
                    <p className="text-sm text-slate-400">Coba kata kunci lain</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map(store => (
                        <Link to={`/stores/${store.id}`} key={store.id} className="group block">
                            <div className="card-hover p-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h2 className="font-bold text-slate-800 truncate group-hover:text-ocean-600 transition-colors">{store.name}</h2>
                                        <p className="text-slate-400 text-sm mt-0.5 line-clamp-2">
                                            {store.description || 'Belum ada deskripsi toko.'}
                                        </p>
                                        <p className="text-slate-300 text-xs mt-1">
                                            Seller: {store.ownerUsername}
                                        </p>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-300 group-hover:text-ocean-500 transition flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

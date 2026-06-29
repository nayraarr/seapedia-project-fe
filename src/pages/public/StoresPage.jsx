import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import { getAllStores } from '../../services/storeApi'
import { Search, Store } from 'lucide-react'

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
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Semua Toko</h1>
                </div>

                <div className="relative w-full sm:w-64">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" strokeWidth={2} />
                    <input
                        type="text"
                        placeholder="Cari toko..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition"
                    />
                </div>
            </div>

            <div className="flex items-center gap-1 mb-5 border-b border-slate-200">
                <span className="text-xs text-slate-400 ml-auto">{filtered.length} toko</span>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="skeleton h-24 rounded-lg" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                        <Store size={24} className="text-slate-400" strokeWidth={1.5} />
                    </div>
                    <p className="text-base font-semibold text-slate-600 mb-1">Toko tidak ditemukan</p>
                    <p className="text-sm text-slate-400">Coba kata kunci lain</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filtered.map(store => (
                        <Link to={`/stores/${store.id}`} key={store.id} className="group block">
                            <div className="border border-slate-200 rounded-lg p-4 hover:border-ocean-300 hover:shadow-sm transition">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                        <Store size={22} className="text-emerald-600" strokeWidth={1.5} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h2 className="font-bold text-slate-800 truncate group-hover:text-ocean-600 transition-colors">{store.name}</h2>
                                        <p className="text-slate-400 text-sm truncate">
                                            {store.description || 'Belum ada deskripsi toko.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </MainLayout>
    )
}

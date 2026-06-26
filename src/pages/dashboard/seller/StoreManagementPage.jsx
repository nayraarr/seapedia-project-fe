import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import Button from '../../../components/ui/Button'
import ProductCard from '../../../components/ui/ProductCard'
import Input from '../../../components/ui/Input'
import { createStore, getMyStore, updateStore } from '../../../services/storeApi'
import { getMyProducts } from '../../../services/productApi'
import { useAuth } from '../../../contexts/useAuth'

export default function StoreManagementPage() {
    const [store, setStore] = useState(null)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ name: '', description: '' })
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { decoded } = useAuth()

    useEffect(() => {
        getMyStore()
            .then(res => {
                setStore(res.data.data)
                return getMyProducts()
            })
            .then(res => setProducts(res.data.data || []))
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false))
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSubmitting(true)
        try {
            const res = store
                ? await updateStore(form)
                : await createStore(form)
            setStore(res.data.data)
            setShowForm(false)
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal menyimpan toko.')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return (
        <MainLayout>
            <div className="max-w-2xl mx-auto space-y-4">
                <div className="skeleton h-40" />
                <div className="skeleton h-28" />
            </div>
        </MainLayout>
    )

    if (notFound && !showForm) return (
        <MainLayout>
            <div className="max-w-2xl mx-auto text-center animate-fade-in">
                <p className="text-5xl mb-4">🏪</p>
                <p className="text-slate-600 font-semibold text-lg mb-2">Kamu belum punya toko</p>
                <p className="text-slate-400 text-sm mb-6">Buat toko dulu supaya bisa menjual produk.</p>
                <Button onClick={() => setShowForm(true)}>
                    Buat Toko
                </Button>
            </div>
        </MainLayout>
    )

    if (showForm) return (
        <MainLayout>
            <div className="max-w-2xl mx-auto animate-fade-in">
                <button
                    onClick={() => setShowForm(false)}
                    className="inline-flex items-center gap-1 text-ocean-600 hover:text-ocean-700 text-sm font-medium mb-6"
                >
                    ← Kembali
                </button>

                <div className="card-hover p-6">
                    <h2 className="text-lg font-bold text-slate-700 mb-5">
                        {store ? 'Edit Toko' : 'Buat Toko Baru'}
                    </h2>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-5">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <Input
                            label="Nama Toko *"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            placeholder="Nama toko harus unik"
                        />

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-slate-600">
                                Deskripsi Toko
                            </label>
                            <textarea
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                rows={3}
                                placeholder="Ceritakan tentang toko kamu..."
                                className="input-field resize-none"
                            />
                        </div>

                        <div className="flex gap-3">
                            <Button type="submit" disabled={submitting} fullWidth>
                                {submitting ? 'Menyimpan...' : store ? 'Simpan Perubahan' : 'Buat Toko'}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                Batal
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    )

    return (
        <MainLayout>
            <Link
                to="/dashboard/seller"
                className="inline-flex items-center gap-1 text-ocean-600 hover:text-ocean-700 text-sm font-medium mb-6"
            >
                ← Kembali ke Dashboard
            </Link>

            <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">

                {}
                <div className="card-hover p-6">
                    <div className="flex items-start gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-3xl flex-shrink-0">
                            🏪
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-800">{store.name}</h1>
                                    <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                                        {store.description || 'Belum ada deskripsi toko.'}
                                    </p>
                                    <div className="flex items-center gap-3 mt-3">
                                        <span className="badge-emerald">
                                            Toko Aktif
                                        </span>
                                        <span className="text-slate-300 text-xs">
                                            Seller: {decoded?.username}
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setForm({ name: store.name, description: store.description || '' })
                                        setShowForm(true)
                                    }}
                                >
                                    Edit
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {}
                <div className="card-hover p-6">
                    <h2 className="text-base font-bold text-slate-700 mb-4">Informasi Toko</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                            <span className="text-sm text-slate-400">Nama Toko</span>
                            <span className="text-sm font-semibold text-slate-700">{store.name}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                            <span className="text-sm text-slate-400">Penjual</span>
                            <span className="text-sm font-semibold text-slate-700">{decoded?.username}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-slate-400">Bergabung sejak</span>
                            <span className="text-sm font-semibold text-slate-700">
                                {store.createdAt
                                    ? new Date(store.createdAt).toLocaleDateString('id-ID', {
                                        day: 'numeric', month: 'long', year: 'numeric'
                                    })
                                    : '-'}
                            </span>
                        </div>
                    </div>
                </div>

                {}
                <div className="card-hover p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-slate-700">
                            Produk Toko
                            <span className="ml-2 text-xs font-normal text-slate-400">({products.length} produk)</span>
                        </h2>
                        <Button
                            size="sm"
                            onClick={() => navigate('/dashboard/seller/products/new')}
                        >
                            + Tambah Produk
                        </Button>
                    </div>
                    {products.length === 0 ? (
                        <div className="bg-emerald-50 rounded-xl p-6 text-center">
                            <p className="text-emerald-300 text-sm font-medium">Belum ada produk di toko ini</p>
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

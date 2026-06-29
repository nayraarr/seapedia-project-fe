import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import Button from '../../../components/ui/Button'
import ProductCard from '../../../components/ui/ProductCard'
import Input from '../../../components/ui/Input'
import { createStore, getMyStore, updateStore } from '../../../services/storeApi'
import { getMyProducts } from '../../../services/productApi'
import { useAuth } from '../../../contexts/useAuth'
import BackButton from '../../../components/ui/BackButton'
import { Store, Package } from 'lucide-react'

export default function StoreManagementPage() {
    const [store, setStore] = useState(null)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ name: '', description: '' })
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [fieldErrors, setFieldErrors] = useState({})
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

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (fieldErrors[field]) {
            setFieldErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const validate = () => {
        const errors = {}
        if (!form.name.trim()) errors.name = 'Nama toko tidak boleh kosong'
        return errors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setFieldErrors({})

        const clientErrors = validate()
        if (Object.keys(clientErrors).length > 0) {
            setFieldErrors(clientErrors)
            return
        }

        setSubmitting(true)
        try {
            const res = store
                ? await updateStore(form)
                : await createStore(form)
            setStore(res.data.data)
            setNotFound(false)
            setShowForm(false)
        } catch (err) {
            const data = err.response?.data
            if (data?.fieldErrors && Object.keys(data.fieldErrors).length > 0) {
                setFieldErrors(data.fieldErrors)
            } else {
                setError(data?.message || 'Gagal menyimpan toko.')
            }
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
            <BackButton className="mb-3" />
            <div className="card text-center py-20 animate-fade-in">
                <Store size={48} strokeWidth={1.5} className="mb-3 mx-auto text-slate-300" />
                <p className="font-semibold text-slate-700">Kamu belum punya toko</p>
                <p className="text-sm text-slate-400 mt-1">Buat toko dulu supaya bisa menjual produk.</p>
                <div className="mt-4">
                    <Button onClick={() => setShowForm(true)}>
                        Buat Toko
                    </Button>
                </div>
            </div>
        </MainLayout>
    )

    if (showForm) return (
        <MainLayout>
            <BackButton className="mb-3" />
            <div className="max-w-2xl mx-auto animate-fade-in">

                <div className="rounded-lg border border-slate-200 p-5">
                    <h2 className="text-base font-bold text-slate-700 mb-4">
                        {store ? 'Edit Toko' : 'Buat Toko Baru'}
                    </h2>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-3 py-2.5 text-sm mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <Input
                            label="Nama Toko *"
                            value={form.name}
                            onChange={e => handleChange('name', e.target.value)}
                            placeholder="Nama toko harus unik"
                            error={fieldErrors.name}
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
            <BackButton className="mb-4" />

            <div className="rounded-lg border border-slate-200 p-5">
                <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-lg bg-ocean-100 flex items-center justify-center flex-shrink-0">
                        <Store size={26} className="text-ocean-600" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">{store.name}</h1>
                                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                    {store.description || 'Belum ada deskripsi toko.'}
                                </p>
                                <div className="flex items-center gap-3 mt-3">
                                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">Toko Aktif</span>
                                    <span className="text-xs text-slate-400">Seller: {decoded?.username}</span>
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

            <div className="mt-4 rounded-lg border border-slate-200">
                <div className="flex border-b border-slate-200">
                    <div className="px-5 py-3 text-sm font-semibold text-ocean-600 border-b-2 border-ocean-600">
                        Informasi Toko
                    </div>
                </div>
                <div className="p-5 space-y-3">
                    <InfoRow label="Nama Toko" value={store.name} />
                    <InfoRow label="Penjual" value={decoded?.username} />
                    <InfoRow label="Bergabung sejak" value={store.createdAt
                        ? new Date(store.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                        : '-'
                    } />
                </div>
            </div>

            <div className="mt-4 rounded-lg border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Package size={16} strokeWidth={1.5} className="text-ocean-500" />
                        Produk Toko
                        <span className="ml-1 text-xs font-normal text-slate-400">({products.length} produk)</span>
                    </h2>
                    <Button size="sm" onClick={() => navigate('/dashboard/seller/products/new')}>
                        + Tambah Produk
                    </Button>
                </div>
                {products.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-lg">
                        <Package size={28} className="text-slate-300 mx-auto mb-2" strokeWidth={1.5} />
                        <p className="text-sm font-medium text-slate-500">Belum ada produk di toko ini</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    )
}

function InfoRow({ label, value }) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
            <span className="text-sm text-slate-500">{label}</span>
            <span className="text-sm font-semibold text-slate-700">{value}</span>
        </div>
    )
}

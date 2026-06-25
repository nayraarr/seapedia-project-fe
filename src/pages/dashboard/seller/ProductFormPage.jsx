import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import { createProduct, updateProduct, getMyProducts } from '../../../services/productApi'
import { getMyStore } from '../../../services/storeApi'

export default function ProductFormPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const isEdit = Boolean(id)
    const [form, setForm] = useState({ name: '', description: '', price: '', stock: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [checkingStore, setCheckingStore] = useState(true)

    useEffect(() => {
        getMyStore()
            .then(() => setCheckingStore(false))
            .catch(() => {
                navigate('/dashboard/seller/store', { replace: true })
            })
    }, [navigate])

    useEffect(() => {
        if (!isEdit) return
        getMyProducts().then(res => {
            const found = res.data.data.find(p => String(p.id) === id)
            if (found) setForm({
                name: found.name,
                description: found.description || '',
                price: found.price,
                stock: found.stock,
            })
        }).catch(() => {})
    }, [id, isEdit])

    if (checkingStore) return null

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const payload = { ...form, price: Number(form.price), stock: Number(form.stock) }
            if (isEdit) await updateProduct(id, payload)
            else await createProduct(payload)
            navigate('/dashboard/seller/products')
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal menyimpan produk.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <MainLayout>
            <div className="max-w-lg mx-auto">
                <div className="mb-8">
                    <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Seller</span>
                    <h1 className="text-3xl font-bold text-slate-800 mt-1">
                        {isEdit ? 'Edit Produk' : 'Tambah Produk'}
                    </h1>
                </div>

                <div className="bg-white border border-blue-100 rounded-2xl p-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-5">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <Input
                            label="Nama Produk *"
                            value={form.name}
                            onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Nama produk"
                        />
                        <Input
                            label="Harga (Rp) *"
                            type="number"
                            value={form.price}
                            onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))}
                            placeholder="Contoh: 50000"
                        />
                        <Input
                            label="Stok *"
                            type="number"
                            value={form.stock}
                            onChange={e => setForm(prev => ({ ...prev, stock: e.target.value }))}
                            placeholder="Jumlah stok tersedia"
                        />

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-slate-600">Deskripsi</label>
                            <textarea
                                value={form.description}
                                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                                rows={4}
                                placeholder="Deskripsi produk..."
                                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition resize-none"
                            />
                        </div>

                        <div className="flex gap-3 pt-1">
                            <Button type="submit" disabled={loading} fullWidth>
                                {loading ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Produk'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/dashboard/seller/products')}
                            >
                                Batal
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    )
}
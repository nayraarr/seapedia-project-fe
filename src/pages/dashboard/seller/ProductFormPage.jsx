import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import BackButton from '../../../components/ui/BackButton'
import { createProduct, updateProduct, getMyProducts } from '../../../services/productApi'
import { getMyStore } from '../../../services/storeApi'

export default function ProductFormPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const isEdit = Boolean(id)
    const [form, setForm] = useState({ name: '', description: '', price: '', stock: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [fieldErrors, setFieldErrors] = useState({})
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

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (fieldErrors[field]) {
            setFieldErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const validate = () => {
        const errors = {}
        if (!form.name.trim()) errors.name = 'Nama produk tidak boleh kosong'
        if (!form.price || Number(form.price) < 1) errors.price = 'Harga harus lebih dari 0'
        if (!form.stock || Number(form.stock) < 0) errors.stock = 'Stok tidak boleh negatif'
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

        setLoading(true)
        try {
            const payload = { ...form, price: Number(form.price), stock: Number(form.stock) }
            if (isEdit) await updateProduct(id, payload)
            else await createProduct(payload)
            navigate('/dashboard/seller/products')
        } catch (err) {
            const data = err.response?.data
            if (data?.fieldErrors && Object.keys(data.fieldErrors).length > 0) {
                setFieldErrors(data.fieldErrors)
            } else {
                setError(data?.message || 'Gagal menyimpan produk.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <MainLayout>
            <BackButton className="mb-3" />
            <div className="max-w-lg mx-auto animate-fade-in">
                <div className="mb-8">
                    <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Seller</span>
                    <h1 className="text-3xl font-bold text-slate-800 mt-1">
                        {isEdit ? 'Edit Produk' : 'Tambah Produk'}
                    </h1>
                </div>

                <div className="card-hover p-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-5">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <Input
                            label="Nama Produk *"
                            value={form.name}
                            onChange={e => handleChange('name', e.target.value)}
                            placeholder="Nama produk"
                            error={fieldErrors.name}
                        />
                        <Input
                            label="Harga (Rp) *"
                            type="number"
                            value={form.price}
                            onChange={e => handleChange('price', e.target.value)}
                            placeholder="Contoh: 50000"
                            error={fieldErrors.price}
                        />
                        <Input
                            label="Stok *"
                            type="number"
                            value={form.stock}
                            onChange={e => handleChange('stock', e.target.value)}
                            placeholder="Jumlah stok tersedia"
                            error={fieldErrors.stock}
                        />

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-slate-600">Deskripsi</label>
                            <textarea
                                value={form.description}
                                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                                rows={4}
                                placeholder="Deskripsi produk..."
                                className="input-field resize-none"
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

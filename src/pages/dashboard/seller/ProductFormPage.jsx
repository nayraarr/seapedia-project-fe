import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import BackButton from '../../../components/ui/BackButton'
import { createProduct, updateProduct, getMyProducts } from '../../../services/productApi'
import { getMyStore } from '../../../services/storeApi'
import { uploadToCloudinary } from '../../../utils/cloudinary'

export default function ProductFormPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const isEdit = Boolean(id)

    const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', imageUrl: '', category: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [fieldErrors, setFieldErrors] = useState({})
    const [checkingStore, setCheckingStore] = useState(true)

    const [imagePreview, setImagePreview] = useState('')
    const [imageLoading, setImageLoading] = useState(false)
    const [imageError, setImageError] = useState('')

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
            if (found) {
                setForm({
                    name: found.name,
                    description: found.description || '',
                    price: found.price,
                    stock: found.stock,
                    imageUrl: found.imageUrl || '',
                    category: found.category || '',
                })
                if (found.imageUrl) setImagePreview(found.imageUrl)
            }
        }).catch(() => {})
    }, [id, isEdit])

    if (checkingStore) return null

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (fieldErrors[field]) {
            setFieldErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handleImageChange = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 5 * 1024 * 1024) {
            setImageError('Ukuran gambar maksimal 5MB.')
            return
        }

        setImageError('')
        const localUrl = URL.createObjectURL(file)
        setImagePreview(localUrl)
        setImageLoading(true)

        try {
            const url = await uploadToCloudinary(file)
            setForm(prev => ({ ...prev, imageUrl: url }))
        } catch (err) {
            setImageError(err.message || 'Gagal upload gambar. Coba lagi.')
            setImagePreview('')
            setForm(prev => ({ ...prev, imageUrl: '' }))
        } finally {
            setImageLoading(false)
        }
    }

    const handleRemoveImage = () => {
        setImagePreview('')
        setImageError('')
        setForm(prev => ({ ...prev, imageUrl: '' }))
    }

    const validate = () => {
        const errors = {}
        if (!form.name.trim()) errors.name = 'Nama produk tidak boleh kosong'
        if (!form.price || Number(form.price) < 1) errors.price = 'Harga harus lebih dari 0'
        if (form.stock === '' || Number(form.stock) < 0) errors.stock = 'Stok tidak boleh negatif'
        if (!form.category) errors.category = 'Kategori harus dipilih'
        return errors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setFieldErrors({})

        if (imageLoading) {
            setError('Tunggu gambar selesai diupload terlebih dahulu.')
            return
        }

        const clientErrors = validate()
        if (Object.keys(clientErrors).length > 0) {
            setFieldErrors(clientErrors)
            return
        }

        setLoading(true)
        try {
            const payload = {
                name: form.name,
                description: form.description,
                price: Number(form.price),
                stock: Number(form.stock),
                imageUrl: form.imageUrl || null,
                category: form.category,
            }
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
            <div className="max-w-lg mx-auto">
                <div className="mb-8">
                    <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Seller</span>
                    <h1 className="text-3xl font-bold text-slate-800 mt-1">
                        {isEdit ? 'Edit Produk' : 'Tambah Produk'}
                    </h1>
                </div>

                <div className="card-hover p-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-3 py-2.5 text-sm mb-4 flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86l-8.2 14A2 2 0 003.82 21h16.36a2 2 0 001.73-3.14l-8.2-14a2 2 0 00-3.42 0z"/>
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                        {}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-slate-600">
                                Foto Produk
                                <span className="text-slate-400 font-normal ml-1">(opsional)</span>
                            </label>

                            <label className="relative cursor-pointer block">
                                <div className={`border-2 border-dashed rounded-lg transition-all overflow-hidden ${
                                    imageError
                                        ? 'border-red-300 bg-red-50'
                                        : imagePreview
                                            ? 'border-emerald-300 bg-white'
                                            : 'border-slate-200 hover:border-emerald-400 bg-slate-50 hover:bg-emerald-50/30'
                                }`}>
                                    {imagePreview ? (
                                        <div className="relative">
                                            <img
                                                src={imagePreview}
                                                alt="Preview produk"
                                                className="w-full h-52 object-cover"
                                            />
                                            {imageLoading && (
                                                <div className="absolute inset-0 bg-white/75 flex flex-col items-center justify-center gap-2">
                                                    <svg className="w-8 h-8 animate-spin text-emerald-500" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                                    </svg>
                                                    <p className="text-sm font-semibold text-emerald-600">Mengupload ke Cloudinary...</p>
                                                </div>
                                            )}
                                            {!imageLoading && (
                                                <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                                                    <span className="bg-white text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg shadow">
                                                        Klik untuk ganti foto
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="h-44 flex flex-col items-center justify-center gap-3 text-slate-400 px-4">
                                            <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center">
                                                <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                </svg>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-semibold text-slate-500">Klik untuk upload foto produk</p>
                                                <p className="text-xs text-slate-400 mt-0.5">PNG, JPG, WebP · Maks 5MB</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp,image/gif"
                                    onChange={handleImageChange}
                                    disabled={imageLoading}
                                    className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                />
                            </label>

                            {imageError && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86l-8.2 14A2 2 0 003.82 21h16.36a2 2 0 001.73-3.14l-8.2-14a2 2 0 00-3.42 0z"/>
                                    </svg>
                                    {imageError}
                                </p>
                            )}
                            {form.imageUrl && !imageLoading && !imageError && (
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                                        </svg>
                                        Gambar berhasil diupload ke Cloudinary
                                    </p>
                                    <button type="button" onClick={handleRemoveImage}
                                            className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors">
                                        Hapus foto
                                    </button>
                                </div>
                            )}
                        </div>

                        <Input
                            label="Nama Produk *"
                            value={form.name}
                            onChange={e => handleChange('name', e.target.value)}
                            placeholder="Nama produk"
                            error={fieldErrors.name}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="Harga (Rp) *"
                                type="number"
                                value={form.price}
                                onChange={e => handleChange('price', e.target.value)}
                                placeholder="50000"
                                error={fieldErrors.price}
                            />
                            <Input
                                label="Stok *"
                                type="number"
                                value={form.stock}
                                onChange={e => handleChange('stock', e.target.value)}
                                placeholder="100"
                                error={fieldErrors.stock}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-slate-600">Kategori *</label>
                            <select
                                value={form.category}
                                onChange={e => handleChange('category', e.target.value)}
                                className={`border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition ${
                                    fieldErrors.category ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300'
                                }`}
                            >
                                <option value="">Pilih kategori</option>
                                <option value="FASHION">Fashion</option>
                                <option value="ELEKTRONIK">Elektronik</option>
                                <option value="RUMAH_TANGGA">Rumah Tangga</option>
                                <option value="BUKU">Buku</option>
                                <option value="GAME">Game</option>
                                <option value="MAKANAN">Makanan</option>
                                <option value="HADIAH">Hadiah</option>
                                <option value="LAINNYA">Lainnya</option>
                            </select>
                            {fieldErrors.category && (
                                <p className="text-xs text-red-500">{fieldErrors.category}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-slate-600">Deskripsi</label>
                            <textarea
                                value={form.description}
                                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                                rows={4}
                                placeholder="Deskripsi produk..."
                                className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 transition resize-none hover:border-slate-300"
                            />
                        </div>

                        <div className="flex gap-3 pt-1">
                            <Button
                                type="submit"
                                variant="emerald"
                                loading={loading}
                                disabled={imageLoading}
                                fullWidth
                            >
                                {imageLoading ? 'Menunggu upload gambar...' : isEdit ? 'Simpan Perubahan' : 'Tambah Produk'}
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

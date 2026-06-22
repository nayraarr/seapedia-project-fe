import { useEffect, useState } from 'react'
import MainLayout from '../../../components/layout/MainLayout'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import { createStore, getMyStore, updateStore } from '../../../services/storeApi'

export default function StoreManagementPage() {
    const [store, setStore] = useState(null)
    const [form, setForm] = useState({ name: '', description: '' })
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        getMyStore()
            .then(res => {
                setStore(res.data.data)
                setForm({
                    name: res.data.data.name,
                    description: res.data.data.description || ''
                })
            })
            .catch(() => setStore(null))
            .finally(() => setLoading(false))
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setSubmitting(true)
        try {
            const res = store
                ? await updateStore(form)
                : await createStore(form)
            setStore(res.data.data)
            setSuccess(store ? 'Toko berhasil diperbarui!' : 'Toko berhasil dibuat!')
            setIsEditing(false)
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal menyimpan toko.')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return (
        <MainLayout>
            <div className="max-w-2xl mx-auto space-y-4">
                <div className="bg-white animate-pulse rounded-2xl h-32 border border-blue-50" />
            </div>
        </MainLayout>
    )

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto space-y-5">

                <div className="mb-2">
                    <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Seller</span>
                    <h1 className="text-3xl font-bold text-slate-800 mt-1">Toko Saya</h1>
                </div>

                {/* Store Info */}
                {store && !isEditing && (
                    <div className="bg-white border border-blue-100 rounded-2xl p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl flex-shrink-0">
                                    🏪
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">{store.name}</h2>
                                    <p className="text-slate-400 text-sm mt-1">
                                        {store.description || 'Belum ada deskripsi toko.'}
                                    </p>
                                    <p className="text-slate-300 text-xs mt-2">
                                        Dibuat: {new Date(store.createdAt).toLocaleDateString('id-ID', {
                                        day: 'numeric', month: 'long', year: 'numeric'
                                    })}
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit
                            </Button>
                        </div>
                    </div>
                )}

                {/* Success banner setelah simpan */}
                {success && !isEditing && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl px-4 py-3 text-sm">
                        {success}
                    </div>
                )}

                {/* Form create / edit */}
                {(!store || isEditing) && (
                    <div className="bg-white border border-blue-100 rounded-2xl p-6">
                        <h2 className="text-lg font-bold text-slate-700 mb-5">
                            {store ? 'Edit Toko' : 'Buat Toko Baru'}
                        </h2>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-5">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl px-4 py-3 text-sm mb-5">
                                {success}
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
                                    className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition resize-none"
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    fullWidth
                                >
                                    {submitting ? 'Menyimpan...' : store ? 'Simpan Perubahan' : 'Buat Toko'}
                                </Button>
                                {isEditing && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditing(false)
                                            setError('')
                                            setSuccess('')
                                        }}
                                    >
                                        Batal
                                    </Button>
                                )}
                            </div>
                        </form>
                    </div>
                )}

            </div>
        </MainLayout>
    )
}
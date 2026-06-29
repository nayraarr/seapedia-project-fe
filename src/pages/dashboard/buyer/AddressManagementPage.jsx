import { useState, useEffect } from 'react'
import MainLayout from '../../../components/layout/MainLayout'
import BackButton from '../../../components/ui/BackButton'
import Button from '../../../components/ui/Button'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import {
    getAddresses, createAddress, updateAddress,
    deleteAddress, setDefaultAddress
} from '../../../services/addressApi'
import { MapPin } from 'lucide-react'

const EMPTY_FORM = {
    label: '', recipientName: '', phone: '',
    fullAddress: '', city: '', postalCode: '', isDefault: false
}

export default function AddressManagementPage() {
    const [addresses, setAddresses] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editTarget, setEditTarget] = useState(null)
    const [form, setForm] = useState(EMPTY_FORM)
    const [formLoading, setFormLoading] = useState(false)
    const [error, setError] = useState('')
    const [fieldErrors, setFieldErrors] = useState({})
    const [success, setSuccess] = useState('')
    const [refresh, setRefresh] = useState(0)
    const [deleteTarget, setDeleteTarget] = useState(null)

    useEffect(() => {
        getAddresses()
            .then(res => setAddresses(res.data.data))
            .catch(() => setError('Gagal memuat alamat.'))
            .finally(() => setLoading(false))
    }, [refresh])

    const openCreate = () => {
        setEditTarget(null)
        setForm(EMPTY_FORM)
        setError('')
        setFieldErrors({})
        setSuccess('')
        setShowForm(true)
    }

    const openEdit = (addr) => {
        setEditTarget(addr)
        setForm({
            label: addr.label,
            recipientName: addr.recipientName,
            phone: addr.phone,
            fullAddress: addr.fullAddress,
            city: addr.city,
            postalCode: addr.postalCode,
            isDefault: addr.isDefault,
        })
        setError('')
        setFieldErrors({})
        setSuccess('')
        setShowForm(true)
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validate = () => {
        const errors = {}
        if (!form.label.trim()) errors.label = 'Label tidak boleh kosong'
        if (!form.recipientName.trim()) errors.recipientName = 'Nama penerima tidak boleh kosong'
        if (!form.phone.trim()) errors.phone = 'No. telepon tidak boleh kosong'
        if (!form.fullAddress.trim()) errors.fullAddress = 'Alamat lengkap tidak boleh kosong'
        if (!form.city.trim()) errors.city = 'Kota tidak boleh kosong'
        if (!form.postalCode.trim()) errors.postalCode = 'Kode pos tidak boleh kosong'
        return errors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setFieldErrors({})
        setSuccess('')

        const clientErrors = validate()
        if (Object.keys(clientErrors).length > 0) {
            setFieldErrors(clientErrors)
            return
        }

        setFormLoading(true)
        try {
            if (editTarget) {
                await updateAddress(editTarget.id, form)
                setSuccess('Alamat berhasil diperbarui.')
            } else {
                await createAddress(form)
                setSuccess('Alamat berhasil ditambahkan.')
            }
            setRefresh(prev => prev + 1)
            setShowForm(false)
        } catch (err) {
            const data = err.response?.data
            if (data?.fieldErrors && Object.keys(data.fieldErrors).length > 0) {
                setFieldErrors(data.fieldErrors)
            } else {
                setError(data?.message || 'Gagal menyimpan alamat.')
            }
        } finally {
            setFormLoading(false)
        }
    }

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return
        try {
            await deleteAddress(deleteTarget.id)
            setSuccess('Alamat dihapus.')
            setRefresh(prev => prev + 1)
        } catch {
            setError('Gagal menghapus alamat.')
        } finally {
            setDeleteTarget(null)
        }
    }

    const handleSetDefault = async (id) => {
        try {
            await setDefaultAddress(id)
            setRefresh(prev => prev + 1)
        } catch {
            setError('Gagal mengatur alamat default.')
        }
    }

    return (
        <MainLayout>
            <BackButton className="mb-3" />
            <div className="mb-8 flex items-start justify-between animate-fade-in">
                <div>
                    <span className="text-xs font-bold text-ocean-500 uppercase tracking-widest">Buyer</span>
                    <h1 className="text-3xl font-bold text-slate-800 mt-1">Alamat Pengiriman <MapPin size={28} strokeWidth={1.5} className="inline-block align-middle" /></h1>
                    <p className="text-slate-400 mt-1">Kelola alamat pengiriman kamu</p>
                </div>
                <Button onClick={openCreate}>+ Tambah Alamat</Button>
            </div>

            {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2.5">
                    {success}
                </div>
            )}

            {showForm && (
                <div className="rounded-lg border border-slate-200 p-5 mb-6 animate-slide-up">
                    <h2 className="font-bold text-slate-700 mb-4 text-sm">
                        {editTarget ? 'Edit Alamat' : 'Tambah Alamat Baru'}
                    </h2>
                    <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
                        {[
                            { name: 'label', label: 'Label (mis. Rumah, Kantor)', placeholder: 'Rumah' },
                            { name: 'recipientName', label: 'Nama Penerima', placeholder: 'John Doe' },
                            { name: 'phone', label: 'No. Telepon', placeholder: '08xxx' },
                            { name: 'city', label: 'Kota', placeholder: 'Jakarta' },
                            { name: 'postalCode', label: 'Kode Pos', placeholder: '12345' },
                        ].map(field => (
                            <div key={field.name}>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">
                                    {field.label}
                                </label>
                                <input
                                    name={field.name}
                                    value={form[field.name]}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    required
                                    className={`input-field ${fieldErrors[field.name] ? 'input-error' : ''}`}
                                />
                                {fieldErrors[field.name] && (
                                    <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-0.5">
                                        {fieldErrors[field.name]}
                                    </p>
                                )}
                            </div>
                        ))}

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 mb-1">
                                Alamat Lengkap
                            </label>
                            <textarea
                                name="fullAddress"
                                value={form.fullAddress}
                                onChange={handleChange}
                                placeholder="Jl. Contoh No. 1, RT/RW ..."
                                required
                                rows={3}
                                className={`input-field resize-none ${fieldErrors.fullAddress ? 'input-error' : ''}`}
                            />
                            {fieldErrors.fullAddress && (
                                <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-0.5">
                                    {fieldErrors.fullAddress}
                                </p>
                            )}
                        </div>

                        <div className="sm:col-span-2 flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="isDefault"
                                id="isDefault"
                                checked={form.isDefault}
                                onChange={handleChange}
                                className="w-4 h-4 accent-ocean-500"
                            />
                            <label htmlFor="isDefault" className="text-sm text-slate-600">
                                Jadikan alamat default
                            </label>
                        </div>

                        <div className="sm:col-span-2 flex gap-3">
                            <Button type="submit" disabled={formLoading} fullWidth>
                                {formLoading ? 'Menyimpan...' : editTarget ? 'Simpan Perubahan' : 'Tambah Alamat'}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                Batal
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="grid sm:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="skeleton h-40" />
                    ))}
                </div>
            ) : addresses.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                    <div className="flex justify-center mb-3"><MapPin size={48} strokeWidth={1.5} /></div>
                    <p className="font-medium">Belum ada alamat tersimpan.</p>
                    <p className="text-sm mt-1">Klik tombol <strong>+ Tambah Alamat</strong> di atas untuk mulai.</p>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 gap-4 animate-slide-up">
                    {addresses.map(addr => (
                        <div
                            key={addr.id}
                            className={`rounded-lg border p-5 transition
                                ${addr.isDefault
                                ? 'border-ocean-400 ring-1 ring-ocean-200'
                                : 'border-slate-200'}`}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-700">{addr.label}</span>
                                    {addr.isDefault && (
                                        <span className="badge-blue">
                                            Default
                                        </span>
                                    )}
                                </div>
                            </div>
                            <p className="text-sm font-semibold text-slate-600">{addr.recipientName}</p>
                            <p className="text-sm text-slate-400">{addr.phone}</p>
                            <p className="text-sm text-slate-400 mt-1">{addr.fullAddress}</p>
                            <p className="text-sm text-slate-400">{addr.city}, {addr.postalCode}</p>

                            <div className="flex gap-2 mt-4 flex-wrap">
                                {!addr.isDefault && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleSetDefault(addr.id)}
                                    >
                                        Jadikan Default
                                    </Button>
                                )}
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => openEdit(addr)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => setDeleteTarget(addr)}
                                >
                                    Hapus
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmDialog
                isOpen={Boolean(deleteTarget)}
                title="Hapus Alamat"
                message={`Apakah kamu yakin ingin menghapus alamat "${deleteTarget?.label}"?`}
                confirmLabel="Ya, Hapus"
                cancelLabel="Batal"
                variant="danger"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteTarget(null)}
            />
        </MainLayout>
    )
}

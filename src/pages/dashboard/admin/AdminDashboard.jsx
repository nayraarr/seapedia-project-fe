import { useState, useEffect } from 'react'
import MainLayout from '../../../components/layout/MainLayout'
import Button from '../../../components/ui/Button'
import { useAuth } from '../../../contexts/useAuth'
import { generateVoucher, generatePromo, getVouchers, getPromos, getVoucherDetail, getPromoDetail } from '../../../services/discountApi'

function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount ?? 0)
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('id-ID', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
    })
}

const initialVoucherForm = {
    code: '', description: '', discountType: 'PERCENTAGE', discountValue: '',
    maxDiscountAmount: '', minPurchaseAmount: '0', usageLimit: '', expiryDate: '',
}

const initialPromoForm = {
    code: '', description: '', discountType: 'PERCENTAGE', discountValue: '',
    maxDiscountAmount: '', minPurchaseAmount: '0', expiryDate: '',
}

function DetailField({ label, value, mono }) {
    return (
        <div>
            <p className="text-xs font-semibold text-slate-400 uppercase mb-0.5">{label}</p>
            <p className={`text-slate-800 ${mono ? 'font-mono font-bold' : 'font-medium'}`}>{value ?? '-'}</p>
        </div>
    )
}

export default function AdminDashboard() {
    const { decoded } = useAuth()
    const [activeTab, setActiveTab] = useState('vouchers')
    const [voucherForm, setVoucherForm] = useState(initialVoucherForm)
    const [promoForm, setPromoForm] = useState(initialPromoForm)
    const [vouchers, setVouchers] = useState([])
    const [promos, setPromos] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [selectedItem, setSelectedItem] = useState(null)
    const [detailLoading, setDetailLoading] = useState(false)

    const fetchVouchers = () =>
        getVouchers().then(res => setVouchers(res.data.data || [])).catch(() => {})

    const fetchPromos = () =>
        getPromos().then(res => setPromos(res.data.data || [])).catch(() => {})

    useEffect(() => {
        setLoading(true)
        Promise.all([fetchVouchers(), fetchPromos()]).finally(() => setLoading(false))
    }, [])

    const handleVoucherChange = (e) => {
        const { name, value } = e.target
        setVoucherForm(prev => ({ ...prev, [name]: name === 'code' ? value.toUpperCase() : value }))
    }

    const handlePromoChange = (e) => {
        const { name, value } = e.target
        setPromoForm(prev => ({ ...prev, [name]: name === 'code' ? value.toUpperCase() : value }))
    }

    const handleCreateVoucher = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setMessage({ type: '', text: '' })
        try {
            const payload = {
                code: voucherForm.code,
                description: voucherForm.description || undefined,
                discountType: voucherForm.discountType,
                discountValue: Number(voucherForm.discountValue),
                maxDiscountAmount: voucherForm.maxDiscountAmount ? Number(voucherForm.maxDiscountAmount) : undefined,
                minPurchaseAmount: Number(voucherForm.minPurchaseAmount) || 0,
                usageLimit: Number(voucherForm.usageLimit),
                expiryDate: voucherForm.expiryDate + ':00',
            }
            await generateVoucher(payload)
            setMessage({ type: 'success', text: `Voucher "${voucherForm.code}" berhasil dibuat.` })
            setVoucherForm(initialVoucherForm)
            await fetchVouchers()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Gagal membuat voucher.' })
        } finally {
            setSubmitting(false)
        }
    }

    const handleCreatePromo = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setMessage({ type: '', text: '' })
        try {
            const payload = {
                code: promoForm.code,
                description: promoForm.description || undefined,
                discountType: promoForm.discountType,
                discountValue: Number(promoForm.discountValue),
                maxDiscountAmount: promoForm.maxDiscountAmount ? Number(promoForm.maxDiscountAmount) : undefined,
                minPurchaseAmount: Number(promoForm.minPurchaseAmount) || 0,
                expiryDate: promoForm.expiryDate + ':00',
            }
            await generatePromo(payload)
            setMessage({ type: 'success', text: `Promo "${promoForm.code}" berhasil dibuat.` })
            setPromoForm(initialPromoForm)
            await fetchPromos()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Gagal membuat promo.' })
        } finally {
            setSubmitting(false)
        }
    }

    const handleViewVoucherDetail = async (id) => {
        setDetailLoading(true)
        try {
            const res = await getVoucherDetail(id)
            setSelectedItem({ type: 'VOUCHER', data: res.data.data })
        } catch {
            setMessage({ type: 'error', text: 'Gagal memuat detail voucher.' })
        } finally {
            setDetailLoading(false)
        }
    }

    const handleViewPromoDetail = async (id) => {
        setDetailLoading(true)
        try {
            const res = await getPromoDetail(id)
            setSelectedItem({ type: 'PROMO', data: res.data.data })
        } catch {
            setMessage({ type: 'error', text: 'Gagal memuat detail promo.' })
        } finally {
            setDetailLoading(false)
        }
    }

    const inputClass = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
    const labelClass = "block text-xs font-semibold text-slate-500 mb-1"
    const now = new Date().toISOString().slice(0, 16)

    return (
        <MainLayout>
            <div className="mb-6">
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Dashboard</span>
                <h1 className="text-2xl font-bold text-slate-800 mt-1">Halo, {decoded?.username}! 👋</h1>
                <p className="text-slate-400 text-sm mt-1">Kelola voucher dan promo diskon</p>
            </div>

            {message.text && (
                <div className={`mb-4 text-sm rounded-xl px-4 py-3 border ${
                    message.type === 'success'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-red-50 border-red-200 text-red-600'
                }`}>
                    {message.text}
                </div>
            )}

            <div className="flex gap-1 mb-6 bg-red-50 rounded-xl p-1 w-fit">
                <button
                    onClick={() => setActiveTab('vouchers')}
                    className={`px-5 py-2 text-sm font-semibold rounded-lg transition ${
                        activeTab === 'vouchers' ? 'bg-white text-red-700 shadow-sm' : 'text-red-500 hover:text-red-700'
                    }`}
                >
                    🎟️ Voucher
                </button>
                <button
                    onClick={() => setActiveTab('promos')}
                    className={`px-5 py-2 text-sm font-semibold rounded-lg transition ${
                        activeTab === 'promos' ? 'bg-white text-red-700 shadow-sm' : 'text-red-500 hover:text-red-700'
                    }`}
                >
                    🏷️ Promo
                </button>
            </div>

            {loading ? (
                <div className="text-center py-16 text-slate-400">Memuat data...</div>
            ) : activeTab === 'vouchers' ? (
                <div className="space-y-6">
                    <div className="bg-white border border-red-100 rounded-2xl p-6">
                        <h2 className="font-bold text-slate-700 text-lg mb-4">Buat Voucher Baru</h2>
                        <form onSubmit={handleCreateVoucher} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className={labelClass}>Kode Voucher *</label>
                                <input name="code" value={voucherForm.code} onChange={handleVoucherChange} required
                                    className={inputClass} placeholder="contoh: DISKON50" />
                            </div>
                            <div>
                                <label className={labelClass}>Tipe Diskon *</label>
                                <select name="discountType" value={voucherForm.discountType} onChange={handleVoucherChange} required
                                    className={inputClass}>
                                    <option value="PERCENTAGE">Persen (%)</option>
                                    <option value="FIXED">Nominal (Rp)</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>
                                    Nilai Diskon * {voucherForm.discountType === 'PERCENTAGE' ? '(%)' : '(Rp)'}
                                </label>
                                <input name="discountValue" type="number" min="1" value={voucherForm.discountValue}
                                    onChange={handleVoucherChange} required className={inputClass}
                                    placeholder={voucherForm.discountType === 'PERCENTAGE' ? 'contoh: 10' : 'contoh: 5000'} />
                            </div>
                            <div>
                                <label className={labelClass}>Maks. Diskon (Rp, opsional)</label>
                                <input name="maxDiscountAmount" type="number" min="0" value={voucherForm.maxDiscountAmount}
                                    onChange={handleVoucherChange} className={inputClass} placeholder="contoh: 20000" />
                            </div>
                            <div>
                                <label className={labelClass}>Min. Belanja (Rp)</label>
                                <input name="minPurchaseAmount" type="number" min="0" value={voucherForm.minPurchaseAmount}
                                    onChange={handleVoucherChange} className={inputClass} placeholder="0" />
                            </div>
                            <div>
                                <label className={labelClass}>Batas Pemakaian *</label>
                                <input name="usageLimit" type="number" min="1" value={voucherForm.usageLimit}
                                    onChange={handleVoucherChange} required className={inputClass}
                                    placeholder="contoh: 100" />
                            </div>
                            <div>
                                <label className={labelClass}>Kadaluarsa *</label>
                                <input name="expiryDate" type="datetime-local" value={voucherForm.expiryDate}
                                    onChange={handleVoucherChange} required min={now} className={inputClass} />
                            </div>
                            <div className="md:col-span-2 lg:col-span-3">
                                <label className={labelClass}>Deskripsi (opsional)</label>
                                <textarea name="description" value={voucherForm.description}
                                    onChange={handleVoucherChange} rows={2}
                                    className={inputClass} placeholder="Deskripsi voucher..." />
                            </div>
                            <div className="md:col-span-2 lg:col-span-3">
                                <Button variant="primary" type="submit" disabled={submitting}>
                                    {submitting ? 'Menyimpan...' : 'Buat Voucher'}
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div className="bg-white border border-red-100 rounded-2xl p-6">
                        <h2 className="font-bold text-slate-700 text-lg mb-4">Daftar Voucher</h2>
                        {vouchers.length === 0 ? (
                            <p className="text-slate-400 text-sm">Belum ada voucher.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-xs text-slate-500 uppercase border-b border-slate-100">
                                            <th className="pb-2 pr-3">Kode</th>
                                            <th className="pb-2 pr-3">Tipe</th>
                                            <th className="pb-2 pr-3">Nilai</th>
                                            <th className="pb-2 pr-3">Min. Belanja</th>
                                            <th className="pb-2 pr-3">Pemakaian</th>
                                            <th className="pb-2 pr-3">Kadaluarsa</th>
                                            <th className="pb-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vouchers.map(v => (
                                            <tr key={v.id} onClick={() => handleViewVoucherDetail(v.id)}
                                                className="border-b border-slate-50 text-slate-600 cursor-pointer hover:bg-red-50/50 transition">
                                                <td className="py-2.5 pr-3 font-mono font-bold text-slate-800">{v.code}</td>
                                                <td className="py-2.5 pr-3">{v.discountType === 'PERCENTAGE' ? 'Persen' : 'Nominal'}</td>
                                                <td className="py-2.5 pr-3">
                                                    {v.discountType === 'PERCENTAGE' ? `${v.discountValue}%` : formatRupiah(v.discountValue)}
                                                    {v.maxDiscountAmount ? ` (max ${formatRupiah(v.maxDiscountAmount)})` : ''}
                                                </td>
                                                <td className="py-2.5 pr-3">{v.minPurchaseAmount > 0 ? formatRupiah(v.minPurchaseAmount) : '-'}</td>
                                                <td className="py-2.5 pr-3">{v.usedCount}/{v.usageLimit}</td>
                                                <td className="py-2.5 pr-3">{formatDate(v.expiryDate)}</td>
                                                <td className="py-2.5">
                                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                                        v.expired ? 'bg-red-50 text-red-600' :
                                                        v.remainingUsage <= 0 ? 'bg-yellow-50 text-yellow-700' :
                                                        v.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                        {v.expired ? 'Expired' : v.remainingUsage <= 0 ? 'Habis' : v.active ? 'Aktif' : 'Nonaktif'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="bg-white border border-red-100 rounded-2xl p-6">
                        <h2 className="font-bold text-slate-700 text-lg mb-4">Buat Promo Baru</h2>
                        <form onSubmit={handleCreatePromo} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className={labelClass}>Kode Promo *</label>
                                <input name="code" value={promoForm.code} onChange={handlePromoChange} required
                                    className={inputClass} placeholder="contoh: PROMO10K" />
                            </div>
                            <div>
                                <label className={labelClass}>Tipe Diskon *</label>
                                <select name="discountType" value={promoForm.discountType} onChange={handlePromoChange} required
                                    className={inputClass}>
                                    <option value="PERCENTAGE">Persen (%)</option>
                                    <option value="FIXED">Nominal (Rp)</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>
                                    Nilai Diskon * {promoForm.discountType === 'PERCENTAGE' ? '(%)' : '(Rp)'}
                                </label>
                                <input name="discountValue" type="number" min="1" value={promoForm.discountValue}
                                    onChange={handlePromoChange} required className={inputClass}
                                    placeholder={promoForm.discountType === 'PERCENTAGE' ? 'contoh: 15' : 'contoh: 10000'} />
                            </div>
                            <div>
                                <label className={labelClass}>Maks. Diskon (Rp, opsional)</label>
                                <input name="maxDiscountAmount" type="number" min="0" value={promoForm.maxDiscountAmount}
                                    onChange={handlePromoChange} className={inputClass} placeholder="contoh: 30000" />
                            </div>
                            <div>
                                <label className={labelClass}>Min. Belanja (Rp)</label>
                                <input name="minPurchaseAmount" type="number" min="0" value={promoForm.minPurchaseAmount}
                                    onChange={handlePromoChange} className={inputClass} placeholder="0" />
                            </div>
                            <div>
                                <label className={labelClass}>Kadaluarsa *</label>
                                <input name="expiryDate" type="datetime-local" value={promoForm.expiryDate}
                                    onChange={handlePromoChange} required min={now} className={inputClass} />
                            </div>
                            <div className="md:col-span-2 lg:col-span-3">
                                <label className={labelClass}>Deskripsi (opsional)</label>
                                <textarea name="description" value={promoForm.description}
                                    onChange={handlePromoChange} rows={2}
                                    className={inputClass} placeholder="Deskripsi promo..." />
                            </div>
                            <div className="md:col-span-2 lg:col-span-3">
                                <Button variant="primary" type="submit" disabled={submitting}>
                                    {submitting ? 'Menyimpan...' : 'Buat Promo'}
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div className="bg-white border border-red-100 rounded-2xl p-6">
                        <h2 className="font-bold text-slate-700 text-lg mb-4">Daftar Promo</h2>
                        {promos.length === 0 ? (
                            <p className="text-slate-400 text-sm">Belum ada promo.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-xs text-slate-500 uppercase border-b border-slate-100">
                                            <th className="pb-2 pr-3">Kode</th>
                                            <th className="pb-2 pr-3">Tipe</th>
                                            <th className="pb-2 pr-3">Nilai</th>
                                            <th className="pb-2 pr-3">Min. Belanja</th>
                                            <th className="pb-2 pr-3">Kadaluarsa</th>
                                            <th className="pb-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {promos.map(p => (
                                            <tr key={p.id} onClick={() => handleViewPromoDetail(p.id)}
                                                className="border-b border-slate-50 text-slate-600 cursor-pointer hover:bg-red-50/50 transition">
                                                <td className="py-2.5 pr-3 font-mono font-bold text-slate-800">{p.code}</td>
                                                <td className="py-2.5 pr-3">{p.discountType === 'PERCENTAGE' ? 'Persen' : 'Nominal'}</td>
                                                <td className="py-2.5 pr-3">
                                                    {p.discountType === 'PERCENTAGE' ? `${p.discountValue}%` : formatRupiah(p.discountValue)}
                                                    {p.maxDiscountAmount ? ` (max ${formatRupiah(p.maxDiscountAmount)})` : ''}
                                                </td>
                                                <td className="py-2.5 pr-3">{p.minPurchaseAmount > 0 ? formatRupiah(p.minPurchaseAmount) : '-'}</td>
                                                <td className="py-2.5 pr-3">{formatDate(p.expiryDate)}</td>
                                                <td className="py-2.5">
                                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                                        p.expired ? 'bg-red-50 text-red-600' :
                                                        p.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                        {p.expired ? 'Expired' : p.active ? 'Aktif' : 'Nonaktif'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {selectedItem && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4" onClick={() => setSelectedItem(null)}>
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">
                                    {selectedItem.type === 'VOUCHER' ? '🎟️ Detail Voucher' : '🏷️ Detail Promo'}
                                </h3>
                                <p className="text-sm text-slate-500 mt-1">{selectedItem.data.code}</p>
                            </div>
                            <button className="text-slate-400 hover:text-slate-700 text-lg" onClick={() => setSelectedItem(null)}>✕</button>
                        </div>
                        {detailLoading ? (
                            <div className="p-6 text-center text-slate-400">Memuat detail...</div>
                        ) : (
                            <div className="p-6 space-y-4 text-sm">
                                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                                    <DetailField label="Kode" value={selectedItem.data.code} mono />
                                    <DetailField label="Tipe Diskon" value={selectedItem.data.discountType === 'PERCENTAGE' ? 'Persen (%)' : 'Nominal (Rp)'} />
                                    <DetailField label="Nilai Diskon"
                                        value={selectedItem.data.discountType === 'PERCENTAGE' ? `${selectedItem.data.discountValue}%` : formatRupiah(selectedItem.data.discountValue)} />
                                    {selectedItem.data.maxDiscountAmount != null && (
                                        <DetailField label="Maks. Diskon" value={formatRupiah(selectedItem.data.maxDiscountAmount)} />
                                    )}
                                    <DetailField label="Min. Belanja"
                                        value={selectedItem.data.minPurchaseAmount > 0 ? formatRupiah(selectedItem.data.minPurchaseAmount) : 'Tidak ada'} />
                                    {selectedItem.type === 'VOUCHER' && (
                                        <>
                                            <DetailField label="Batas Pemakaian" value={String(selectedItem.data.usageLimit)} />
                                            <DetailField label="Terpakai" value={String(selectedItem.data.usedCount)} />
                                            <DetailField label="Sisa Pemakaian" value={String(selectedItem.data.remainingUsage)} />
                                        </>
                                    )}
                                    <DetailField label="Kadaluarsa" value={formatDate(selectedItem.data.expiryDate)} />
                                    <DetailField label="Dibuat" value={formatDate(selectedItem.data.createdAt)} />
                                    <DetailField label="Status" value={
                                        selectedItem.data.expired ? 'Expired' :
                                        selectedItem.type === 'VOUCHER' && selectedItem.data.remainingUsage <= 0 ? 'Habis' :
                                        selectedItem.data.active ? 'Aktif' : 'Nonaktif'
                                    } />
                                </div>
                                {selectedItem.data.description && (
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Deskripsi</p>
                                        <p className="text-slate-600 bg-slate-50 rounded-xl px-4 py-3">{selectedItem.data.description}</p>
                                    </div>
                                )}
                                <div className="pt-2">
                                    <Button variant="outline" fullWidth onClick={() => setSelectedItem(null)}>Tutup</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </MainLayout>
    )
}

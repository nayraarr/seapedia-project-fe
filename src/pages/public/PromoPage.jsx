import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import { getVouchers, getPromos } from '../../services/discountApi'
import { Ticket, Tag, Clock, ShoppingCart } from 'lucide-react'

function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(amount ?? 0)
}

function formatDate(iso) {
    if (!iso) return '-'
    return new Date(iso).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    })
}

function DiscountBadge({ type, value }) {
    const isPercent = type === 'PERCENTAGE'
    return (
        <span className={`inline-flex items-center gap-1 text-sm font-extrabold ${isPercent ? 'text-orange-600' : 'text-ocean-600'}`}>
            {isPercent ? `${value}%` : formatRupiah(value)}
        </span>
    )
}

function DiscountCard({ item, type }) {
    const isVoucher = type === 'Voucher'
    const expired = item.expired
    const isActive = item.active && !expired
    const discountLabel = item.discountType === 'PERCENTAGE'
        ? `${item.discountValue}%`
        : formatRupiah(item.discountValue)

    return (
        <div className={`card p-5 ${isActive ? '' : 'opacity-60'}`}>
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isVoucher ? 'bg-ocean-100 text-ocean-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                        {isVoucher ? <Ticket size={20} strokeWidth={1.5} /> : <Tag size={20} strokeWidth={1.5} />}
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{type}</p>
                        <p className="font-bold text-slate-800 font-mono text-base">{item.code}</p>
                    </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    expired ? 'bg-red-100 text-red-600' : isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}>
                    {expired ? 'Kadaluarsa' : isActive ? 'Aktif' : 'Tidak Aktif'}
                </span>
            </div>

            {item.description && (
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">{item.description}</p>
            )}

            <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Diskon</span>
                    <DiscountBadge type={item.discountType} value={item.discountValue} />
                </div>
                {item.discountType === 'PERCENTAGE' && item.maxDiscountAmount && (
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Maks. Potongan</span>
                        <span className="text-xs font-bold text-slate-700">{formatRupiah(item.maxDiscountAmount)}</span>
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Min. Belanja</span>
                    <span className="text-xs font-semibold text-slate-700">
                        {item.minPurchaseAmount > 0 ? formatRupiah(item.minPurchaseAmount) : 'Tidak Ada'}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Berlaku Sampai</span>
                    <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                        <Clock size={12} strokeWidth={1.5} />
                        {formatDate(item.expiryDate)}
                    </span>
                </div>
                {isVoucher && (
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Sisa Pemakaian</span>
                        <span className="text-xs font-semibold text-slate-700">
                            {item.remainingUsage > 0 ? `${item.remainingUsage} dari ${item.usageLimit}` : 'Habis'}
                        </span>
                    </div>
                )}
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
                <ShoppingCart size={12} strokeWidth={1.5} />
                <span>Gunakan saat checkout untuk mendapatkan potongan harga</span>
            </div>
        </div>
    )
}

export default function PromoPage() {
    const [vouchers, setVouchers] = useState([])
    const [promos, setPromos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        Promise.all([getVouchers(), getPromos()])
            .then(([vRes, pRes]) => {
                setVouchers(vRes.data.data || [])
                setPromos(pRes.data.data || [])
            })
            .catch(() => setError('Gagal memuat data promo.'))
            .finally(() => setLoading(false))
    }, [])

    const activeVouchers = vouchers.filter(v => v.active && !v.expired && v.remainingUsage > 0)
    const activePromos = promos.filter(p => p.active && !p.expired)
    const expiredVouchers = vouchers.filter(v => v.expired || !v.active || v.remainingUsage <= 0)
    const expiredPromos = promos.filter(p => p.expired || !p.active)

    return (
        <MainLayout>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Promo & Voucher</h1>
                </div>
            </div>
            <div className="border-b border-slate-200 mb-5" />

            {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 animate-fade-in">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="space-y-8 animate-fade-in">
                    <div>
                        <div className="skeleton h-6 w-32 mb-4" />
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3].map(i => <div key={i} className="skeleton h-64" />)}
                        </div>
                    </div>
                    <div>
                        <div className="skeleton h-6 w-32 mb-4" />
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3].map(i => <div key={i} className="skeleton h-56" />)}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-10 animate-slide-up">
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Ticket size={20} strokeWidth={1.5} className="text-ocean-600" />
                            <h2 className="text-lg font-bold text-slate-800">Voucher</h2>
                            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                                {activeVouchers.length} aktif
                            </span>
                        </div>
                        {activeVouchers.length === 0 && expiredVouchers.length === 0 ? (
                            <div className="card p-8 text-center">
                                <Ticket size={40} strokeWidth={1.5} className="mx-auto mb-3 text-slate-300" />
                                <p className="font-semibold text-slate-600">Belum ada voucher</p>
                                <p className="text-xs text-slate-400 mt-1">Voucher akan muncul di sini jika tersedia</p>
                            </div>
                        ) : (
                            <>
                                {activeVouchers.length > 0 ? (
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                        {activeVouchers.map(v => (
                                            <DiscountCard key={v.id} item={v} type="Voucher" />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="card p-6 text-center mb-6">
                                        <p className="font-semibold text-slate-600">Tidak ada voucher aktif saat ini</p>
                                        <p className="text-xs text-slate-400 mt-1">Cek kembali nanti untuk voucher terbaru</p>
                                    </div>
                                )}
                                {expiredVouchers.length > 0 && (
                                    <details className="group">
                                        <summary className="cursor-pointer text-sm font-semibold text-slate-400 hover:text-slate-600 transition">
                                            Voucher Tidak Aktif ({expiredVouchers.length})
                                        </summary>
                                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                            {expiredVouchers.map(v => (
                                                <DiscountCard key={v.id} item={v} type="Voucher" />
                                            ))}
                                        </div>
                                    </details>
                                )}
                            </>
                        )}
                    </section>

                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Tag size={20} strokeWidth={1.5} className="text-orange-500" />
                            <h2 className="text-lg font-bold text-slate-800">Promo</h2>
                            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                                {activePromos.length} aktif
                            </span>
                        </div>
                        {activePromos.length === 0 && expiredPromos.length === 0 ? (
                            <div className="card p-8 text-center">
                                <Tag size={40} strokeWidth={1.5} className="mx-auto mb-3 text-slate-300" />
                                <p className="font-semibold text-slate-600">Belum ada promo</p>
                                <p className="text-xs text-slate-400 mt-1">Promo akan muncul di sini jika tersedia</p>
                            </div>
                        ) : (
                            <>
                                {activePromos.length > 0 ? (
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                        {activePromos.map(p => (
                                            <DiscountCard key={p.id} item={p} type="Promo" />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="card p-6 text-center mb-6">
                                        <p className="font-semibold text-slate-600">Tidak ada promo aktif saat ini</p>
                                        <p className="text-xs text-slate-400 mt-1">Cek kembali nanti untuk promo terbaru</p>
                                    </div>
                                )}
                                {expiredPromos.length > 0 && (
                                    <details className="group">
                                        <summary className="cursor-pointer text-sm font-semibold text-slate-400 hover:text-slate-600 transition">
                                            Promo Tidak Aktif ({expiredPromos.length})
                                        </summary>
                                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                            {expiredPromos.map(p => (
                                                <DiscountCard key={p.id} item={p} type="Promo" />
                                            ))}
                                        </div>
                                    </details>
                                )}
                            </>
                        )}
                    </section>

                    <div className="card p-5 bg-gradient-to-br from-ocean-50 to-white border-ocean-200">
                        <div className="flex items-start gap-3">
                            <ShoppingCart size={24} strokeWidth={1.5} className="text-ocean-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm">Cara Menggunakan</h3>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    Masukkan kode promo/voucher pada halaman checkout saat berbelanja.
                                    Potongan harga akan otomatis dihitung jika memenuhi syarat minimum belanja.
                                </p>
                                <Link to="/products" className="inline-block mt-3 text-xs font-bold text-ocean-600 hover:text-ocean-700 hover:underline">
                                    Mulai Belanja →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    )
}
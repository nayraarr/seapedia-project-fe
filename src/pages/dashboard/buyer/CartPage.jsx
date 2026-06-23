import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import Button from '../../../components/ui/Button'
import { useCart } from '../../../contexts/useCart'
import { useAuth } from '../../../contexts/useAuth'
import { getAddresses } from '../../../services/addressApi'
import { getWallet } from '../../../services/walletApi'
import { createOrder, previewCheckout } from '../../../services/orderApi'
import { validateDiscountCode, getVouchers, getPromos } from '../../../services/discountApi'

const DELIVERY_OPTIONS = [
    { value: 'INSTANT', label: 'Instant', feeLabel: 'Rp25.000' },
    { value: 'NEXT_DAY', label: 'Next Day', feeLabel: 'Rp15.000' },
    { value: 'REGULAR', label: 'Regular', feeLabel: 'Rp10.000' },
]

function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount ?? 0)
}

function DeliveryMethodLabel({ value }) {
    const selected = DELIVERY_OPTIONS.find(item => item.value === value)
    return selected?.label || value
}

export default function CartPage() {
    const { cart, loading, fetchCart, update, remove, clear } = useCart()
    const { activeRole } = useAuth()
    const navigate = useNavigate()

    const [clearConfirm, setClearConfirm] = useState(false)
    const [busyItem, setBusyItem] = useState(null)
    const [addresses, setAddresses] = useState([])
    const [wallet, setWallet] = useState(null)
    const [checkoutLoading, setCheckoutLoading] = useState(false)
    const [previewLoading, setPreviewLoading] = useState(false)
    const [selectedAddressId, setSelectedAddressId] = useState('')
    const [deliveryMethod, setDeliveryMethod] = useState('REGULAR')
    const [discountCode, setDiscountCode] = useState('')
    const [discountCheck, setDiscountCheck] = useState(null) // hasil dari endpoint validate
    const [discountCheckLoading, setDiscountCheckLoading] = useState(false)
    const [previewData, setPreviewData] = useState(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [checkoutModalOpen, setCheckoutModalOpen] = useState(false)
    const [availableVouchers, setAvailableVouchers] = useState([])
    const [availablePromos, setAvailablePromos] = useState([])
    const [showAvailableDiscounts, setShowAvailableDiscounts] = useState(false)

    useEffect(() => {
        fetchCart()
        Promise.all([getAddresses(), getWallet(), getVouchers(), getPromos()])
            .then(([addrRes, walletRes, voucherRes, promoRes]) => {
                const addrList = addrRes.data.data || []
                setAddresses(addrList)
                setWallet(walletRes.data.data)
                setAvailableVouchers(voucherRes.data.data || [])
                setAvailablePromos(promoRes.data.data || [])
                const defaultAddress = addrList.find(addr => addr.isDefault) || addrList[0]
                if (defaultAddress) {
                    setSelectedAddressId(defaultAddress.id)
                }
            })
            .catch(() => {
                setAddresses([])
                setWallet(null)
                setAvailableVouchers([])
                setAvailablePromos([])
            })
    }, [fetchCart])

    const selectedAddress = useMemo(
        () => addresses.find(addr => addr.id === selectedAddressId) || null,
        [addresses, selectedAddressId]
    )

    const handleQtyChange = async (cartItemId, newQty) => {
        if (newQty < 1) return
        setBusyItem(cartItemId)
        await update(cartItemId, newQty)
        setBusyItem(null)
    }

    const handleRemove = async (cartItemId) => {
        setBusyItem(cartItemId)
        await remove(cartItemId)
        setBusyItem(null)
    }

    const handleClear = async () => {
        await clear()
        setClearConfirm(false)
    }

    const handleCheckDiscount = async () => {
        const code = discountCode.trim()
        if (!code) {
            setDiscountCheck(null)
            return
        }
        setDiscountCheckLoading(true)
        try {
            const res = await validateDiscountCode(code)
            setDiscountCheck(res.data.data)
        } catch (err) {
            setDiscountCheck({
                valid: false,
                source: 'NONE',
                message: err.response?.data?.message || 'Gagal memvalidasi kode diskon.',
            })
        } finally {
            setDiscountCheckLoading(false)
        }
    }

    const handlePreviewCheckout = async () => {
        setError('')
        setSuccess('')
        setPreviewLoading(true)
        try {
            const payload = {
                addressId: selectedAddressId || null,
                deliveryMethod,
                discountCode: discountCode.trim() || null,
            }
            const res = await previewCheckout(payload)
            setPreviewData(res.data.data)
            setCheckoutModalOpen(true)
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memuat ringkasan checkout.')
        } finally {
            setPreviewLoading(false)
        }
    }

    const handleConfirmCheckout = async () => {
        setError('')
        setSuccess('')
        setCheckoutLoading(true)
        try {
            const payload = {
                addressId: selectedAddressId || null,
                deliveryMethod,
                discountCode: discountCode.trim() || null,
            }
            const res = await createOrder(payload)
            setSuccess('Order berhasil dibuat.')
            setCheckoutModalOpen(false)
            setPreviewData(null)
            setDiscountCode('')
            setDiscountCheck(null)
            await fetchCart()
            await Promise.all([
                getWallet().then(result => setWallet(result.data.data)),
                getAddresses().then(result => setAddresses(result.data.data || [])),
            ])
            navigate(`/dashboard/buyer/orders/${res.data.data.orderId}`)
        } catch (err) {
            setError(err.response?.data?.message || 'Checkout gagal.')
        } finally {
            setCheckoutLoading(false)
        }
    }

    // Redirect jika bukan BUYER
    if (activeRole && activeRole !== 'BUYER') {
        return (
            <MainLayout>
                <div className="text-center py-24">
                    <p className="text-5xl mb-4">🚫</p>
                    <p className="text-slate-600 font-semibold">Halaman ini hanya untuk Pembeli.</p>
                </div>
            </MainLayout>
        )
    }

    const isEmpty = !cart || cart.items.length === 0
    const estimatedFee = DELIVERY_OPTIONS.find(item => item.value === deliveryMethod)?.feeLabel

    return (
        <MainLayout>
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Keranjang</span>
                    <h1 className="text-2xl font-bold text-slate-800 mt-1">Keranjang Belanja 🛒</h1>
                </div>
                {!isEmpty && (
                    <div className="flex items-center gap-2">
                        <Link to="/dashboard/buyer/orders">
                            <Button variant="outline" size="sm">Riwayat Pesanan</Button>
                        </Link>
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => setClearConfirm(true)}
                        >
                            Kosongkan
                        </Button>
                    </div>
                )}
            </div>

            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-3 text-sm text-blue-700">
                <span className="text-lg flex-shrink-0">ℹ️</span>
                <p>
                    Keranjang SEAPEDIA hanya dapat memuat produk dari <strong>satu toko</strong> sekaligus.
                    Checkout akan menampilkan subtotal, ongkir, PPN 12%, dan total akhir sebelum dikonfirmasi.
                </p>
            </div>

            {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                    {success}
                </div>
            )}

            {loading && (
                <div className="space-y-3 animate-pulse">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-2xl h-24 border border-blue-50" />
                    ))}
                </div>
            )}

            {!loading && isEmpty && (
                <div className="text-center py-24">
                    <p className="text-6xl mb-4">🛒</p>
                    <p className="text-slate-600 font-semibold text-lg mb-2">Keranjangmu masih kosong</p>
                    <p className="text-slate-400 text-sm mb-6">Yuk, temukan produk segar dari laut!</p>
                    <Link to="/products">
                        <Button variant="primary">Jelajahi Produk</Button>
                    </Link>
                </div>
            )}

            {!loading && !isEmpty && (
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-base">🏪</span>
                            <Link
                                to={`/stores/${cart.storeId}`}
                                className="text-sm font-bold text-emerald-700 hover:underline"
                            >
                                {cart.storeName ?? 'Toko'}
                            </Link>
                            <span className="text-xs text-slate-400 ml-1">— semua item dari toko ini</span>
                        </div>

                        {cart.items.map(item => (
                            <div
                                key={item.cartItemId}
                                className="bg-white border border-blue-100 rounded-2xl p-4 flex items-center gap-4"
                            >
                                <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center text-2xl flex-shrink-0">
                                    🐟
                                </div>

                                <div className="flex-1 min-w-0">
                                    <Link
                                        to={`/products/${item.productId}`}
                                        className="font-semibold text-slate-800 hover:text-blue-600 transition text-sm truncate block"
                                    >
                                        {item.productName}
                                    </Link>
                                    <p className="text-blue-600 font-bold text-sm mt-0.5">
                                        {formatRupiah(item.productPrice)}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => handleQtyChange(item.cartItemId, item.quantity - 1)}
                                        disabled={item.quantity <= 1 || busyItem === item.cartItemId}
                                        className="w-7 h-7 rounded-lg border border-blue-200 text-blue-600 font-bold text-base hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                    >
                                        −
                                    </button>
                                    <span className="w-8 text-center text-sm font-semibold text-slate-700">
                                        {busyItem === item.cartItemId ? '...' : item.quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQtyChange(item.cartItemId, item.quantity + 1)}
                                        disabled={busyItem === item.cartItemId}
                                        className="w-7 h-7 rounded-lg border border-blue-200 text-blue-600 font-bold text-base hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="text-right flex-shrink-0 hidden sm:block">
                                    <p className="text-xs text-slate-400">Subtotal</p>
                                    <p className="font-bold text-slate-700 text-sm">
                                        {formatRupiah(item.subtotal)}
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleRemove(item.cartItemId)}
                                    disabled={busyItem === item.cartItemId}
                                    className="ml-1 text-red-300 hover:text-red-500 transition disabled:opacity-40"
                                    title="Hapus item"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white border border-blue-100 rounded-2xl p-5 sticky top-24 space-y-4">
                            <div>
                                <h2 className="font-bold text-slate-800 text-base">Checkout</h2>
                                <p className="text-xs text-slate-400 mt-1">
                                    Ringkasan final akan muncul sebelum konfirmasi.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                                        Alamat Pengiriman
                                    </label>
                                    <select
                                        value={selectedAddressId}
                                        onChange={(e) => setSelectedAddressId(e.target.value)}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    >
                                        {addresses.length === 0 && (
                                            <option value="">Belum ada alamat</option>
                                        )}
                                        {addresses.map(addr => (
                                            <option key={addr.id} value={addr.id}>
                                                {addr.label}{addr.isDefault ? ' (Default)' : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-slate-400 mt-2">
                                        {selectedAddress
                                            ? `${selectedAddress.recipientName} - ${selectedAddress.city}`
                                            : 'Tambahkan alamat default agar checkout lebih cepat.'}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                                        Metode Pengiriman
                                    </label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {DELIVERY_OPTIONS.map(option => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => setDeliveryMethod(option.value)}
                                                className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition text-left ${
                                                    deliveryMethod === option.value
                                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                        : 'border-slate-200 hover:border-blue-300 text-slate-600'
                                                }`}
                                            >
                                                <span className="font-semibold">{option.label}</span>
                                                <span className="text-xs">{option.feeLabel}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                                        Kode Voucher / Promo
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={discountCode}
                                            onChange={(e) => {
                                                setDiscountCode(e.target.value.toUpperCase())
                                                setDiscountCheck(null)
                                            }}
                                            placeholder="Masukkan kode (opsional)"
                                            className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 uppercase"
                                        />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleCheckDiscount}
                                            disabled={discountCheckLoading || !discountCode.trim()}
                                        >
                                            {discountCheckLoading ? '...' : 'Cek'}
                                        </Button>
                                    </div>
                                    {discountCheck && (
                                        <div className={`mt-2 rounded-xl px-3 py-2 text-xs border ${
                                            discountCheck.valid
                                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                                : 'bg-red-50 border-red-200 text-red-600'
                                        }`}>
                                            {discountCheck.valid ? (
                                                <div className="flex items-center justify-between gap-2">
                                                    <span>
                                                        <span className="font-bold uppercase mr-1">
                                                            {discountCheck.source === 'VOUCHER' ? '🎟️ Voucher' : '🏷️ Promo'}
                                                        </span>
                                                        berlaku
                                                    </span>
                                                    <span className="font-semibold">
                                                        -{formatRupiah(discountCheck.discountAmount)}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span>{discountCheck.message}</span>
                                            )}
                                        </div>
                                    )}
                                    <div className="mt-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowAvailableDiscounts(!showAvailableDiscounts)}
                                            className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                                        >
                                            {showAvailableDiscounts ? '▲' : '▼'} Lihat kode diskon tersedia
                                        </button>
                                        {showAvailableDiscounts && (
                                            <div className="mt-2 space-y-2">
                                                {availableVouchers.filter(v => v.active && !v.expired).length > 0 && (
                                                    <div>
                                                        <p className="text-xs font-semibold text-slate-500 mb-1">🎟️ Voucher</p>
                                                        <div className="space-y-1">
                                                            {availableVouchers.filter(v => v.active && !v.expired).slice(0, 5).map(v => (
                                                                <div key={v.id} className="flex items-center justify-between bg-blue-50 rounded-lg px-3 py-1.5 text-xs">
                                                                    <span className="font-mono font-bold text-blue-700">{v.code}</span>
                                                                    <span className="text-slate-500">
                                                                        {v.discountType === 'PERCENTAGE' ? `${v.discountValue}%` : formatRupiah(v.discountValue)}
                                                                        {v.remainingUsage > 0 && ` (sisa ${v.remainingUsage})`}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {availablePromos.filter(p => p.active && !p.expired).length > 0 && (
                                                    <div>
                                                        <p className="text-xs font-semibold text-slate-500 mb-1">🏷️ Promo</p>
                                                        <div className="space-y-1">
                                                            {availablePromos.filter(p => p.active && !p.expired).slice(0, 5).map(p => (
                                                                <div key={p.id} className="flex items-center justify-between bg-orange-50 rounded-lg px-3 py-1.5 text-xs">
                                                                    <span className="font-mono font-bold text-orange-700">{p.code}</span>
                                                                    <span className="text-slate-500">
                                                                        {p.discountType === 'PERCENTAGE' ? `${p.discountValue}%` : formatRupiah(p.discountValue)}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {availableVouchers.filter(v => v.active && !v.expired).length === 0 &&
                                                 availablePromos.filter(p => p.active && !p.expired).length === 0 && (
                                                    <p className="text-xs text-slate-400">Belum ada diskon tersedia.</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm text-slate-600 border-t border-blue-50 pt-3">
                                    <div className="flex justify-between">
                                        <span>Toko</span>
                                        <span className="font-semibold text-emerald-700">{cart.storeName ?? '-'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Total produk</span>
                                        <span className="font-semibold">{cart.totalItems} item</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Estimasi ongkir</span>
                                        <span className="font-semibold">{estimatedFee}</span>
                                    </div>
                                </div>

                                <div className="border-t border-blue-50 pt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-slate-700">Subtotal</span>
                                        <span className="text-lg font-extrabold text-blue-600">
                                            {formatRupiah(cart.grandTotal)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Final total akan menambahkan ongkir dan PPN 12%.
                                    </p>
                                </div>

                                <Button
                                    variant="primary"
                                    fullWidth
                                    onClick={handlePreviewCheckout}
                                    disabled={previewLoading || !selectedAddressId}
                                >
                                    {previewLoading ? 'Memuat ringkasan...' : 'Lihat Ringkasan Checkout'}
                                </Button>

                                {wallet && (
                                    <div className={`rounded-xl px-4 py-3 text-sm border ${
                                        previewData?.walletSufficient === false
                                            ? 'bg-red-50 border-red-200 text-red-700'
                                            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                    }`}>
                                        <div className="flex justify-between gap-3">
                                            <span>Saldo wallet</span>
                                            <span className="font-semibold">{formatRupiah(wallet.balance)}</span>
                                        </div>
                                        {previewData?.totalAmount && (
                                            <div className="flex justify-between gap-3 mt-1 text-xs">
                                                <span>Estimasi total</span>
                                                <span>{formatRupiah(previewData.totalAmount)}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {checkoutModalOpen && previewData && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
                    <div className="bg-white rounded-2xl shadow-xl border border-blue-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Ringkasan Checkout</h3>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Cek subtotal, ongkir, dan PPN 12% sebelum lanjut.
                                    </p>
                                </div>
                                <button
                                    className="text-slate-400 hover:text-slate-700"
                                    onClick={() => setCheckoutModalOpen(false)}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className="p-6 grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Alamat</p>
                                    <div className="rounded-xl border border-slate-200 p-4 text-sm text-slate-600">
                                        <p className="font-semibold text-slate-800">{previewData.address?.recipientName}</p>
                                        <p>{previewData.address?.phone}</p>
                                        <p className="mt-2">{previewData.address?.fullAddress}</p>
                                        <p>{previewData.address?.city}, {previewData.address?.postalCode}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Metode Pengiriman</p>
                                    <div className="rounded-xl border border-slate-200 p-4 text-sm text-slate-600">
                                        <p className="font-semibold text-slate-800">
                                            <DeliveryMethodLabel value={previewData.deliveryMethod} />
                                        </p>
                                        <p>{formatRupiah(previewData.deliveryFee)}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Item</p>
                                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                                        {previewData.items.map(item => (
                                            <div key={item.productId} className="rounded-xl border border-slate-200 p-3 text-sm">
                                                <div className="flex justify-between gap-3">
                                                    <p className="font-semibold text-slate-800">{item.productName}</p>
                                                    <p className="text-slate-600">{item.quantity}x</p>
                                                </div>
                                                <div className="flex justify-between gap-3 mt-1 text-slate-500">
                                                    <span>{formatRupiah(item.unitPrice)}</span>
                                                    <span>{formatRupiah(item.subtotal)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm space-y-2">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">{formatRupiah(previewData.subtotal)}</span>
                                    </div>
                                    {previewData.discountSource && previewData.discountSource !== 'NONE' && (
                                        <div className="flex justify-between text-emerald-600">
                                            <span>Diskon {previewData.discountLabel || `(${previewData.discountSource})`}</span>
                                            <span className="font-semibold">−{formatRupiah(previewData.discountAmount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-slate-500 text-xs border-t border-blue-50 pt-1">
                                        <span>Dasar Pengenaan Pajak</span>
                                        <span>{formatRupiah(previewData.taxBase)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Delivery fee</span>
                                        <span className="font-semibold">{formatRupiah(previewData.deliveryFee)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>PPN {previewData.taxRatePercent}%</span>
                                        <span className="font-semibold">{formatRupiah(previewData.taxAmount)}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-blue-100 pt-2">
                                        <span className="font-bold text-slate-700">Total</span>
                                        <span className="font-extrabold text-blue-700">{formatRupiah(previewData.totalAmount)}</span>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        Diskon dipotong dari subtotal sebelum PPN 12%.
                                        PPN dihitung dari dasar pengenaan pajak (subtotal − diskon).
                                    </p>
                                </div>

                                <div className={`rounded-2xl border p-4 text-sm ${
                                    previewData.walletSufficient
                                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                        : 'border-red-200 bg-red-50 text-red-700'
                                }`}>
                                    <div className="flex justify-between">
                                        <span>Saldo wallet</span>
                                        <span className="font-semibold">{formatRupiah(previewData.walletBalance)}</span>
                                    </div>
                                    <div className="flex justify-between mt-1">
                                        <span>Status</span>
                                        <span className="font-semibold">
                                            {previewData.walletSufficient ? 'Cukup' : 'Tidak cukup'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-1">
                                    <Button variant="outline" fullWidth onClick={() => setCheckoutModalOpen(false)}>
                                        Kembali
                                    </Button>
                                    <Button
                                        variant="primary"
                                        fullWidth
                                        onClick={handleConfirmCheckout}
                                        disabled={checkoutLoading || !previewData.walletSufficient}
                                    >
                                        {checkoutLoading ? 'Memproses...' : 'Konfirmasi Pesanan'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {clearConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
                        <p className="text-slate-800 font-bold text-lg mb-2">Kosongkan Keranjang?</p>
                        <p className="text-slate-500 text-sm mb-6">
                            Semua item akan dihapus dari keranjang. Tindakan ini tidak bisa dibatalkan.
                        </p>
                        <div className="flex gap-3">
                            <Button variant="outline" fullWidth onClick={() => setClearConfirm(false)}>
                                Batal
                            </Button>
                            <Button variant="danger" fullWidth onClick={handleClear}>
                                Ya, Kosongkan
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    )
}

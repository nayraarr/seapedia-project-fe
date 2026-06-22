import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import Button from '../../../components/ui/Button'
import { useCart } from '../../../contexts/useCart'
import { useAuth } from '../../../contexts/useAuth'

function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
    }).format(amount ?? 0)
}

export default function CartPage() {
    const { cart, loading, fetchCart, update, remove, clear } = useCart()
    const { activeRole } = useAuth()
    const [clearConfirm, setClearConfirm] = useState(false)
    const [busyItem, setBusyItem] = useState(null) // cartItemId sedang diproses

    useEffect(() => {
        fetchCart()
    }, [fetchCart])

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

    return (
        <MainLayout>
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Keranjang</span>
                    <h1 className="text-2xl font-bold text-slate-800 mt-1">Keranjang Belanja 🛒</h1>
                </div>
                {!isEmpty && (
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setClearConfirm(true)}
                    >
                        Kosongkan
                    </Button>
                )}
            </div>

            {/* Single-store info banner */}
            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-3 text-sm text-blue-700">
                <span className="text-lg flex-shrink-0">ℹ️</span>
                <p>
                    Keranjang SEAPEDIA hanya dapat memuat produk dari{' '}
                    <strong>satu toko</strong> sekaligus. Untuk berbelanja dari toko lain, kosongkan
                    keranjang terlebih dahulu atau selesaikan pesanan saat ini.
                </p>
            </div>

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
                    {/* Item List */}
                    <div className="lg:col-span-2 space-y-3">
                        {/* Store badge */}
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
                                {/* Product icon placeholder */}
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

                                {/* Qty control */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => handleQtyChange(item.cartItemId, item.quantity - 1)}
                                        disabled={item.quantity <= 1 || busyItem === item.cartItemId}
                                        className="w-7 h-7 rounded-lg border border-blue-200 text-blue-600 font-bold text-base
                                                   hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                    >
                                        −
                                    </button>
                                    <span className="w-8 text-center text-sm font-semibold text-slate-700">
                                        {busyItem === item.cartItemId ? '...' : item.quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQtyChange(item.cartItemId, item.quantity + 1)}
                                        disabled={busyItem === item.cartItemId}
                                        className="w-7 h-7 rounded-lg border border-blue-200 text-blue-600 font-bold text-base
                                                   hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Subtotal */}
                                <div className="text-right flex-shrink-0 hidden sm:block">
                                    <p className="text-xs text-slate-400">Subtotal</p>
                                    <p className="font-bold text-slate-700 text-sm">
                                        {formatRupiah(item.subtotal)}
                                    </p>
                                </div>

                                {/* Remove */}
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

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-blue-100 rounded-2xl p-5 sticky top-24">
                            <h2 className="font-bold text-slate-800 mb-4 text-base">Ringkasan Pesanan</h2>

                            <div className="space-y-2 text-sm text-slate-600 mb-4">
                                <div className="flex justify-between">
                                    <span>Toko</span>
                                    <span className="font-semibold text-emerald-700">{cart.storeName ?? '-'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total produk</span>
                                    <span className="font-semibold">{cart.totalItems} item</span>
                                </div>
                            </div>

                            <div className="border-t border-blue-50 pt-3 mb-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-slate-700">Total</span>
                                    <span className="text-xl font-extrabold text-blue-600">
                                        {formatRupiah(cart.grandTotal)}
                                    </span>
                                </div>
                            </div>

                            <Button variant="primary" fullWidth disabled>
                                Checkout (segera hadir)
                            </Button>

                            <p className="text-xs text-center text-slate-400 mt-3">
                                Fitur checkout sedang dalam pengembangan
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm clear dialog */}
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

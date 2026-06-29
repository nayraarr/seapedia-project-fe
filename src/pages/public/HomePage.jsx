import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import Button from '../../components/ui/Button'
import ProductCard from '../../components/ui/ProductCard'
import api from '../../services/api'
import { useAuth } from '../../contexts/useAuth'
import { getWallet } from '../../services/walletApi'
import AppReviewSection from '../../components/ui/AppReviewSection'
import { CreditCard, MapPin, ShoppingCart, Package, BarChart3 } from 'lucide-react'
import { ChevronLeft, ChevronRight, Shirt, Smartphone, Home, BookOpen, Gamepad2, Utensils, Gift, Sparkles } from 'lucide-react'

function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount ?? 0)
}

const banners = [
    '/banner-1.png',
    '/banner-2.png',
    '/banner-3.png',
    '/banner-4.png',
]

const categories = [
    { label: 'Fashion', icon: Shirt },
    { label: 'Elektronik', icon: Smartphone },
    { label: 'Rumah Tangga', icon: Home },
    { label: 'Buku', icon: BookOpen },
    { label: 'Game', icon: Gamepad2 },
    { label: 'Makanan', icon: Utensils },
    { label: 'Hadiah', icon: Gift },
    { label: 'Lainnya', icon: Sparkles },
]

const productTabs = [
    { key: 'all', label: 'Untukmu' },
    { key: 'newest', label: 'Terbaru' },
    { key: 'cheapest', label: 'Termurah' },
]

export default function HomePage() {
    const { activeRole } = useAuth()
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentSlide, setCurrentSlide] = useState(0)
    const [activeTab, setActiveTab] = useState('all')
    const [wallet, setWallet] = useState(null)
    const [walletLoading, setWalletLoading] = useState(true)

    const isBuyer = activeRole === 'BUYER'

    const nextSlide = useCallback(() => {
        setCurrentSlide(prev => (prev + 1) % banners.length)
    }, [])

    const prevSlide = useCallback(() => {
        setCurrentSlide(prev => (prev - 1 + banners.length) % banners.length)
    }, [])

    useEffect(() => {
        const timer = setInterval(nextSlide, 4000)
        return () => clearInterval(timer)
    }, [nextSlide])

    useEffect(() => {
        api.get('/products')
            .then(res => setProducts(res.data.data || []))
            .catch(() => setProducts([]))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        if (!isBuyer) { setWalletLoading(false); return }
        getWallet()
            .then(res => setWallet(res.data.data))
            .catch(() => {})
            .finally(() => setWalletLoading(false))
    }, [isBuyer])

    const sortedProducts = [...products]
    if (activeTab === 'newest') {
        sortedProducts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    } else if (activeTab === 'cheapest') {
        sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0))
    }

    const displayed = sortedProducts.slice(0, 8)

    const buyerMenuCards = [
        { label: 'Wallet & Saldo', icon: CreditCard, desc: 'Kelola saldo dan top up', path: '/dashboard/buyer/wallet', extra: walletLoading ? null : <p className="text-ocean-600 font-bold text-lg mt-1">{wallet ? formatRupiah(wallet.balance) : 'Rp0'}</p> },
        { label: 'Alamat Pengiriman', icon: MapPin, desc: 'Kelola alamat pengiriman', path: '/dashboard/buyer/addresses' },
        { label: 'Keranjang', icon: ShoppingCart, desc: 'Ringkasan cart satu toko', path: '/dashboard/buyer/cart' },
        { label: 'Riwayat Pesanan', icon: Package, desc: 'Lacak semua transaksimu', path: '/dashboard/buyer/orders' },
        { label: 'Laporan Pengeluaran', icon: BarChart3, desc: 'Ringkasan total belanja', path: '/dashboard/buyer/report' },
    ]

    return (
        <MainLayout>
            {/* Hero Carousel */}
            <section className="relative rounded-lg overflow-hidden mb-6 bg-slate-100">
                <div className="relative aspect-[16/5]">
                    {banners.map((src, i) => (
                        <img
                            key={src}
                            src={src}
                            alt={`Promo ${i + 1}`}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                        />
                    ))}
                </div>

                <button onClick={prevSlide} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-sm transition">
                    <ChevronLeft size={18} className="text-slate-700" strokeWidth={2} />
                </button>
                <button onClick={nextSlide} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-sm transition">
                    <ChevronRight size={18} className="text-slate-700" strokeWidth={2} />
                </button>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {banners.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentSlide(i)}
                            className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? 'bg-white w-5' : 'bg-white/50'}`}
                        />
                    ))}
                </div>
            </section>

            {/* Categories */}
            <section className="mb-6">
                <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-4 text-center">Kategori Produk</h2>
                <div className="flex flex-wrap justify-center gap-3">
                    {categories.map(cat => (
                        <Link
                            key={cat.label}
                            to={`/products?search=${cat.label}`}
                            className="flex flex-col items-center gap-1 w-20"
                        >
                            <div className="w-14 h-14 rounded-full bg-ocean-50 flex items-center justify-center text-ocean-600 hover:bg-ocean-100 hover:text-ocean-700 transition">
                                <cat.icon size={22} strokeWidth={1.5} />
                            </div>
                            <span className="text-[11px] font-medium text-slate-600 text-center leading-tight">{cat.label}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Buyer Dashboard Menu */}
            {isBuyer && (
                <section className="mb-6 animate-fade-in">
                    <div className="grid md:grid-cols-3 gap-4">
                        {buyerMenuCards.map(card => (
                            <div
                                key={card.label}
                                onClick={() => card.path && navigate(card.path)}
                                className="card p-4 card-hover cursor-pointer"
                            >
                                <div className="text-3xl mb-3"><card.icon size={28} strokeWidth={1.5} /></div>
                                <h3 className="font-semibold text-slate-700 mb-1">{card.label}</h3>
                                <p className="text-slate-400 text-sm">{card.desc}</p>
                                {card.extra}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* 2-Column Section */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="sm:col-span-2 rounded-lg bg-gradient-to-br from-ocean-500 to-ocean-700 p-5 text-white">
                    <p className="text-xs font-medium opacity-80 uppercase tracking-wide">Promo Bulanan</p>
                    <h3 className="text-xl font-extrabold mt-1">Diskon Spesial Hingga 50%</h3>
                    <p className="text-sm opacity-80 mt-1 mb-3">Setiap pembelian produk favorit kamu</p>
                    <Link to="/products" className="inline-block bg-white text-ocean-700 text-sm font-bold px-4 py-2 rounded-lg hover:bg-ocean-50 transition">
                        Lihat Promo
                    </Link>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                    <h3 className="font-bold text-slate-800 text-sm mb-2">Informasi Terbaru</h3>
                    <p className="text-xs text-slate-500 mb-3">Dapatkan update promo dan info terbaru dari SEAPEDIA.</p>
                    <Button onClick={() => navigate('/products')} variant="outline" size="sm">
                        Jelajahi Produk
                    </Button>
                </div>
            </section>

            {/* Product Tabs */}
            <section className="mb-6">
                <div className="flex items-center gap-1 mb-4 border-b border-slate-200">
                    {productTabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
                                activeTab === tab.key
                                    ? 'text-ocean-600 border-ocean-600'
                                    : 'text-slate-500 border-transparent hover:text-slate-700'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                    <div className="flex-1" />
                    <Link to="/products" className="text-ocean-600 text-sm font-semibold flex items-center gap-1 hover:underline flex-shrink-0">
                        Lihat Semua
                        <ChevronRight size={16} strokeWidth={2} />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="skeleton aspect-[3/4]" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {displayed.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>
            <AppReviewSection />
        </MainLayout>
    )
}

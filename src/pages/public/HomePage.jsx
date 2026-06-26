import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import ProductCard from '../../components/ui/ProductCard'
import ReviewSection from '../../components/ui/ReviewSection'
import api from '../../services/api'

const stats = [
    { label: 'Produk Tersedia', value: '1.200+', icon: '📦' },
    { label: 'Penjual Aktif', value: '340+', icon: '🏪' },
    { label: 'Transaksi Selesai', value: '8.500+', icon: '✅' },
]

export default function HomePage() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get('/products')
            .then(res => setProducts(res.data.data?.slice(0, 6) || []))
            .catch(() => setProducts([]))
            .finally(() => setLoading(false))
    }, [])

    return (
        <MainLayout>
            <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl ocean-gradient-subtle border border-ocean-100 p-6 sm:p-12 mb-12">
                <div className="absolute top-0 right-0 w-64 h-64 bg-ocean-200/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-ocean-300/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
                <div className="relative text-center sm:text-left max-w-xl mx-auto sm:mx-0">
                    <span className="inline-flex items-center gap-1.5 bg-ocean-100 text-ocean-700 text-xs font-bold px-4 py-1.5 rounded-full mb-5 tracking-wide">
                        <span className="w-2 h-2 rounded-full bg-ocean-500 animate-pulse" />
                        Marketplace Terpercaya
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-800 mb-4 leading-tight tracking-tight">
                        Belanja Lebih Mudah<br />
                        <span className="text-gradient">Bersama SEAPEDIA</span>
                    </h1>
                    <p className="text-slate-500 text-sm sm:text-lg mb-8 leading-relaxed max-w-lg">
                        Temukan produk dari berbagai penjual terpercaya dalam satu platform yang sederhana dan nyaman.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <Link
                            to="/products"
                            className="w-full sm:w-auto ocean-gradient text-white px-8 py-3.5 rounded-xl text-base font-semibold hover:shadow-lg hover:shadow-ocean-200 transition-all active:scale-[0.98] text-center"
                        >
                            Jelajahi Produk
                        </Link>
                        <Link
                            to="/register"
                            className="w-full sm:w-auto border-2 border-ocean-200 text-ocean-600 px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-ocean-50 hover:border-ocean-300 transition active:scale-[0.98] text-center"
                        >
                            Daftar Gratis
                        </Link>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-3 gap-3 sm:gap-4 mb-12">
                {stats.map(stat => (
                    <div key={stat.label} className="card-hover p-4 sm:p-5 text-center group">
                        <span className="text-xl sm:text-3xl block mb-1 sm:mb-2">{stat.icon}</span>
                        <p className="text-lg sm:text-3xl font-extrabold text-ocean-600 mb-0.5 sm:mb-1">{stat.value}</p>
                        <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                    </div>
                ))}
            </section>

            <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 rounded-full ocean-gradient" />
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">Produk Unggulan</h2>
                    </div>
                    <Link to="/products" className="text-ocean-600 hover:text-ocean-700 text-sm font-semibold flex items-center gap-1 transition group">
                        Lihat semua
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="skeleton rounded-2xl h-64" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            <ReviewSection />
        </MainLayout>
    )
}

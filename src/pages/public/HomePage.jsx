import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import ProductCard from '../../components/ui/ProductCard'
import ReviewSection from '../../components/ui/ReviewSection'
import api from '../../services/api'

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
            {/* Hero */}
            <section className="text-center py-16 px-4">
                <span className="inline-block bg-blue-100 text-blue-600 text-xs font-bold px-4 py-1.5 rounded-full mb-5 tracking-wide uppercase">
                    Marketplace Terpercaya
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4 leading-tight tracking-tight">
                    Belanja Lebih Mudah<br />
                    <span className="text-blue-600">Bersama SEAPEDIA</span>
                </h1>
                <p className="text-slate-500 text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                    Temukan produk dari berbagai penjual terpercaya dalam satu platform yang sederhana dan nyaman.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        to="/products"
                        className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-blue-700 transition shadow-sm shadow-blue-200 text-center"
                    >
                        Jelajahi Produk
                    </Link>
                    <Link
                        to="/register"
                        className="w-full sm:w-auto border border-blue-200 text-blue-600 px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-blue-50 transition text-center"
                    >
                        Daftar Gratis
                    </Link>
                </div>
            </section>

            {/* Stats */}
            <section className="grid grid-cols-3 gap-3 mb-16">
                {[
                    { label: 'Produk Tersedia', value: '1.200+' },
                    { label: 'Penjual Aktif', value: '340+' },
                    { label: 'Transaksi Selesai', value: '8.500+' },
                ].map(stat => (
                    <div key={stat.label} className="bg-white border border-blue-100 rounded-2xl p-4 text-center">
                        <p className="text-xl md:text-3xl font-extrabold text-blue-600 mb-1">{stat.value}</p>
                        <p className="text-xs md:text-sm text-slate-500 font-medium leading-tight">{stat.label}</p>
                    </div>
                ))}
            </section>

            {/* Featured Products */}
            <section className="mb-16">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Produk Unggulan</h2>
                    <Link to="/products" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                        Lihat semua →
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white animate-pulse rounded-2xl h-52 border border-blue-50" />
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

            {/* Review Section */}
            <ReviewSection />
        </MainLayout>
    )
}
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
            <section className="text-center py-16">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    Selamat Datang di <span className="text-blue-600">SEAPEDIA</span>
                </h1>
                <p className="text-gray-500 text-lg mb-8">
                    Marketplace multi-penjual terpercaya — temukan produk dari berbagai toko dalam satu platform.
                </p>
                <Link
                    to="/products"
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl text-lg hover:bg-blue-700 transition"
                >
                    Jelajahi Produk
                </Link>
            </section>

            {/* Featured Products */}
            <section className="mb-16">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Produk Unggulan</h2>
                    <Link to="/products" className="text-blue-600 hover:underline text-sm">
                        Lihat semua →
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-48" />
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
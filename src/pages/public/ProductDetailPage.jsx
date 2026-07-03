import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import Button from '../../components/ui/Button'
import api from '../../services/api'
import { useAuth } from '../../contexts/useAuth'
import { useCart } from '../../contexts/useCart'
import { getMyStore } from '../../services/storeApi'
import BackButton from '../../components/ui/BackButton'
import ProductCard from '../../components/ui/ProductCard'
import ReviewSection from '../../components/ui/ReviewSection'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { Star, Heart, Share2 } from 'lucide-react'

const categoryLabels = {
    FASHION: 'Fashion',
    ELEKTRONIK: 'Elektronik',
    RUMAH_TANGGA: 'Rumah Tangga',
    BUKU: 'Buku',
    GAME: 'Game',
    MAKANAN: 'Makanan',
    HADIAH: 'Hadiah',
    LAINNYA: 'Lainnya',
}

const infoTabs = [
    { key: 'detail', label: 'Detail Produk' },
    { key: 'info', label: 'Info Penting' },
]

export default function ProductDetailPage() {
    const { id } = useParams()
    const { token, activeRole, roles, login } = useAuth()
    const { add, notify } = useCart()
    const navigate = useNavigate()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [quantity, setQuantity] = useState(1)
    const [adding, setAdding] = useState(false)
    const [message, setMessage] = useState(null)
    const [imgError, setImgError] = useState(false)
    const [prevId, setPrevId] = useState(id)
    const [myStoreId, setMyStoreId] = useState(null)
    const [activeInfoTab, setActiveInfoTab] = useState('detail')
    const [storeProducts, setStoreProducts] = useState([])
    const [similarProducts, setSimilarProducts] = useState([])
    const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 })
    if (id !== prevId) { setPrevId(id); setImgError(false); setLoading(true); setNotFound(false); setProduct(null) }

    const formatPrice = (price) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price)

    useEffect(() => {
        window.scrollTo(0, 0)
        api.get(`/products/${id}`)
            .then(res => setProduct(res.data.data))
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false))
    }, [id])

    useEffect(() => {
        if (!product) return
        api.get(`/products/store/${product.storeId}`)
            .then(res => setStoreProducts((res.data.data || []).filter(p => p.id !== product.id)))
            .catch(() => void 0)
        api.get(`/products/${id}/similar`)
            .then(res => setSimilarProducts(res.data.data || []))
            .catch(() => void 0)
    }, [product, id])

    useEffect(() => {
        if (token && activeRole === 'SELLER') {
            getMyStore()
                .then(res => setMyStoreId(res.data.data?.id))
                .catch(() => void 0)
        }
    }, [token, activeRole])

    const handleAddToCart = async () => {
        setAdding(true)
        setMessage(null)
        const result = await add(product.id, quantity, product.storeId)
        setMessage(result.ok ? 'Produk ditambahkan ke keranjang' : result.message)
        setAdding(false)
    }

    const handleSwitchToBuyer = async () => {
        try {
            const res = await api.post('/auth/select-role', { role: 'BUYER' })
            login(res.data.data.token)
        } catch {
            alert('Gagal mengganti role.')
        }
    }

    if (loading) return (
        <MainLayout>
            <div className="animate-pulse space-y-4">
                <div className="skeleton h-8 w-24" />
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="skeleton aspect-square rounded-lg" />
                    <div className="space-y-3">
                        <div className="skeleton h-8 w-3/4" />
                        <div className="skeleton h-10 w-1/3" />
                        <div className="skeleton h-5 w-1/2" />
                        <div className="skeleton h-24" />
                        <div className="skeleton h-12" />
                    </div>
                </div>
            </div>
        </MainLayout>
    )

    if (notFound) return (
        <MainLayout>
            <div className="text-center py-24">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-lg font-bold text-slate-700 mb-1">Produk tidak ditemukan</h2>
                <p className="text-sm text-slate-400 mb-5">Produk mungkin telah dihapus atau tidak tersedia.</p>
                <Button onClick={() => navigate('/products')} variant="primary" size="sm">Kembali ke produk</Button>
            </div>
        </MainLayout>
    )

    const showImage = product.imageUrl && !imgError
    const isOwner = myStoreId && product.storeId === myStoreId

    return (
        <MainLayout>
            <BackButton className="mb-4" />
            {product && (
                <Breadcrumb
                    className="mb-6"
                    items={[
                        { label: 'Home', to: '/' },
                        ...(product.storeId && product.storeName
                            ? [{ label: product.storeName, to: `/stores/${product.storeId}` }]
                            : []),
                        { label: product.name },
                    ]}
                />
            )}

            <div className="grid md:grid-cols-5 gap-6">
                {/* Left - Image Gallery */}
                <div className="md:col-span-2">
                    <div
                        className={`rounded-lg border overflow-hidden bg-slate-50 aspect-square ${!showImage ? 'flex items-center justify-center' : 'cursor-zoom-in'}`}
                        onMouseMove={e => {
                            const rect = e.currentTarget.getBoundingClientRect()
                            const x = ((e.clientX - rect.left) / rect.width) * 100
                            const y = ((e.clientY - rect.top) / rect.height) * 100
                            setZoomOrigin({ x, y })
                        }}
                    >
                        {showImage ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-200 ease-out"
                                style={{ transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%` }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.5)' }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; setZoomOrigin({ x: 50, y: 50 }) }}
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-slate-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                                </svg>
                                <span className="text-sm mt-2 font-medium">Belum ada gambar</span>
                            </div>
                        )}
                    </div>

                    {showImage && (
                        <div className="flex gap-2 mt-2">
                            <div className="w-16 h-16 rounded border-2 border-ocean-500 overflow-hidden flex-shrink-0">
                                <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Right - Product Info */}
                <div className="md:col-span-3">
                    <div className="md:sticky md:top-20">
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 leading-snug">{product.name}</h1>

                        <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                            {product.rating !== null && product.rating !== undefined && (
                                <span className="flex items-center gap-1">
                                    <Star size={14} className="text-amber-400" fill="#fbbf24" strokeWidth={1.5} />
                                    {product.rating}
                                </span>
                            )}
                            {product.soldCount !== null && product.soldCount !== undefined && product.soldCount > 0 && (
                                <span>Terjual {product.soldCount}</span>
                            )}
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                product.stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                            }`}>
                                {product.stock > 0 ? `Stok: ${product.stock}` : 'Habis'}
                            </span>
                        </div>

                        <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
                            <p className="text-2xl sm:text-3xl font-extrabold text-slate-800">{formatPrice(product.price)}</p>
                        </div>

                        <div className="mt-4">
                            <p className="text-xs font-semibold text-slate-500 mb-2">Jumlah</p>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                    className="w-9 h-9 rounded-lg border border-slate-300 text-slate-700 font-bold text-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                >
                                    −
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                                    className="w-14 text-center border border-slate-300 rounded-lg px-2 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition"
                                />
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-9 h-9 rounded-lg border border-slate-300 text-slate-700 font-bold text-lg hover:bg-slate-100 transition"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {token && activeRole === 'BUYER' && product.stock > 0 && (
                            <div className="mt-4 flex flex-col sm:flex-row gap-2">
                                <Button
                                    variant="outline"
                                    onClick={handleAddToCart}
                                    disabled={adding}
                                    className="flex-1"
                                >
                                    {adding ? 'Menambahkan...' : '+ Keranjang'}
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={handleAddToCart}
                                    disabled={adding}
                                    className="flex-1"
                                >
                                    Beli Langsung
                                </Button>
                            </div>
                        )}

                        {isOwner && (
                            <div className="mt-3">
                                <Button
                                    variant="outline"
                                    onClick={() => navigate(`/dashboard/seller/products/edit/${product.id}`)}
                                    fullWidth
                                    size="sm"
                                >
                                    Edit Produk
                                </Button>
                            </div>
                        )}

                        {token && activeRole && activeRole !== 'BUYER' && roles.includes('BUYER') && (
                            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                                Role saat ini adalah <span className="font-bold">{activeRole}</span>.{' '}
                                <button onClick={handleSwitchToBuyer} className="font-bold hover:underline text-ocean-600">
                                    Ganti ke Buyer
                                </button>{' '}
                                untuk membeli produk ini.
                            </div>
                        )}

                        {token && activeRole && activeRole !== 'BUYER' && !roles.includes('BUYER') && (
                            <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-600">
                                Akun ini tidak memiliki role Buyer, sehingga tidak dapat membeli produk.
                            </div>
                        )}

                        {!token && (
                            <div className="mt-4 bg-ocean-50 border border-ocean-200 rounded-lg p-3 text-sm text-ocean-700">
                                <Link to="/login" className="font-bold hover:underline">Masuk</Link>{' '}
                                atau{' '}
                                <Link to="/register" className="font-bold hover:underline">daftar</Link>{' '}
                                untuk membeli produk ini.
                            </div>
                        )}

                        {message && (
                            <p className={`text-sm mt-3 font-semibold ${message.includes('ditambahkan') ? 'text-emerald-600' : 'text-red-500'}`}>
                                {message}
                            </p>
                        )}

                        <div className="flex items-center gap-2 mt-4 text-slate-400">
                            <button
                                onClick={() => notify('Fitur wishlist sedang dikembangkan', 'info', 'Wishlist')}
                                className="flex items-center gap-1 text-xs hover:text-ocean-600 transition p-1.5 rounded hover:bg-slate-50"
                            >
                                <Heart size={15} strokeWidth={1.5} /> Wishlist
                            </button>
                            <button
                                onClick={async () => {
                                    const url = window.location.href
                                    if (navigator.share) {
                                        await navigator.share({ title: product.name, url }).catch(() => void 0)
                                    } else {
                                        await navigator.clipboard.writeText(url)
                                        notify('Link produk disalin!', 'success', 'Share')
                                    }
                                }}
                                className="flex items-center gap-1 text-xs hover:text-ocean-600 transition p-1.5 rounded hover:bg-slate-50"
                            >
                                <Share2 size={15} strokeWidth={1.5} /> Share
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Tabs */}
            <div className="mt-8 rounded-lg border border-slate-200">
                <div className="flex border-b border-slate-200">
                    {infoTabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveInfoTab(tab.key)}
                            className={`px-5 py-3 text-sm font-semibold border-b-2 transition ${
                                activeInfoTab === tab.key
                                    ? 'text-ocean-600 border-ocean-600'
                                    : 'text-slate-500 border-transparent hover:text-slate-700'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="p-5">
                    {activeInfoTab === 'detail' && (
                        <div>
                            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                                {product.description || 'Tidak ada deskripsi untuk produk ini.'}
                            </p>
                        </div>
                    )}
                    {activeInfoTab === 'info' && (
                        <div className="text-sm text-slate-600 space-y-2">
                            <p><span className="font-semibold text-slate-700">Berat:</span> -</p>
                            <p><span className="font-semibold text-slate-700">Kondisi:</span> Baru</p>
                            <p><span className="font-semibold text-slate-700">Kategori:</span> {product.category ? (categoryLabels[product.category] || product.category) : '-'}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Store Card */}
            {product.storeId && (
                <div className="mt-4 rounded-lg border border-slate-200 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-ocean-100 flex items-center justify-center text-ocean-700 font-bold text-sm flex-shrink-0">
                            {product.storeName?.charAt(0) || 'T'}
                        </div>
                        <div>
                            <p className="font-bold text-sm text-slate-800">{product.storeName}</p>
                            <p className="text-xs text-slate-400">Toko</p>
                        </div>
                    </div>
                    <Link
                        to={`/stores/${product.storeId}`}
                        className="text-ocean-600 text-sm font-semibold border border-ocean-300 px-4 py-1.5 rounded-lg hover:bg-ocean-50 transition"
                    >
                        Lihat Toko
                    </Link>
                </div>
            )}

            {/* Review */}
            <section className="mt-8">
                <ReviewSection />
            </section>

            {/* Lainnya di toko ini */}
            {storeProducts.length > 0 && (
                <section className="mt-8">
                    <h2 className="text-sm font-bold text-slate-700 mb-3">Lainnya di toko ini</h2>
                    <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-thin">
                        {storeProducts.map(p => (
                            <div key={p.id} className="flex-shrink-0 w-40">
                                <ProductCard product={p} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Produk Serupa */}
            {similarProducts.length > 0 && (
                <section className="mt-8">
                    <h2 className="text-sm font-bold text-slate-700 mb-3">Produk Serupa</h2>
                    <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-thin">
                        {similarProducts.map(p => (
                            <div key={p.id} className="flex-shrink-0 w-40">
                                <ProductCard product={p} />
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </MainLayout>
    )
}

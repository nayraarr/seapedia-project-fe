import { Link } from 'react-router-dom'
import { useState } from 'react'
import Button from './Button'
import { useAuth } from '../../contexts/useAuth'
import { useCart } from '../../contexts/useCart'
import { Star, Store } from 'lucide-react'

export default function ProductCard({ product }) {
    const { token, activeRole } = useAuth()
    const { add } = useCart()
    const [busy, setBusy] = useState(false)
    const [imgError, setImgError] = useState(false)

    const formatPrice = (price) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price)

    const handleAdd = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        setBusy(true)
        await add(product.id, 1, product.storeId)
        setBusy(false)
    }

    const hasImage = product.imageUrl && !imgError
    const hasDiscount = product.discountPercent && product.discountPercent > 0
    const originalPrice = hasDiscount ? Math.round(product.price / (1 - product.discountPercent / 100)) : null
    const hasRating = product.rating !== null && product.rating !== undefined
    const hasSold = product.soldCount !== null && product.soldCount !== undefined && product.soldCount > 0

    return (
        <Link to={`/products/${product.id}`} className="group block bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-card-hover transition-all duration-200 overflow-hidden">
            <div className={`relative aspect-[4/3] bg-slate-100 overflow-hidden ${!hasImage ? 'flex items-center justify-center' : ''}`}>
                {hasImage ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                    </svg>
                )}

                {hasDiscount && (
                    <span className="discount-badge">-{product.discountPercent}%</span>
                )}

                {product.stock > 0 && product.stock <= 5 && (
                    <span className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-bl-md">
                        Stok Terbatas
                    </span>
                )}

                {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-black/70 text-white text-xs font-bold px-3 py-1 rounded">Habis</span>
                    </div>
                )}
            </div>

            <div className="p-2.5">
                <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug min-h-[2.5rem]">
                    {product.name}
                </h3>

                <div className="mt-1">
                    {hasDiscount && originalPrice && (
                        <span className="text-[11px] text-slate-400 line-through mr-1">{formatPrice(originalPrice)}</span>
                    )}
                    <p className="text-base font-extrabold text-slate-800">
                        {formatPrice(product.price)}
                    </p>
                </div>

                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                    {hasRating && (
                        <span className="flex items-center gap-0.5">
                            <Star size={11} className="text-amber-400" fill="#fbbf24" strokeWidth={1.5} />
                            {product.rating}
                        </span>
                    )}
                    {hasSold && (
                        <span>{hasRating ? '| ' : ''}Terjual {product.soldCount}</span>
                    )}
                </div>

                {product.storeName && (
                    <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-400 truncate">
                        <Store size={11} strokeWidth={1.5} className="flex-shrink-0" />
                        <span className="truncate">{product.storeName}</span>
                    </div>
                )}
            </div>

            {token && activeRole === 'BUYER' && product.stock > 0 && (
                <div className="px-2.5 pb-2.5 pt-0">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleAdd}
                        disabled={busy}
                        fullWidth
                    >
                        {busy ? (
                            <span className="flex items-center gap-1">
                                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                +
                            </span>
                        ) : (
                            <span className="flex items-center gap-1">+ Keranjang</span>
                        )}
                    </Button>
                </div>
            )}
        </Link>
    )
}

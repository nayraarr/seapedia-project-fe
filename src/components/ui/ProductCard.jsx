import { Link } from 'react-router-dom'
import { useState } from 'react'
import Button from './Button'
import { useAuth } from '../../contexts/useAuth'
import { useCart } from '../../contexts/useCart'

export default function ProductCard({ product }) {
    const { token, activeRole } = useAuth()
    const { add } = useCart()
    const [busy, setBusy] = useState(false)

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

    const gradientMap = [
        'from-ocean-100 to-ocean-200',
        'from-emerald-100 to-emerald-200',
        'from-orange-100 to-amber-200',
        'from-violet-100 to-violet-200',
        'from-rose-100 to-rose-200',
        'from-cyan-100 to-cyan-200',
    ]

    const bgGradient = gradientMap[(product.name?.length || 0) % gradientMap.length]

    return (
        <div className="card-hover group overflow-hidden">
            <Link to={`/products/${product.id}`} className="block p-4">
                <div className={`bg-gradient-to-br ${bgGradient} rounded-xl h-36 mb-4 flex items-center justify-center relative overflow-hidden`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {product.stock <= 0 && (
                        <span className="absolute top-2 right-2 badge-red text-[10px]">Habis</span>
                    )}
                    {product.stock > 0 && product.stock <= 5 && (
                        <span className="absolute top-2 right-2 badge-orange text-[10px]">Sisa {product.stock}</span>
                    )}
                </div>
                <h3 className="font-semibold text-slate-800 text-sm truncate mb-1 group-hover:text-ocean-600 transition-colors">{product.name}</h3>
                <p className="text-ocean-600 font-bold text-base">{formatPrice(product.price)}</p>
                {product.storeName && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
                        <div className="w-4 h-4 rounded bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <span className="truncate">{product.storeName}</span>
                    </div>
                )}
            </Link>

            {token && activeRole === 'BUYER' && (
                <div className="px-4 pb-4 pt-0">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleAdd}
                        disabled={busy || product.stock <= 0}
                        fullWidth
                    >
                        {busy ? (
                            <span className="flex items-center gap-1.5">
                                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Menambah...
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Keranjang
                            </span>
                        )}
                    </Button>
                </div>
            )}
        </div>
    )
}

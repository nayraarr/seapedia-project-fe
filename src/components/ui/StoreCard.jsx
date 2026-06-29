import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price)
}

export default function StoreCard({ store, previewProducts = [] }) {
    const navigate = useNavigate()

    const handleProductClick = (e, productId) => {
        e.preventDefault()
        e.stopPropagation()
        navigate(`/products/${productId}`)
    }

    return (
        <Link to={`/stores/${store.id}`} className="block group">
            <div className="border border-slate-200 rounded-lg p-3 hover:border-ocean-300 hover:shadow-sm transition">
                <div className="flex items-center gap-2 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-ocean-100 flex items-center justify-center text-ocean-600 font-bold text-sm flex-shrink-0">
                        {store.name?.charAt(0) || 'T'}
                    </div>
                    <div className="flex-1 min-w-0 flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-800 truncate group-hover:text-ocean-600 transition-colors">{store.name}</span>
                        {store.description && (
                            <span className="text-xs text-slate-400 truncate hidden sm:inline">· {store.description}</span>
                        )}
                    </div>
                    <span className="inline-flex items-center gap-0.5 text-ocean-600 text-xs font-semibold flex-shrink-0">
                        Lihat Toko
                        <ChevronRight size={12} strokeWidth={2} />
                    </span>
                </div>

                {previewProducts.length > 0 && (
                    <div className="flex gap-1.5 mt-2 pt-2 border-t border-slate-100">
                        {previewProducts.slice(0, 3).map(p => (
                            <div
                                key={p.id}
                                onClick={e => handleProductClick(e, p.id)}
                                className="w-[72px] sm:w-20 bg-slate-50 rounded-md p-1 hover:bg-slate-100 transition cursor-pointer"
                            >
                                <div className="aspect-square bg-slate-200 rounded overflow-hidden">
                                    {p.imageUrl ? (
                                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300 text-[8px] font-medium">No Pic</div>
                                    )}
                                </div>
                                <p className="text-[9px] sm:text-[10px] font-bold text-slate-700 truncate leading-tight mt-0.5">{formatPrice(p.price)}</p>
                            </div>
                        ))}
                        {previewProducts.length > 3 && (
                            <div className="flex items-center text-[10px] text-slate-400 font-medium pl-1">
                                +{previewProducts.length - 3}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Link>
    )
}

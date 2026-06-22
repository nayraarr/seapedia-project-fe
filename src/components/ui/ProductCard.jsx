import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
    const formatPrice = (price) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price)

    return (
        <Link to={`/products/${product.id}`} className="group">
            <div className="bg-white rounded-2xl border border-blue-100 p-4 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer">
                <div className="bg-blue-50 rounded-xl h-36 mb-4 flex items-center justify-center text-blue-300 text-sm font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <h3 className="font-semibold text-slate-800 text-sm truncate mb-1">{product.name}</h3>
                <p className="text-blue-600 font-bold text-base">{formatPrice(product.price)}</p>
                <p className="text-slate-400 text-xs mt-1">Stok: {product.stock}</p>

                {/* info toko */}
                {product.storeName && (
                    <p className="text-emerald-500 text-xs mt-2 flex items-center gap-1 truncate">
                        🏪 <span className="truncate">{product.storeName}</span>
                    </p>
                )}
            </div>
        </Link>
    )
}
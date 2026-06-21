import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
    const formatPrice = (price) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)

    return (
        <Link to={`/products/${product.id}`}>
            <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition cursor-pointer">
                {/* Placeholder image */}
                <div className="bg-gray-100 rounded-lg h-32 mb-3 flex items-center justify-center text-gray-400 text-sm">
                    No Image
                </div>
                <h3 className="font-semibold text-gray-800 text-sm truncate">{product.name}</h3>
                <p className="text-blue-600 font-bold mt-1">{formatPrice(product.price)}</p>
                <p className="text-gray-400 text-xs mt-1">Stok: {product.stock}</p>
            </div>
        </Link>
    )
}
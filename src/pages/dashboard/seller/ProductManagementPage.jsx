import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import Button from '../../../components/ui/Button'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import BackButton from '../../../components/ui/BackButton'
import { getMyProducts, deleteProduct } from '../../../services/productApi'
import { getMyStore } from '../../../services/storeApi'
import { TriangleAlert, Package } from 'lucide-react'

const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price)

export default function ProductManagementPage() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [refresh, setRefresh] = useState(0)
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [noStore, setNoStore] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        getMyStore()
            .then(() => {
                setNoStore(false)
                getMyProducts()
                    .then(res => setProducts(res.data.data || []))
                    .catch(() => setProducts([]))
                    .finally(() => setLoading(false))
            })
            .catch(() => {
                setNoStore(true)
                setLoading(false)
            })
    }, [refresh])

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return
        try {
            await deleteProduct(deleteTarget.id)
            setRefresh(prev => prev + 1)
        } catch {
            alert('Gagal hapus produk.')
        } finally {
            setDeleteTarget(null)
        }
    }

    if (loading) return (
        <MainLayout>
            <BackButton className="mb-3" />
            <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="skeleton h-24" />
                ))}
            </div>
        </MainLayout>
    )

    return (
        <MainLayout>
            <BackButton className="mb-3" />
            <div className="mb-8 flex items-center justify-between animate-fade-in">
                <div>
                    <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Seller</span>
                    <h1 className="text-3xl font-bold text-slate-800 mt-1">Kelola Produk</h1>
                </div>
                {!noStore && (
                    <Button onClick={() => navigate('/dashboard/seller/products/new')}>
                        + Tambah Produk
                    </Button>
                )}
            </div>

            {noStore ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center animate-fade-in">
                    <div className="flex justify-center mb-3"><TriangleAlert size={48} strokeWidth={1.5} /></div>
                    <p className="text-amber-700 font-semibold mb-1">Kamu belum punya toko</p>
                    <p className="text-amber-500 text-sm mb-4">Buat toko dulu sebelum mengelola produk</p>
                    <Button onClick={() => navigate('/dashboard/seller/store')}>
                        Buat Toko
                    </Button>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-20 animate-fade-in">
                    <div className="flex justify-center mb-4"><Package size={48} strokeWidth={1.5} /></div>
                    <p className="text-slate-600 font-semibold">Belum ada produk</p>
                    <p className="text-slate-400 text-sm mt-1 mb-6">Tambah produk pertamamu sekarang</p>
                    <Button onClick={() => navigate('/dashboard/seller/products/new')}>
                        + Tambah Produk
                    </Button>
                </div>
            ) : (
                <div className="space-y-3 animate-fade-in">
                    {products.map(p => {
                        const hasImage = p.imageUrl && !p._imgError
                        return (
                            <div key={p.id} className="card-hover p-4 flex items-center justify-between">
                                <Link to={`/products/${p.id}`} className="flex items-center gap-4 min-w-0 flex-1">
                                    <div className="w-14 h-14 rounded-xl flex-shrink-0 bg-ocean-50 flex items-center justify-center text-ocean-300 overflow-hidden">
                                        {hasImage ? (
                                            <img
                                                src={p.imageUrl}
                                                alt={p.name}
                                                className="w-full h-full object-cover"
                                                onError={() => p._imgError = true}
                                            />
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">{p.name}</h3>
                                        <p className="text-slate-400 text-sm truncate max-w-xs">{p.description || 'Tidak ada deskripsi'}</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-ocean-600 font-bold text-sm">{formatPrice(p.price)}</span>
                                            <span className={`${p.stock > 0 ? 'badge-emerald' : 'badge-red'}`}>
                                                Stok: {p.stock}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                                <div className="flex gap-2 flex-shrink-0 ml-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigate(`/dashboard/seller/products/edit/${p.id}`)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => setDeleteTarget({ id: p.id, name: p.name })}
                                    >
                                        Hapus
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            <ConfirmDialog
                isOpen={Boolean(deleteTarget)}
                title="Hapus Produk"
                message={`Apakah kamu yakin ingin menghapus "${deleteTarget?.name}"? Tindakan ini tidak bisa dibatalkan.`}
                confirmLabel="Ya, Hapus"
                cancelLabel="Batal"
                variant="danger"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteTarget(null)}
            />
        </MainLayout>
    )
}

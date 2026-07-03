import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import { useAuth } from '../../../contexts/useAuth'
import { getMyStore } from '../../../services/storeApi'
import { useNavigate } from 'react-router-dom';
import { Store, TriangleAlert, ClipboardList, Inbox, BarChart3 } from 'lucide-react'

export default function SellerDashboard() {
    const { decoded } = useAuth()
    const [store, setStore] = useState(null)
    const navigate = useNavigate();

    useEffect(() => {
        getMyStore()
            .then(res => setStore(res.data.data))
            .catch(() => setStore(null))
    }, [])

    return (
        <MainLayout>
            <div className="mb-8 animate-fade-in">
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Dashboard</span>
                <h1 className="text-3xl font-bold text-slate-800 mt-1">Halo, {decoded?.fullName || decoded?.username}!</h1>
                <p className="text-slate-400 mt-1">Selamat datang di dashboard Penjual</p>
            </div>

            {/* Store Status Banner */}
            {store ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 flex items-center justify-between animate-slide-up">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl">
                            <Store size={20} strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="font-bold text-emerald-800 text-sm">{store.name}</p>
                            <p className="text-emerald-500 text-xs">Toko aktif</p>
                        </div>
                    </div>
                    <Link
                        to="/dashboard/seller/store"
                        className="text-sm font-semibold bg-emerald-400 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-xl transition"
                    >
                        Kelola →
                    </Link>
                </div>
            ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center justify-between animate-slide-up">
                    <div className="flex items-center gap-3">
                        <span className="text-xl"><TriangleAlert size={20} strokeWidth={1.5} /></span>
                        <p className="text-amber-700 text-sm font-medium">Kamu belum punya toko.</p>
                    </div>
                    <Link
                        to="/dashboard/seller/store"
                        className="text-sm font-semibold bg-amber-400 hover:bg-amber-500 text-white px-4 py-1.5 rounded-xl transition"
                    >
                        Buat Toko
                    </Link>
                </div>
            )}

            {/* Menu Cards */}
            <div className="grid md:grid-cols-3 gap-4 animate-slide-up">
                <Link
                    to="/dashboard/seller/store"
                    className="card-hover p-4 block"
                >
                    <div className="text-3xl mb-3"><Store size={28} strokeWidth={1.5} /></div>
                    <h3 className="font-semibold text-slate-700 mb-1">Toko Saya</h3>
                    <p className="text-slate-400 text-sm">Kelola profil dan info toko</p>
                </Link>

                <div
                    onClick={() => navigate(store ? '/dashboard/seller/products' : '/dashboard/seller/store')}
                    className="card-hover p-4 cursor-pointer"
                >
                    <div className="text-3xl mb-3"><ClipboardList size={28} strokeWidth={1.5} /></div>
                    <h3 className="font-semibold text-slate-700 mb-1">Kelola Produk</h3>
                    <p className="text-slate-400 text-sm">{store ? 'Tambah, edit, hapus produk' : 'Buat toko dulu'}</p>
                </div>

                <div
                    onClick={() => navigate('/dashboard/seller/orders/incoming')}
                    className="card-hover p-4 cursor-pointer"
                >
                    <div className="text-3xl mb-3"><Inbox size={28} strokeWidth={1.5} /></div>
                    <h3 className="font-semibold text-slate-700 mb-1">Pesanan Masuk</h3>
                    <p className="text-slate-400 text-sm">Proses pesanan dari Buyer</p>
                        <span className="badge-emerald mt-2 inline-flex">
                        Lihat daftar
                    </span>
                </div>

                <div
                    onClick={() => navigate('/dashboard/seller/report')}
                    className="card-hover p-4 cursor-pointer"
                >
                    <div className="text-3xl mb-3"><BarChart3 size={28} strokeWidth={1.5} /></div>
                    <h3 className="font-semibold text-slate-700 mb-1">Laporan Pendapatan</h3>
                    <p className="text-slate-400 text-sm">Ringkasan transaksi tokomu</p>
                </div>
            </div>
        </MainLayout>
    )
}

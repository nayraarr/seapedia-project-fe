import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import { useAuth } from '../../../contexts/useAuth'
import { getMyStore } from '../../../services/storeApi'
import { useNavigate } from 'react-router-dom';

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
            <div className="mb-8">
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Dashboard</span>
                <h1 className="text-3xl font-bold text-slate-800 mt-1">Halo, {decoded?.username}! 👋</h1>
                <p className="text-slate-400 mt-1">Selamat datang di dashboard Penjual</p>
            </div>

            {/* Store Status Banner */}
            {store ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl">
                            🏪
                        </div>
                        <div>
                            <p className="font-bold text-emerald-800 text-sm">{store.name}</p>
                            <p className="text-emerald-500 text-xs">Toko aktif</p>
                        </div>
                    </div>
                    <Link
                        to="/dashboard/seller/store"
                        className="text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition"
                    >
                        Kelola →
                    </Link>
                </div>
            ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">⚠️</span>
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
            <div className="grid md:grid-cols-3 gap-4">
                <Link
                    to="/dashboard/seller/store"
                    className="bg-white border border-emerald-100 rounded-2xl p-6 hover:shadow-md hover:border-emerald-300 transition"
                >
                    <div className="text-3xl mb-3">🏪</div>
                    <h3 className="font-semibold text-slate-700 mb-1">Toko Saya</h3>
                    <p className="text-slate-400 text-sm">Kelola profil dan info toko</p>
                </Link>

                <div
                    onClick={() => navigate(store ? '/dashboard/seller/products' : '/dashboard/seller/store')}
                    className="bg-white border border-emerald-100 rounded-2xl p-6 cursor-pointer hover:shadow-md hover:border-emerald-300 transition-all"
                >
                    <div className="text-3xl mb-3">📋</div>
                    <h3 className="font-semibold text-slate-700 mb-1">Kelola Produk</h3>
                    <p className="text-slate-400 text-sm">{store ? 'Tambah, edit, hapus produk' : 'Buat toko dulu'}</p>
                </div>

                <div
                    onClick={() => navigate('/dashboard/seller/orders/incoming')}
                    className="bg-white border border-emerald-100 rounded-2xl p-6 cursor-pointer hover:shadow-md hover:border-emerald-300 transition"
                >
                    <div className="text-3xl mb-3">📬</div>
                    <h3 className="font-semibold text-slate-700 mb-1">Pesanan Masuk</h3>
                    <p className="text-slate-400 text-sm">Proses pesanan dari pembeli</p>
                    <span className="inline-block mt-3 text-xs font-semibold text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-full">
                        Lihat daftar
                    </span>
                </div>

                <div
                    onClick={() => navigate('/dashboard/seller/report')}
                    className="bg-white border border-emerald-100 rounded-2xl p-6 cursor-pointer hover:shadow-md hover:border-emerald-300 transition"
                >
                    <div className="text-3xl mb-3">📊</div>
                    <h3 className="font-semibold text-slate-700 mb-1">Laporan Pendapatan</h3>
                    <p className="text-slate-400 text-sm">Ringkasan transaksi tokomu</p>
                </div>
            </div>
        </MainLayout>
    )
}

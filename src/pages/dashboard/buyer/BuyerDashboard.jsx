import { useState, useEffect } from 'react'
import { CreditCard, MapPin, ShoppingCart, Package, BarChart3, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import { useAuth } from '../../../contexts/useAuth'
import { getWallet, getTransactions } from '../../../services/walletApi'

function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(amount ?? 0)
}

function formatDate(iso) {
    if (!iso) return '-'
    return new Date(iso).toLocaleString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })
}

export default function BuyerDashboard() {
    const { decoded } = useAuth()
    const navigate = useNavigate()
    const [wallet, setWallet] = useState(null)
    const [lastTopUp, setLastTopUp] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchWalletData = async () => {
            try {
                const [walletRes, txRes] = await Promise.all([getWallet(), getTransactions()])
                setWallet(walletRes.data.data)
                const topUps = txRes.data.data.filter(tx => tx.type === 'TOPUP')
                if (topUps.length > 0) setLastTopUp(topUps[0])
            } catch { } finally {
                setLoading(false)
            }
        }
        fetchWalletData()
    }, [])

    const menuCards = [
        {
            label: 'Wallet & Saldo',
            icon: CreditCard,
            desc: 'Kelola saldo dan top up',
            path: '/dashboard/buyer/wallet',
            active: true,
            extra: loading ? null : (
                <p className="text-ocean-600 font-bold text-lg mt-1">
                    {formatRupiah(wallet?.balance)}
                </p>
            )
        },
        {
            label: 'Alamat Pengiriman',
            icon: MapPin,
            desc: 'Kelola alamat pengiriman kamu',
            path: '/dashboard/buyer/addresses',
            active: true,
        },
        {
            label: 'Keranjang',
            icon: ShoppingCart,
            desc: 'Ringkasan cart satu toko',
            path: '/dashboard/buyer/cart',
            active: true,
        },
        {
            label: 'Riwayat Pesanan',
            icon: Package,
            desc: 'Lacak semua transaksimu',
            path: '/dashboard/buyer/orders',
            active: true,
        },
        {
            label: 'Laporan Pengeluaran',
            icon: BarChart3,
            desc: 'Ringkasan total belanja kamu',
            path: '/dashboard/buyer/report',
            active: true,
        },
    ]

    return (
        <MainLayout>
            <div className="mb-8 animate-fade-in">
                <span className="text-xs font-bold text-ocean-500 uppercase tracking-widest">Dashboard</span>
                <h1 className="text-3xl font-bold text-slate-800 mt-1">
                    Halo, {decoded?.fullName || decoded?.username}!
                </h1>
                <p className="text-slate-400 mt-1">Selamat datang di dashboard Pembeli</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 animate-slide-up">
                {menuCards.map(card => (
                    <div
                        key={card.label}
                        onClick={() => card.path && navigate(card.path)}
                        className={`card p-4 transition
                            ${card.active
                            ? 'card-hover cursor-pointer'
                            : 'border-slate-200 opacity-70 cursor-default'}`}
                    >
                        <div className="text-3xl mb-3"><card.icon size={28} strokeWidth={1.5} /></div>
                        <h3 className="font-semibold text-slate-700 mb-1">{card.label}</h3>
                        <p className="text-slate-400 text-sm">{card.desc}</p>
                        {card.extra}
                        {!card.active && (
                            <span className="inline-block mt-3 badge-blue">
                                Segera hadir
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {!loading && lastTopUp && (
                <div className="mt-6 card p-5 flex items-center gap-4 animate-slide-up">
                    <span className="text-2xl"><CheckCircle size={24} strokeWidth={1.5} /></span>
                    <div>
                        <p className="text-sm font-semibold text-slate-700">Top Up Terakhir</p>
                        <p className="text-slate-500 text-sm">
                            {formatRupiah(lastTopUp.amount)} — {formatDate(lastTopUp.createdAt)}
                        </p>
                    </div>
                </div>
            )}
        </MainLayout>
    )
}

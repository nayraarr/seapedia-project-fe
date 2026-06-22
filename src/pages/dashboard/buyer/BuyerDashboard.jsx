import { useState, useEffect } from 'react'
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
            } catch {
                // silently — wallet auto-create, tidak perlu error UI di dashboard
            } finally {
                setLoading(false)
            }
        }
        fetchWalletData()
    }, [])

    const menuCards = [
        {
            label: 'Wallet & Saldo',
            icon: '💳',
            desc: 'Kelola saldo dan top up',
            path: '/dashboard/buyer/wallet',
            active: true,
            extra: loading ? null : (
                <p className="text-blue-600 font-bold text-lg mt-1">
                    {formatRupiah(wallet?.balance)}
                </p>
            )
        },
        {
            label: 'Alamat Pengiriman',
            icon: '📍',
            desc: 'Kelola alamat pengiriman kamu',
            path: '/dashboard/buyer/addresses',
            active: true,
        },
        {
            label: 'Riwayat Pesanan',
            icon: '📦',
            desc: 'Lacak semua transaksimu',
            path: null,
            active: false,
        },
    ]

    return (
        <MainLayout>
            <div className="mb-8">
                <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Dashboard</span>
                <h1 className="text-3xl font-bold text-slate-800 mt-1">
                    Halo, {decoded?.username}! 👋
                </h1>
                <p className="text-slate-400 mt-1">Selamat datang di dashboard Pembeli</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                {menuCards.map(card => (
                    <div
                        key={card.label}
                        onClick={() => card.path && navigate(card.path)}
                        className={`bg-white border rounded-2xl p-6 transition
                            ${card.active
                            ? 'border-blue-200 hover:shadow-md hover:border-blue-400 cursor-pointer'
                            : 'border-blue-100 opacity-70 cursor-default'}`}
                    >
                        <div className="text-3xl mb-3">{card.icon}</div>
                        <h3 className="font-semibold text-slate-700 mb-1">{card.label}</h3>
                        <p className="text-slate-400 text-sm">{card.desc}</p>
                        {card.extra}
                        {!card.active && (
                            <span className="inline-block mt-3 text-xs font-semibold text-blue-400 bg-blue-50 px-2.5 py-1 rounded-full">
                                Segera hadir
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* ── Last top-up info ── */}
            {!loading && lastTopUp && (
                <div className="mt-6 bg-white border border-green-100 rounded-2xl p-5 flex items-center gap-4">
                    <span className="text-2xl">✅</span>
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
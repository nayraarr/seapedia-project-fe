import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import { useAuth } from '../../contexts/useAuth'
import api from '../../services/api'
import BackButton from '../../components/ui/BackButton'
import { ShoppingBag, Store, Truck, Settings, User, Wallet } from 'lucide-react'

const roleInfo = {
    BUYER:  { label: 'Pembeli', badge: 'badge-blue', border: 'border-ocean-200 bg-ocean-50/50', desc: 'Belanja produk & kelola pesanan', icon: <ShoppingBag size={20} strokeWidth={1.5} /> },
    SELLER: { label: 'Penjual', badge: 'badge-emerald', border: 'border-emerald-200 bg-emerald-50/50', desc: 'Kelola toko & produk', icon: <Store size={20} strokeWidth={1.5} /> },
    DRIVER: { label: 'Driver',  badge: 'badge-orange', border: 'border-orange-200 bg-orange-50/50', desc: 'Antar pesanan & lihat penghasilan', icon: <Truck size={20} strokeWidth={1.5} /> },
    ADMIN:  { label: 'Admin',   badge: 'badge-red', border: 'border-red-200 bg-red-50/50', desc: 'Monitor & kelola platform', icon: <Settings size={20} strokeWidth={1.5} /> },
}

const formatCurrency = (amount) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount)

export default function ProfilePage() {
    const { decoded, activeRole, roles, login } = useAuth()
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null)
    const [summary, setSummary] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchData = useCallback(() => {
        Promise.all([
            api.get('/auth/me'),
            api.get('/auth/me/summary'),
        ])
            .then(([profileRes, summaryRes]) => {
                setProfile(profileRes.data.data)
                setSummary(summaryRes.data.data)
            })
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleSwitchRole = async (role) => {
        try {
            const res = await api.post('/auth/select-role', { role })
            login(res.data.data.token)
            navigate(`/dashboard/${role.toLowerCase()}`)
        } catch {
            alert('Gagal mengganti role.')
        }
    }

    if (loading) return (
        <MainLayout>
            <BackButton className="mb-3" />
            <div className="max-w-2xl mx-auto space-y-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="skeleton rounded-2xl h-32" />
                ))}
            </div>
        </MainLayout>
    )

    return (
        <MainLayout>
            <BackButton className="mb-3" />
            <div className="max-w-2xl mx-auto space-y-5">
                <div className="card p-6 animate-fade-in">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-full ocean-gradient flex items-center justify-center text-2xl font-extrabold text-white shadow-md flex-shrink-0">
                            {decoded?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">{profile?.username}</h1>
                            <p className="text-slate-400 text-sm">{profile?.email}</p>
                            <p className="text-slate-300 text-xs mt-1">
                                Bergabung sejak{' '}
                                {profile?.createdAt
                                    ? new Date(profile.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
                                    : '-'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="card p-6 animate-fade-in">
                    <h2 className="text-base font-bold text-slate-700 mb-4">Role Aktif</h2>
                    {activeRole ? (
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${roleInfo[activeRole]?.badge || 'badge-slate'}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {roleInfo[activeRole]?.label || activeRole}
                        </span>
                    ) : (
                        <p className="text-slate-400 text-sm">Belum ada role aktif</p>
                    )}
                </div>

                <div className="card p-6 animate-fade-in">
                    <h2 className="text-base font-bold text-slate-700 mb-4">Role yang Dimiliki</h2>
                    <div className="space-y-3">
                        {roles.map(role => {
                            const info = roleInfo[role] || { label: role, badge: 'badge-slate', border: 'border-slate-200', desc: '', icon: <User size={20} strokeWidth={1.5} /> }
                            const isActive = role === activeRole
                            return (
                                <div
                                    key={role}
                                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                                        isActive ? info.border : 'border-slate-100 hover:border-ocean-200 hover:bg-ocean-50/30'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="inline-flex">{info.icon}</span>
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${info.badge}`}>
                                            {info.label}
                                        </span>
                                        <span className="text-sm text-slate-400 hidden sm:inline">{info.desc}</span>
                                    </div>
                                    {isActive ? (
                                        <span className="text-xs text-ocean-600 font-bold bg-ocean-50 px-2.5 py-1 rounded-full border border-ocean-200">
                                            Aktif
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => handleSwitchRole(role)}
                                            className="text-xs text-slate-400 hover:text-ocean-600 font-semibold hover:underline transition"
                                        >
                                            Gunakan
                                        </button>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="card p-6 animate-fade-in">
                    <div className="mb-5">
                        <h2 className="text-base font-bold text-slate-700">Ringkasan Keuangan</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Saldo real berdasarkan aktivitas akun</p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {roles.includes('BUYER') && (
                            <div className="flex items-center justify-between bg-ocean-50 border border-ocean-100 rounded-xl p-4">
                                <div>
                                    <p className="text-xs text-ocean-600 font-semibold mb-1">Saldo Wallet</p>
                                    <p className="text-lg font-extrabold text-ocean-700">
                                        {summary ? formatCurrency(summary.walletBalance) : '—'}
                                    </p>
                                </div>
                                <Wallet size={24} strokeWidth={1.5} className="flex-shrink-0" />
                            </div>
                        )}

                        {roles.includes('SELLER') && (
                            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                                <div>
                                    <p className="text-xs text-emerald-600 font-semibold mb-1">Pendapatan Toko</p>
                                    <p className="text-lg font-extrabold text-emerald-700">
                                        {summary ? formatCurrency(summary.sellerIncome) : '—'}
                                    </p>
                                </div>
                                <Store size={24} strokeWidth={1.5} className="flex-shrink-0" />
                            </div>
                        )}

                        {roles.includes('DRIVER') && (
                            <div className="flex items-center justify-between bg-orange-50 border border-orange-100 rounded-xl p-4">
                                <div>
                                    <p className="text-xs text-orange-500 font-semibold mb-1">Penghasilan Driver</p>
                                    <p className="text-lg font-extrabold text-orange-700">
                                        {summary ? formatCurrency(summary.driverEarnings) : '—'}
                                    </p>
                                </div>
                                <Truck size={24} strokeWidth={1.5} className="flex-shrink-0" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

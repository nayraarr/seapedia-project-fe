import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import { useAuth } from '../../contexts/useAuth'
import api from '../../services/api'

const roleInfo = {
    BUYER:  { label: 'Pembeli', badge: 'bg-blue-100 text-blue-700',     border: 'border-blue-400 bg-blue-50',     desc: 'Belanja produk & kelola pesanan' },
    SELLER: { label: 'Penjual', badge: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-400 bg-emerald-50', desc: 'Kelola toko & produk' },
    DRIVER: { label: 'Driver',  badge: 'bg-orange-100 text-orange-700',  border: 'border-orange-400 bg-orange-50',  desc: 'Antar pesanan & lihat penghasilan' },
    ADMIN:  { label: 'Admin',   badge: 'bg-red-100 text-red-700',        border: 'border-red-400 bg-red-50',        desc: 'Monitor & kelola platform' },
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
            <div className="max-w-2xl mx-auto space-y-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white animate-pulse rounded-2xl h-32 border border-blue-50" />
                ))}
            </div>
        </MainLayout>
    )

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto space-y-5">

                {/* Profile Header */}
                <div className="bg-white border border-blue-100 rounded-2xl p-6">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-extrabold text-blue-600 flex-shrink-0">
                            {decoded?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">{profile?.username}</h1>
                            <p className="text-slate-400 text-sm">{profile?.email}</p>
                            <p className="text-slate-300 text-xs mt-1">
                                Bergabung sejak{' '}
                                {profile?.createdAt
                                    ? new Date(profile.createdAt).toLocaleDateString('id-ID', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })
                                    : '-'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Active Role */}
                <div className="bg-white border border-blue-100 rounded-2xl p-6">
                    <h2 className="text-base font-bold text-slate-700 mb-4">Role Aktif</h2>
                    {activeRole ? (
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${roleInfo[activeRole]?.badge || 'bg-slate-100 text-slate-600'}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {roleInfo[activeRole]?.label || activeRole}
                        </div>
                    ) : (
                        <p className="text-slate-400 text-sm">Belum ada role aktif</p>
                    )}
                </div>

                {/* All Roles */}
                <div className="bg-white border border-blue-100 rounded-2xl p-6">
                    <h2 className="text-base font-bold text-slate-700 mb-4">Role yang Dimiliki</h2>
                    <div className="space-y-3">
                        {roles.map(role => {
                            const info = roleInfo[role] || {
                                label: role,
                                badge: 'bg-slate-100 text-slate-600',
                                border: 'border-slate-200',
                                desc: '',
                            }
                            const isActive = role === activeRole
                            return (
                                <div
                                    key={role}
                                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition ${
                                        isActive ? info.border : 'border-slate-100 hover:border-blue-200'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${info.badge}`}>
                                            {info.label}
                                        </span>
                                        <span className="text-sm text-slate-400">{info.desc}</span>
                                    </div>
                                    {isActive ? (
                                        <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2.5 py-1 rounded-full">
                                            Aktif
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => handleSwitchRole(role)}
                                            className="text-xs text-slate-400 hover:text-blue-600 font-semibold underline transition"
                                        >
                                            Gunakan
                                        </button>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Financial Summary */}
                <div className="bg-white border border-blue-100 rounded-2xl p-6">
                    <div className="mb-5">
                        <h2 className="text-base font-bold text-slate-700">Ringkasan Keuangan</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Data real akan tersedia di fitur selanjutnya</p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {roles.includes('BUYER') && (
                            <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl p-4">
                                <div>
                                    <p className="text-xs text-blue-500 font-semibold mb-1">Saldo Wallet</p>
                                    <p className="text-lg font-extrabold text-blue-700">
                                        {summary ? formatCurrency(summary.walletBalance) : '—'}
                                    </p>
                                </div>
                                <span className="text-2xl">👛</span>
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
                                <span className="text-2xl">🏪</span>
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
                                <span className="text-2xl">🚗</span>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </MainLayout>
    )
}
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

const roleInfo = {
    BUYER: { label: 'Pembeli', color: 'bg-blue-100 text-blue-700', desc: 'Belanja produk & kelola pesanan' },
    SELLER: { label: 'Penjual', color: 'bg-green-100 text-green-700', desc: 'Kelola toko & produk' },
    DRIVER: { label: 'Driver', color: 'bg-orange-100 text-orange-700', desc: 'Antar pesanan & lihat penghasilan' },
    ADMIN: { label: 'Admin', color: 'bg-red-100 text-red-700', desc: 'Monitor & kelola platform' },
}

const formatCurrency = (amount) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)

export default function ProfilePage() {
    const { decoded, activeRole, roles, login } = useAuth()
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null)
    const [summary, setSummary] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
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
            <div className="animate-pulse space-y-4">
                <div className="bg-gray-200 h-24 rounded-xl" />
                <div className="bg-gray-200 h-48 rounded-xl" />
            </div>
        </MainLayout>
    )

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto space-y-6">

                {/* Profile Header */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
                            {decoded?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">{profile?.username}</h1>
                            <p className="text-gray-500 text-sm">{profile?.email}</p>
                            <p className="text-gray-400 text-xs mt-1">
                                Bergabung sejak {profile?.createdAt
                                ? new Date(profile.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
                                : '-'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Active Role */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Role Aktif</h2>
                    {activeRole ? (
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${roleInfo[activeRole]?.color || 'bg-gray-100 text-gray-600'}`}>
                            <span>●</span>
                            <span>{roleInfo[activeRole]?.label || activeRole}</span>
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm">Belum ada role aktif</p>
                    )}
                </div>

                {/* All Roles */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Role yang Dimiliki</h2>
                    <div className="space-y-3">
                        {roles.map(role => {
                            const info = roleInfo[role] || { label: role, color: 'bg-gray-100 text-gray-600', desc: '' }
                            const isActive = role === activeRole
                            return (
                                <div
                                    key={role}
                                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition ${
                                        isActive ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${info.color}`}>
                                            {info.label}
                                        </span>
                                        <span className="text-sm text-gray-500">{info.desc}</span>
                                    </div>
                                    {isActive ? (
                                        <span className="text-xs text-blue-600 font-semibold">Aktif</span>
                                    ) : (
                                        <button
                                            onClick={() => handleSwitchRole(role)}
                                            className="text-xs text-gray-500 hover:text-blue-600 underline"
                                        >
                                            Gunakan
                                        </button>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Financial Summary Placeholder */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">Ringkasan Keuangan</h2>
                    <p className="text-xs text-gray-400 mb-4">Data real akan tersedia di fitur selanjutnya</p>

                    <div className="grid grid-cols-1 gap-3">
                        {roles.includes('BUYER') && (
                            <div className="flex items-center justify-between bg-blue-50 rounded-xl p-4">
                                <div>
                                    <p className="text-xs text-blue-500 font-medium">Saldo Wallet (Pembeli)</p>
                                    <p className="text-lg font-bold text-blue-700">
                                        {summary ? formatCurrency(summary.walletBalance) : '-'}
                                    </p>
                                </div>
                                <span className="text-2xl">👛</span>
                            </div>
                        )}

                        {roles.includes('SELLER') && (
                            <div className="flex items-center justify-between bg-green-50 rounded-xl p-4">
                                <div>
                                    <p className="text-xs text-green-500 font-medium">Pendapatan Toko (Penjual)</p>
                                    <p className="text-lg font-bold text-green-700">
                                        {summary ? formatCurrency(summary.sellerIncome) : '-'}
                                    </p>
                                </div>
                                <span className="text-2xl">🏪</span>
                            </div>
                        )}

                        {roles.includes('DRIVER') && (
                            <div className="flex items-center justify-between bg-orange-50 rounded-xl p-4">
                                <div>
                                    <p className="text-xs text-orange-500 font-medium">Penghasilan Driver</p>
                                    <p className="text-lg font-bold text-orange-700">
                                        {summary ? formatCurrency(summary.driverEarnings) : '-'}
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
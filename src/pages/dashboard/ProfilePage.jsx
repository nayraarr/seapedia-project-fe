import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import { useAuth } from '../../contexts/useAuth'
import api from '../../services/api'
import BackButton from '../../components/ui/BackButton'
import { ShoppingBag, Store, Truck, Settings, User, Wallet, Pencil } from 'lucide-react'

const roleInfo = {
    BUYER:  { label: 'Buyer', badge: 'badge-blue', border: 'border-ocean-200 bg-ocean-50/50', desc: 'Belanja produk & kelola pesanan', icon: <ShoppingBag size={20} strokeWidth={1.5} /> },
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
    const { activeRole, roles, login } = useAuth()
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null)
    const [summary, setSummary] = useState(null)
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [editFullName, setEditFullName] = useState('')
    const [saving, setSaving] = useState(false)

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

    const handleSaveFullName = async () => {
        if (!editFullName.trim()) return
        setSaving(true)
        try {
            const res = await api.patch('/auth/me', { fullName: editFullName.trim() })
            setProfile(prev => ({ ...prev, fullName: editFullName.trim() }))
            login(res.data.data.token)
            setEditing(false)
        } catch {
            alert('Gagal menyimpan nama.')
        } finally {
            setSaving(false)
        }
    }

    const startEditing = () => {
        setEditFullName(profile?.fullName || '')
        setEditing(true)
    }

    if (loading) return (
        <MainLayout>
            <BackButton className="mb-3" />
            <div className="max-w-2xl mx-auto space-y-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="skeleton rounded-lg h-32" />
                ))}
            </div>
        </MainLayout>
    )

    return (
        <MainLayout>
            <BackButton className="mb-3" />
            <div className="max-w-2xl mx-auto space-y-5">
                <div className="rounded-lg border border-slate-200 p-5">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full ocean-gradient flex items-center justify-center text-2xl font-extrabold text-white shadow-md flex-shrink-0">
                            {(profile?.fullName || profile?.username || '')?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            {editing ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={editFullName}
                                        onChange={e => setEditFullName(e.target.value)}
                                        className="input-field text-lg font-extrabold text-slate-800 py-1 px-2 flex-1"
                                        placeholder="Nama lengkap"
                                        autoFocus
                                    />
                                    <button
                                        onClick={handleSaveFullName}
                                        disabled={saving || !editFullName.trim()}
                                        className="text-sm font-semibold bg-ocean-600 text-white px-3 py-1.5 rounded-lg hover:bg-ocean-700 transition disabled:opacity-50"
                                    >
                                        {saving ? '...' : 'Simpan'}
                                    </button>
                                    <button
                                        onClick={() => setEditing(false)}
                                        className="text-sm font-semibold text-slate-400 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition"
                                    >
                                        Batal
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <h1 className="text-xl font-extrabold text-slate-800 tracking-tight truncate">{profile?.fullName || profile?.username}</h1>
                                    <button onClick={startEditing} className="text-slate-400 hover:text-ocean-600 transition p-1">
                                        <Pencil size={14} strokeWidth={2} />
                                    </button>
                                </div>
                            )}
                            <p className="text-slate-500 text-sm">@{profile?.username}</p>
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

                <div className="rounded-lg border border-slate-200 p-5">
                    <h2 className="text-sm font-bold text-slate-700 mb-3">Role Aktif</h2>
                    {activeRole ? (
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${roleInfo[activeRole]?.badge || 'badge-slate'}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {roleInfo[activeRole]?.label || activeRole}
                        </span>
                    ) : (
                        <p className="text-slate-400 text-sm">Belum ada role aktif</p>
                    )}
                </div>

                <div className="rounded-lg border border-slate-200 p-5">
                    <h2 className="text-sm font-bold text-slate-700 mb-3">Role yang Dimiliki</h2>
                    <div className="space-y-3">
                        {roles.map(role => {
                            const info = roleInfo[role] || { label: role, badge: 'badge-slate', border: 'border-slate-200', desc: '', icon: <User size={20} strokeWidth={1.5} /> }
                            const isActive = role === activeRole
                            return (
                                <div
                                    key={role}
                                    className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                                        isActive ? info.border : 'border-slate-200 hover:border-ocean-200 hover:bg-ocean-50/30'
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

                <div className="rounded-lg border border-slate-200 p-5">
                    <h2 className="font-bold text-slate-800 mb-3 text-sm"><Wallet size={20} strokeWidth={1.5} className="inline-flex mr-1" /> Informasi Keuangan</h2>
                    <div className="space-y-4 text-sm">
                        {roles.includes('BUYER') && (
                            <div className="border-b border-slate-100 pb-3">
                                <p className="text-xs font-semibold text-slate-400 uppercase">Saldo Wallet</p>
                                <p className="text-base font-bold text-slate-800 mt-1">{formatCurrency(summary?.walletBalance)}</p>
                                <p className="text-xs text-slate-400 mt-0.5">Real balance berdasarkan aktivitas akun</p>
                            </div>
                        )}
                        {roles.includes('SELLER') && (
                            <div className={roles.includes('DRIVER') ? 'border-b border-slate-100 pb-3' : ''}>
                                <p className="text-xs font-semibold text-slate-400 uppercase">Pendapatan sebagai Seller</p>
                                <p className="text-base font-bold text-emerald-600 mt-1">{formatCurrency(summary?.sellerIncome)}</p>
                            </div>
                        )}
                        {roles.includes('DRIVER') && (
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase">Pendapatan sebagai Driver</p>
                                <p className="text-base font-bold text-ocean-600 mt-1">{formatCurrency(summary?.driverEarnings)}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

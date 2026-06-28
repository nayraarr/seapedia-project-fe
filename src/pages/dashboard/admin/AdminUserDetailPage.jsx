import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import BackButton from '../../../components/ui/BackButton'
import { getAdminUsers, getAdminUserWallet, getAdminUserFinancialSummary } from '../../../services/adminApi'
import { Wallet } from 'lucide-react'

function formatCurrency(amount) {
    if (amount == null) return '—'
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
    }).format(amount)
}

function formatDate(iso) {
    if (!iso) return '-'
    return new Date(iso).toLocaleString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    })
}

export default function AdminUserDetailPage() {
    const { userId } = useParams()
    const [user, setUser] = useState(null)
    const [wallet, setWallet] = useState(null)
    const [financial, setFinancial] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        Promise.all([
            getAdminUsers(),
            getAdminUserWallet(userId),
            getAdminUserFinancialSummary(userId),
        ])
            .then(([usersRes, walletRes, finRes]) => {
                const found = (usersRes.data.data || []).find(u => u.id === userId)
                if (found) {
                    setUser(found)
                    setWallet(walletRes.data.data)
                    setFinancial(finRes.data.data)
                } else {
                    setError('Pengguna tidak ditemukan.')
                }
            })
            .catch(() => setError('Gagal memuat data pengguna.'))
            .finally(() => setLoading(false))
    }, [userId])

    return (
        <MainLayout>
            <BackButton className="mb-3" />

            {loading ? (
                <div className="skeleton h-64" />
            ) : error ? (
                <div className="card p-8 text-center animate-fade-in">
                    <p className="text-red-600 font-semibold">{error}</p>
                </div>
            ) : (
                <div className="space-y-4 max-w-lg mx-auto animate-slide-up">
                    <div className="card-hover p-4">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-full ocean-gradient flex items-center justify-center text-white text-2xl font-bold shadow-card">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">{user.username}</h1>
                                <p className="text-sm text-slate-400">{user.email}</p>
                            </div>
                        </div>

                        <div className="space-y-4 text-sm">
                            <div className="border-b border-slate-100 pb-3">
                                <p className="text-xs font-semibold text-slate-400 uppercase">Role</p>
                                <p className="font-medium text-slate-800 mt-0.5">
                                    {user.isAdmin
                                        ? <span className="badge-red">Admin</span>
                                        : (user.roles || []).join(', ')}
                                </p>
                            </div>
                            <div className="border-b border-slate-100 pb-3">
                                <p className="text-xs font-semibold text-slate-400 uppercase">ID Pengguna</p>
                                <p className="font-mono text-xs text-slate-500 mt-0.5">{user.id}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase">Bergabung</p>
                                <p className="font-medium text-slate-800 mt-0.5">{formatDate(user.createdAt)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card-hover p-4">
                        <h2 className="font-bold text-slate-800 mb-3 text-sm"><Wallet size={20} strokeWidth={1.5} className="inline-flex mr-1" /> Informasi Keuangan</h2>
                        <div className="space-y-4 text-sm">
                            <div className="border-b border-slate-100 pb-3">
                                <p className="text-xs font-semibold text-slate-400 uppercase">Saldo Wallet</p>
                                <p className="text-base font-bold text-slate-800 mt-1">{formatCurrency(wallet?.balance)}</p>
                                <p className="text-xs text-slate-400 mt-0.5">Real balance berdasarkan aktivitas akun</p>
                            </div>
                            {(user.roles || []).includes('SELLER') && (
                                <div className="border-b border-slate-100 pb-3">
                                    <p className="text-xs font-semibold text-slate-400 uppercase">Pendapatan sebagai Seller</p>
                                    <p className="text-base font-bold text-emerald-600 mt-1">{formatCurrency(financial?.sellerIncome)}</p>
                                </div>
                            )}
                            {(user.roles || []).includes('DRIVER') && (
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase">Pendapatan sebagai Driver</p>
                                    <p className="text-base font-bold text-ocean-600 mt-1">{formatCurrency(financial?.driverEarnings)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    )
}

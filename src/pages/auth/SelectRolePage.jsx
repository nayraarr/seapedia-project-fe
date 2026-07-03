import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'
import api from '../../services/api'
import { ShoppingBag, Store, Truck, Settings, User } from 'lucide-react'

const roleInfo = {
    BUYER: { label: 'Buyer', desc: 'Belanja produk, kelola cart dan pesanan', icon: <ShoppingBag size={20} strokeWidth={1.5} />, accent: 'ocean', gradient: 'from-ocean-100 to-ocean-200', ring: 'ring-ocean-500' },
    SELLER: { label: 'Penjual', desc: 'Kelola toko, produk, dan pesanan masuk', icon: <Store size={20} strokeWidth={1.5} />, accent: 'emerald', gradient: 'from-emerald-100 to-emerald-200', ring: 'ring-emerald-500' },
    DRIVER: { label: 'Driver', desc: 'Ambil dan antar pesanan ke Buyer', icon: <Truck size={20} strokeWidth={1.5} />, accent: 'orange', gradient: 'from-orange-100 to-amber-200', ring: 'ring-orange-500' },
    ADMIN: { label: 'Admin', desc: 'Monitor dan kelola seluruh platform', icon: <Settings size={20} strokeWidth={1.5} />, accent: 'red', gradient: 'from-red-100 to-red-200', ring: 'ring-red-500' },
}

export default function SelectRolePage() {
    const { decoded, login } = useAuth()
    const navigate = useNavigate()
    const roles = decoded?.roles || []

    const handleSelect = async (role) => {
        try {
            const res = await api.post('/auth/select-role', { role })
            login(res.data.data.token)
            navigate(`/dashboard/${role.toLowerCase()}`)
        } catch {
            alert('Gagal memilih role.')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-white to-ocean-50 flex items-center justify-center px-4 py-10 relative">

            <div className="w-full max-w-lg">
                <div className="text-center mb-8 animate-fade-in">
                    <Link to="/" className="inline-flex items-center gap-3">
                        <img src="/logo.png" alt="SEAPEDIA" className="h-10 w-auto" />
                        <span className="text-3xl font-extrabold tracking-tight text-ocean-600">
                            SEA<span className="text-ocean-300">PEDIA</span>
                        </span>
                    </Link>
                </div>

                <div className="bg-white rounded-2xl border border-ocean-100 shadow-card p-6 sm:p-8 animate-slide-up">
                    <h1 className="text-2xl font-extrabold text-slate-800 mb-1 tracking-tight">Pilih Role</h1>
                    <p className="text-slate-400 text-sm mb-7">
                        Kamu punya beberapa role. Pilih yang ingin digunakan untuk sesi ini.
                    </p>

                    <div className="flex flex-col gap-3">
                        {roles.map((role, idx) => {
                            const info = roleInfo[role] || { label: role, desc: '', icon: <User size={20} strokeWidth={1.5} />, gradient: 'from-slate-100 to-slate-200', ring: 'ring-slate-400' }
                            return (
                                <button
                                    key={role}
                                    onClick={() => handleSelect(role)}
                                    className="w-full text-left border-2 border-slate-100 rounded-xl p-4 transition-all duration-200 hover:border-ocean-200 hover:shadow-card-hover group cursor-pointer animate-slide-up"
                                    style={{ animationDelay: `${idx * 80}ms` }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${info.gradient} flex items-center justify-center text-xl flex-shrink-0`}>
                                            {info.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-sm font-extrabold text-slate-800">{info.label}</span>
                                            </div>
                                            <p className="text-sm text-slate-500">{info.desc}</p>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-300 group-hover:text-ocean-500 transition flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

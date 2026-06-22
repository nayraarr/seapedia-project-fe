import {Link, useNavigate} from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'
import api from '../../services/api'

const roleInfo = {
    BUYER: {
        label: 'Pembeli',
        desc: 'Belanja produk, kelola cart dan pesanan',
        icon: '🛒',
        ring: 'border-blue-400',
        bg: 'hover:bg-blue-50',
        badge: 'bg-blue-100 text-blue-700',
    },
    SELLER: {
        label: 'Penjual',
        desc: 'Kelola toko, produk, dan pesanan masuk',
        icon: '🏪',
        ring: 'border-emerald-400',
        bg: 'hover:bg-emerald-50',
        badge: 'bg-emerald-100 text-emerald-700',
    },
    DRIVER: {
        label: 'Driver',
        desc: 'Ambil dan antar pesanan ke pembeli',
        icon: '🚗',
        ring: 'border-orange-400',
        bg: 'hover:bg-orange-50',
        badge: 'bg-orange-100 text-orange-700',
    },
    ADMIN: {
        label: 'Admin',
        desc: 'Monitor dan kelola seluruh platform',
        icon: '⚙️',
        ring: 'border-red-400',
        bg: 'hover:bg-red-50',
        badge: 'bg-red-100 text-red-700',
    },
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
        <div className="min-h-screen bg-[#F0F7FF] flex items-center justify-center px-4">
            <div className="w-full max-w-lg">
                <div className="text-center mb-8">
                    <Link to="/" className="text-2xl font-extrabold text-blue-600 tracking-tight">
                        SEA<span className="text-blue-300">PEDIA</span>
                    </Link>
                </div>

                <div className="bg-white rounded-2xl border border-blue-100 shadow-sm shadow-blue-100 p-8">
                    <h1 className="text-2xl font-bold text-slate-800 mb-1">Pilih Role</h1>
                    <p className="text-slate-400 text-sm mb-7">
                        Kamu punya beberapa role. Pilih yang ingin digunakan untuk sesi ini.
                    </p>

                    <div className="flex flex-col gap-3">
                        {roles.map(role => {
                            const info = roleInfo[role] || {
                                label: role,
                                desc: '',
                                icon: '👤',
                                ring: 'border-slate-300',
                                bg: 'hover:bg-slate-50',
                                badge: 'bg-slate-100 text-slate-600',
                            }
                            return (
                                <button
                                    key={role}
                                    onClick={() => handleSelect(role)}
                                    className={`w-full text-left border-2 rounded-xl p-4 transition ${info.ring} ${info.bg} group`}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl">{info.icon}</span>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${info.badge}`}>
                                                    {info.label}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500">{info.desc}</p>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
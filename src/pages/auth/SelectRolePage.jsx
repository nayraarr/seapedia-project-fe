import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

const roleInfo = {
    BUYER: { label: 'Pembeli', desc: 'Belanja produk, kelola cart dan pesanan', color: 'border-blue-400 hover:bg-blue-50', badge: 'bg-blue-100 text-blue-700' },
    SELLER: { label: 'Penjual', desc: 'Kelola toko, produk, dan pesanan masuk', color: 'border-green-400 hover:bg-green-50', badge: 'bg-green-100 text-green-700' },
    DRIVER: { label: 'Driver', desc: 'Ambil dan antar pesanan ke pembeli', color: 'border-orange-400 hover:bg-orange-50', badge: 'bg-orange-100 text-orange-700' },
    ADMIN: { label: 'Admin', desc: 'Monitor dan kelola seluruh platform', color: 'border-red-400 hover:bg-red-50', badge: 'bg-red-100 text-red-700' },
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 w-full max-w-lg">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Pilih Role</h1>
                <p className="text-gray-500 text-sm mb-8">
                    Kamu punya beberapa role. Pilih role yang ingin kamu gunakan untuk sesi ini.
                </p>

                <div className="flex flex-col gap-3">
                    {roles.map(role => {
                        const info = roleInfo[role] || { label: role, desc: '', color: 'border-gray-300', badge: 'bg-gray-100 text-gray-600' }
                        return (
                            <button
                                key={role}
                                onClick={() => handleSelect(role)}
                                className={`w-full text-left border-2 rounded-xl p-4 transition ${info.color}`}
                            >
                                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${info.badge}`}>
                    {info.label}
                  </span>
                                    <span className="text-sm text-gray-600">{info.desc}</span>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
import MainLayout from '../../../components/layout/MainLayout'
import { useAuth } from '../../../contexts/useAuth'

const cards = [
    { label: 'Monitor Users', icon: '👥', desc: 'Lihat dan kelola semua pengguna' },
    { label: 'Monitor Produk', icon: '📦', desc: 'Pantau seluruh produk platform' },
    { label: 'Monitor Pesanan', icon: '📊', desc: 'Lacak semua transaksi berjalan' },
]

export default function AdminDashboard() {
    const { decoded } = useAuth()
    return (
        <MainLayout>
            <div className="mb-8">
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Dashboard</span>
                <h1 className="text-3xl font-bold text-slate-800 mt-1">Halo, {decoded?.username}! 👋</h1>
                <p className="text-slate-400 mt-1">Selamat datang di dashboard Admin</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                {cards.map(card => (
                    <div key={card.label} className="bg-white border border-red-100 rounded-2xl p-6 hover:shadow-md hover:border-red-300 transition cursor-pointer">
                        <div className="text-3xl mb-3">{card.icon}</div>
                        <h3 className="font-semibold text-slate-700 mb-1">{card.label}</h3>
                        <p className="text-slate-400 text-sm">{card.desc}</p>
                        <span className="inline-block mt-3 text-xs font-semibold text-red-400 bg-red-50 px-2.5 py-1 rounded-full">
                            Segera hadir
                        </span>
                    </div>
                ))}
            </div>
        </MainLayout>
    )
}
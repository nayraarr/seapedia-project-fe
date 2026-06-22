import MainLayout from '../../../components/layout/MainLayout'
import { useAuth } from '../../../contexts/useAuth'

const cards = [
    { label: 'Wallet & Saldo', icon: '💳', desc: 'Kelola saldo dan top up' },
    { label: 'Keranjang', icon: '🛒', desc: 'Lihat item yang akan dibeli' },
    { label: 'Riwayat Pesanan', icon: '📦', desc: 'Lacak semua transaksimu' },
]

export default function BuyerDashboard() {
    const { decoded } = useAuth()
    return (
        <MainLayout>
            <div className="mb-8">
                <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Dashboard</span>
                <h1 className="text-3xl font-bold text-slate-800 mt-1">Halo, {decoded?.username}! 👋</h1>
                <p className="text-slate-400 mt-1">Selamat datang di dashboard Pembeli</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                {cards.map(card => (
                    <div key={card.label} className="bg-white border border-blue-100 rounded-2xl p-6 hover:shadow-md hover:border-blue-300 transition cursor-pointer">
                        <div className="text-3xl mb-3">{card.icon}</div>
                        <h3 className="font-semibold text-slate-700 mb-1">{card.label}</h3>
                        <p className="text-slate-400 text-sm">{card.desc}</p>
                        <span className="inline-block mt-3 text-xs font-semibold text-blue-400 bg-blue-50 px-2.5 py-1 rounded-full">
                            Segera hadir
                        </span>
                    </div>
                ))}
            </div>
        </MainLayout>
    )
}
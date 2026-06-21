import MainLayout from '../../../components/layout/MainLayout'
import { useAuth } from '../../../contexts/AuthContext'

export default function BuyerDashboard() {
    const { decoded } = useAuth()
    return (
        <MainLayout>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Pembeli</h1>
            <p className="text-gray-500">Selamat datang, {decoded?.username}!</p>
            <div className="mt-6 grid md:grid-cols-3 gap-4">
                {['Wallet & Saldo', 'Keranjang', 'Riwayat Pesanan'].map(item => (
                    <div key={item} className="bg-white border border-gray-200 rounded-xl p-4 text-gray-400 text-sm">
                        {item} — coming soon
                    </div>
                ))}
            </div>
        </MainLayout>
    )
}
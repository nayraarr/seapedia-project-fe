import MainLayout from '../../../components/layout/MainLayout'
import { useAuth } from '../../../contexts/useAuth'
import { Link } from 'react-router-dom'

const cards = [
    { label: 'Job Tersedia', icon: '📍', desc: 'Lihat pesanan yang bisa diambil', link: '/dashboard/driver/jobs' },
    { label: 'Job Aktif', icon: '🚗', desc: 'Pesanan yang sedang kamu antar', link: '/dashboard/driver/active' },
    { label: 'Riwayat & Penghasilan', icon: '💰', desc: 'Rekap penghasilan harian', link: '/dashboard/driver/report' },
]

export default function DriverDashboard() {
    const { decoded } = useAuth()
    return (
        <MainLayout>
            <div className="mb-8">
                <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Dashboard</span>
                <h1 className="text-3xl font-bold text-slate-800 mt-1">Halo, {decoded?.username}! 👋</h1>
                <p className="text-slate-400 mt-1">Selamat datang di dashboard Driver</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                {cards.map(card => {
                    const content = (
                        <>
                            <div className="text-3xl mb-3">{card.icon}</div>
                            <h3 className="font-semibold text-slate-700 mb-1">{card.label}</h3>
                            <p className="text-slate-400 text-sm">{card.desc}</p>
                            {card.link ? (
                                <span className="inline-block mt-3 text-xs font-semibold text-white bg-orange-500 px-2.5 py-1 rounded-full">
                                    Buka
                                </span>
                            ) : (
                                <span className="inline-block mt-3 text-xs font-semibold text-orange-500 bg-orange-50 px-2.5 py-1 rounded-full">
                                    Segera hadir
                                </span>
                            )}
                        </>
                    )

                    return card.link ? (
                        <Link
                            key={card.label}
                            to={card.link}
                            className="bg-white border border-orange-100 rounded-2xl p-6 hover:shadow-md hover:border-orange-300 transition cursor-pointer"
                        >
                            {content}
                        </Link>
                    ) : (
                        <div key={card.label} className="bg-white border border-orange-100 rounded-2xl p-6 hover:shadow-md hover:border-orange-300 transition cursor-pointer">
                            {content}
                        </div>
                    )
                })}
            </div>
        </MainLayout>
    )
}
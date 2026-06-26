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
            <div className="mb-8 animate-fade-in">
                <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Dashboard</span>
                <h1 className="text-3xl font-bold text-slate-800 mt-1">Halo, {decoded?.username}! 👋</h1>
                <p className="text-slate-400 mt-1">Selamat datang di dashboard Driver</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 animate-slide-up">
                {cards.map((card) => {
                    const content = (
                        <>
                            <div className="text-3xl mb-3">{card.icon}</div>
                            <h3 className="font-semibold text-slate-700 mb-1">{card.label}</h3>
                            <p className="text-slate-400 text-sm">{card.desc}</p>
                            {card.link ? (
                                <span className="badge-orange inline-block mt-3">
                                    Buka
                                </span>
                            ) : (
                                <span className="badge-orange inline-block mt-3">
                                    Segera hadir
                                </span>
                            )}
                        </>
                    )

                    return card.link ? (
                        <Link
                            key={card.label}
                            to={card.link}
                            className="card card-hover p-6 cursor-pointer"
                        >
                            {content}
                        </Link>
                    ) : (
                        <div key={card.label} className="card p-6">
                            {content}
                        </div>
                    )
                })}
            </div>
        </MainLayout>
    )
}

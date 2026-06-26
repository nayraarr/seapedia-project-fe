import { Link } from 'react-router-dom'

const roleData = [
    { label: 'Pembeli', icon: '🛍️', color: 'badge-blue' },
    { label: 'Penjual', icon: '🏪', color: 'badge-emerald' },
    { label: 'Driver',  icon: '🚚', color: 'badge-orange' },
    { label: 'Admin',   icon: '⚙️', color: 'badge-red' },
]

export default function Footer() {
    return (
        <footer className="bg-white border-t border-ocean-100 mt-16">
            <div className="wave-divider" />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
                    <div>
                        <Link to="/" className="text-2xl font-extrabold text-ocean-600 tracking-tight">
                            SEA<span className="text-ocean-300">PEDIA</span>
                        </Link>
                        <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                            Marketplace multi-role terpercaya. Temukan produk dari berbagai toko dalam satu platform.
                        </p>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-700 mb-3">Navigasi</p>
                        <div className="flex flex-col gap-2">
                            <Link to="/" className="text-sm text-slate-400 hover:text-ocean-600 transition">Beranda</Link>
                            <Link to="/products" className="text-sm text-slate-400 hover:text-ocean-600 transition">Produk</Link>
                            <Link to="/stores" className="text-sm text-slate-400 hover:text-ocean-600 transition">Toko</Link>
                            <Link to="/login" className="text-sm text-slate-400 hover:text-ocean-600 transition">Masuk</Link>
                            <Link to="/register" className="text-sm text-slate-400 hover:text-ocean-600 transition">Daftar</Link>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-700 mb-3">Role Tersedia</p>
                        <div className="flex flex-col gap-2">
                            {roleData.map(role => (
                                <span key={role.label} className={`inline-flex items-center gap-1.5 w-fit text-xs font-bold px-3 py-1 rounded-full ${role.color}`}>
                                    <span>{role.icon}</span>
                                    {role.label}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="border-t border-ocean-50 pt-6 text-center">
                    <p className="text-xs text-slate-300">
                        © {new Date().getFullYear()} SEAPEDIA. Seleksi SEA Compfest 18 — Zita Nayra Ardini.
                    </p>
                </div>
            </div>
        </footer>
    )
}
import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="bg-white border-t border-blue-100 mt-16">
            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <Link to="/" className="text-xl font-extrabold text-blue-600 tracking-tight">
                            SEA<span className="text-blue-300">PEDIA</span>
                        </Link>
                        <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                            Marketplace terpercaya. Temukan produk dari berbagai toko dalam satu platform.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <p className="text-sm font-bold text-slate-700 mb-3">Navigasi</p>
                        <div className="flex flex-col gap-2">
                            <Link to="/" className="text-sm text-slate-400 hover:text-blue-600 transition">Beranda</Link>
                            <Link to="/products" className="text-sm text-slate-400 hover:text-blue-600 transition">Produk</Link>
                            <Link to="/stores" className="text-sm text-slate-400 hover:text-blue-600 transition">Toko</Link>
                            <Link to="/login" className="text-sm text-slate-400 hover:text-blue-600 transition">Masuk</Link>
                            <Link to="/register" className="text-sm text-slate-400 hover:text-blue-600 transition">Daftar</Link>
                        </div>
                    </div>

                    {/* Info */}
                    <div>
                        <p className="text-sm font-bold text-slate-700 mb-3">Role Tersedia</p>
                        <div className="flex flex-col gap-2">
                            {[
                                { label: 'Pembeli', color: 'bg-blue-100 text-blue-700' },
                                { label: 'Penjual', color: 'bg-emerald-100 text-emerald-700' },
                                { label: 'Driver',  color: 'bg-orange-100 text-orange-700' },
                                { label: 'Admin',   color: 'bg-red-100 text-red-700' },
                            ].map(role => (
                                <span key={role.label} className={`inline-flex w-fit text-xs font-bold px-2.5 py-1 rounded-full ${role.color}`}>
                                    {role.label}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-blue-50 pt-6 text-center">
                    <p className="text-xs text-slate-300">
                        © {new Date().getFullYear()} SEAPEDIA. Seleksi SEA Compfest 18 - Zita Nayra Ardini.
                    </p>
                </div>
            </div>
        </footer>
    )
}
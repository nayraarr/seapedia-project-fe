import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'

export default function Navbar() {
    const { token, activeRole, decoded, logout } = useAuth()
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate('/')
        setMenuOpen(false)
    }

    const getDashboardLink = () => {
        if (!activeRole) return '/select-role'
        return `/dashboard/${activeRole.toLowerCase()}`
    }

    const roleBadge = {
        BUYER:  'bg-blue-100 text-blue-700',
        SELLER: 'bg-emerald-100 text-emerald-700',
        DRIVER: 'bg-orange-100 text-orange-700',
        ADMIN:  'bg-red-100 text-red-700',
    }

    return (
        <nav className="w-full bg-white border-b border-blue-100 px-6 sticky top-0 z-50 shadow-sm">
            <div className="max-w-6xl mx-auto w-full flex items-center justify-between h-[60px]">

                {/* Logo */}
                <Link to="/" className="text-xl font-extrabold tracking-tight text-blue-600">
                    SEA<span className="text-blue-300">PEDIA</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6 text-sm">
                    <Link to="/products" className="text-slate-500 hover:text-blue-600 font-medium transition">
                        Produk
                    </Link>

                    <Link to="/stores" className="text-slate-500 hover:text-blue-600 font-medium transition">
                        Toko
                    </Link>

                    <div className="w-px h-5 bg-blue-100" />

                    {!token ? (
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="border border-blue-200 text-blue-600 px-4 py-1.5 rounded-lg font-semibold hover:bg-blue-50 transition text-sm">
                                Masuk
                            </Link>
                            <Link to="/register" className="bg-blue-600 text-white px-4 py-1.5 rounded-lg font-semibold hover:bg-blue-700 transition text-sm">
                                Daftar
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            {activeRole && (
                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${roleBadge[activeRole] || 'bg-slate-100 text-slate-600'}`}>
                                    {activeRole}
                                </span>
                            )}
                            <Link to="/profile" className="text-blue-800 font-semibold text-sm hover:text-blue-600 transition">
                                {decoded?.username}
                            </Link>
                            <Link to={getDashboardLink()} className="text-slate-500 hover:text-blue-600 font-medium transition">
                                Dashboard
                            </Link>
                            {decoded?.roles?.length > 1 && (
                                <Link to="/select-role" className="text-slate-400 hover:text-blue-500 text-xs underline">
                                    Ganti Role
                                </Link>
                            )}
                            <div className="w-px h-5 bg-blue-100" />
                            <button onClick={handleLogout} className="text-red-400 hover:text-red-600 text-sm font-medium transition">
                                Keluar
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <button
                    className="md:hidden text-slate-500 hover:text-blue-600 transition"
                    onClick={() => setMenuOpen(prev => !prev)}
                >
                    {menuOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {menuOpen && (
                <div className="md:hidden bg-white border-t border-blue-50 px-6 py-4 flex flex-col gap-4">
                    <Link to="/products" onClick={() => setMenuOpen(false)} className="text-slate-600 font-medium text-sm hover:text-blue-600">
                        Produk
                    </Link>

                    <Link to="/stores" className="text-slate-500 hover:text-blue-600 font-medium transition">
                        Toko
                    </Link>

                    {!token ? (
                        <>
                            <Link to="/login" onClick={() => setMenuOpen(false)} className="text-slate-600 font-medium text-sm hover:text-blue-600">
                                Masuk
                            </Link>
                            <Link to="/register" onClick={() => setMenuOpen(false)} className="bg-blue-600 text-white text-center py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition">
                                Daftar
                            </Link>
                        </>
                    ) : (
                        <>
                            {activeRole && (
                                <span className={`w-fit text-xs font-bold px-3 py-1 rounded-full ${roleBadge[activeRole] || 'bg-slate-100 text-slate-600'}`}>
                                    {activeRole}
                                </span>
                            )}
                            <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-blue-800 font-semibold text-sm">
                                {decoded?.username}
                            </Link>
                            <Link to={getDashboardLink()} onClick={() => setMenuOpen(false)} className="text-slate-600 font-medium text-sm hover:text-blue-600">
                                Dashboard
                            </Link>
                            {decoded?.roles?.length > 1 && (
                                <Link to="/select-role" onClick={() => setMenuOpen(false)} className="text-slate-400 text-sm underline">
                                    Ganti Role
                                </Link>
                            )}
                            <button onClick={handleLogout} className="text-left text-red-400 font-medium text-sm hover:text-red-600">
                                Keluar
                            </button>
                        </>
                    )}
                </div>
            )}
        </nav>
    )
}
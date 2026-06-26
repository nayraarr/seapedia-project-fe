import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'
import { useCart } from '../../contexts/useCart'

export default function Navbar() {
    const { token, activeRole, decoded, logout } = useAuth()
    const { itemCount } = useCart()
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)

    const handleLogout = async () => {
        await logout()
        navigate('/')
        setMenuOpen(false)
    }

    const getDashboardLink = () => {
        if (!activeRole) return '/select-role'
        return `/dashboard/${activeRole.toLowerCase()}`
    }

    const roleStyle = {
        BUYER:  'bg-ocean-100 text-ocean-700 ring-1 ring-ocean-200',
        SELLER: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
        DRIVER: 'bg-orange-100 text-orange-600 ring-1 ring-orange-200',
        ADMIN:  'bg-red-100 text-red-600 ring-1 ring-red-200',
    }

    const roleIcon = {
        BUYER:  '🛍️',
        SELLER: '🏪',
        DRIVER: '🚚',
        ADMIN:  '⚙️',
    }

    const navLinks = token && activeRole ? [
        ...(activeRole === 'BUYER' ? [
            { to: '/dashboard/buyer/cart', label: 'Keranjang', badge: itemCount },
            { to: '/dashboard/buyer/orders', label: 'Pesanan' },
        ] : []),
        ...(activeRole === 'SELLER' ? [
            { to: '/dashboard/seller/orders/incoming', label: 'Pesanan Masuk' },
        ] : []),
        { to: getDashboardLink(), label: 'Dashboard' },
    ] : []

    return (
        <nav className="w-full bg-white/95 backdrop-blur-md border-b border-ocean-100 px-4 sm:px-6 sticky top-0 z-50 shadow-sm">
            <div className="max-w-6xl mx-auto w-full flex items-center justify-between h-16">
                <Link to="/" className="flex items-center gap-1.5 group">
                    <div className="w-8 h-8 rounded-lg ocean-gradient flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                        <span className="text-white font-extrabold text-sm">S</span>
                    </div>
                    <span className="text-xl font-extrabold tracking-tight text-ocean-600">
                        SEA<span className="text-ocean-300">PEDIA</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-1">
                    <Link to="/products" className="px-3 py-2 text-sm font-medium text-slate-500 hover:text-ocean-600 hover:bg-ocean-50 rounded-lg transition">
                        Produk
                    </Link>
                    <Link to="/stores" className="px-3 py-2 text-sm font-medium text-slate-500 hover:text-ocean-600 hover:bg-ocean-50 rounded-lg transition">
                        Toko
                    </Link>

                    {token ? (
                        <div className="flex items-center gap-2 ml-2">
                            {navLinks.map(link => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="relative px-3 py-2 text-sm font-medium text-slate-500 hover:text-ocean-600 hover:bg-ocean-50 rounded-lg transition"
                                >
                                    {link.label}
                                    {link.badge !== undefined && link.badge > 0 && (
                                        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1.5 rounded-full ocean-gradient text-white text-[10px] font-bold flex items-center justify-center animate-bounce-in">
                                            {link.badge}
                                        </span>
                                    )}
                                </Link>
                            ))}

                            <div className="h-6 w-px bg-ocean-100 mx-1" />

                            {activeRole && (
                                <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full ${roleStyle[activeRole]}`}>
                                    <span>{roleIcon[activeRole]}</span>
                                    {activeRole}
                                </span>
                            )}

                            <Link
                                to="/profile"
                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-ocean-600 hover:bg-ocean-50 rounded-lg transition"
                            >
                                <div className="w-6 h-6 rounded-full ocean-gradient flex items-center justify-center text-white text-[10px] font-bold">
                                    {decoded?.username?.charAt(0).toUpperCase()}
                                </div>
                                {decoded?.username}
                            </Link>

                            {decoded?.roles?.length > 1 && (
                                <Link to="/select-role" className="px-3 py-1 text-xs font-semibold text-ocean-600 border border-ocean-200 rounded-full hover:bg-ocean-50 hover:border-ocean-300 transition">
                                    Ganti Role
                                </Link>
                            )}

                            <button onClick={handleLogout} className="px-3 py-2 text-sm font-medium text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                                Keluar
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 ml-3">
                            <Link to="/login" className="px-4 py-2 text-sm font-semibold text-ocean-600 border-2 border-ocean-200 rounded-xl hover:bg-ocean-50 hover:border-ocean-300 transition">
                                Masuk
                            </Link>
                            <Link to="/register" className="px-4 py-2 text-sm font-semibold text-white ocean-gradient rounded-xl hover:shadow-md hover:shadow-ocean-200 transition">
                                Daftar
                            </Link>
                        </div>
                    )}
                </div>

                <button
                    className="md:hidden text-slate-500 hover:text-ocean-600 transition p-2 rounded-lg hover:bg-ocean-50"
                    onClick={() => setMenuOpen(prev => !prev)}
                    aria-label="Toggle menu"
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

            {menuOpen && (
                <div className="md:hidden border-t border-ocean-50 px-4 py-4 flex flex-col gap-1 animate-slide-down bg-white/95 backdrop-blur-md">
                    <MobileLink to="/products" onClick={() => setMenuOpen(false)}>Produk</MobileLink>
                    <MobileLink to="/stores" onClick={() => setMenuOpen(false)}>Toko</MobileLink>

                    {!token ? (
                        <>
                            <div className="h-px bg-ocean-50 my-2" />
                            <MobileLink to="/login" onClick={() => setMenuOpen(false)}>Masuk</MobileLink>
                            <Link
                                to="/register"
                                onClick={() => setMenuOpen(false)}
                                className="block text-center bg-ocean-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-ocean-700 transition mt-1"
                            >
                                Daftar
                            </Link>
                        </>
                    ) : (
                        <>
                            <div className="h-px bg-ocean-50 my-2" />
                            {activeRole && (
                                <div className="flex items-center gap-2 px-3 py-2">
                                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full ${roleStyle[activeRole]}`}>
                                        <span>{roleIcon[activeRole]}</span>
                                        {activeRole}
                                    </span>
                                    <span className="text-sm font-semibold text-slate-700">{decoded?.username}</span>
                                </div>
                            )}
                            {activeRole === 'BUYER' && (
                                <MobileLink to="/dashboard/buyer/cart" onClick={() => setMenuOpen(false)}>
                                    Keranjang {itemCount > 0 ? `(${itemCount})` : ''}
                                </MobileLink>
                            )}
                            {activeRole === 'BUYER' && (
                                <MobileLink to="/dashboard/buyer/orders" onClick={() => setMenuOpen(false)}>Pesanan</MobileLink>
                            )}
                            {activeRole === 'SELLER' && (
                                <MobileLink to="/dashboard/seller/orders/incoming" onClick={() => setMenuOpen(false)}>Pesanan Masuk</MobileLink>
                            )}
                            <MobileLink to={getDashboardLink()} onClick={() => setMenuOpen(false)}>Dashboard</MobileLink>
                            <MobileLink to="/profile" onClick={() => setMenuOpen(false)}>Profil</MobileLink>
                            {decoded?.roles?.length > 1 && (
                                <MobileLink to="/select-role" onClick={() => setMenuOpen(false)}>Ganti Role</MobileLink>
                            )}
                            <button onClick={handleLogout} className="block w-full text-left px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition mt-1">
                                Keluar
                            </button>
                        </>
                    )}
                </div>
            )}
        </nav>
    )
}

function MobileLink({ to, children, onClick }) {
    return (
        <Link
            to={to}
            onClick={onClick}
            className="block px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-ocean-600 hover:bg-ocean-50 rounded-lg transition"
        >
            {children}
        </Link>
    )
}

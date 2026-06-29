import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'
import { useCart } from '../../contexts/useCart'
import { ShoppingBag, Store, Truck, Settings, Search, Bell, MessageCircle, ChevronDown } from 'lucide-react'

export default function Navbar() {
    const { token, activeRole, decoded, logout } = useAuth()
    const { itemCount, notify } = useCart()
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
            setSearchQuery('')
        }
    }

    const handleLogout = async () => {
        await logout()
        navigate('/')
        setMenuOpen(false)
        setProfileOpen(false)
    }

    const getDashboardLink = () => {
        if (!activeRole) return '/select-role'
        return `/dashboard/${activeRole.toLowerCase()}`
    }

    const roleStyle = {
        BUYER:  'bg-ocean-100 text-ocean-700',
        SELLER: 'bg-emerald-100 text-emerald-700',
        DRIVER: 'bg-orange-100 text-orange-600',
        ADMIN:  'bg-red-100 text-red-600',
    }

    const roleIcon = {
        BUYER:  <ShoppingBag size={14} strokeWidth={1.5} />,
        SELLER: <Store size={14} strokeWidth={1.5} />,
        DRIVER: <Truck size={14} strokeWidth={1.5} />,
        ADMIN:  <Settings size={14} strokeWidth={1.5} />,
    }

    return (
        <>
            <div className="promo-strip">
                Free Ongkir &bull; Promo Spesial &bull; Belanja Aman di SEAPEDIA
            </div>

            <nav className="w-full bg-white border-b border-slate-200 px-4 sm:px-6 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto w-full flex items-center justify-between h-14 gap-4">
                    <Link to="/" className="flex items-center gap-1.5 group flex-shrink-0">
                        <img src="/logo.png" alt="SEAPEDIA" className="h-7 w-auto" />
                        <span className="text-lg font-extrabold tracking-tight text-ocean-600">
                            SEA<span className="text-ocean-400">PEDIA</span>
                        </span>
                    </Link>

                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg">
                        <div className="relative w-full">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" strokeWidth={2} />
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition"
                            />
                        </div>
                    </form>

                    <div className="hidden md:flex items-center gap-1">
                        <Link to="/products" className="px-3 py-2 text-sm font-medium text-slate-500 hover:text-ocean-600 rounded-lg transition">
                            Produk
                        </Link>
                        <Link to="/stores" className="px-3 py-2 text-sm font-medium text-slate-500 hover:text-ocean-600 rounded-lg transition">
                            Toko
                        </Link>

                        {token ? (
                            <div className="flex items-center gap-0.5 ml-1">
                                {activeRole === 'BUYER' && (
                                    <Link to="/dashboard/buyer/cart" className="relative p-2 text-slate-500 hover:text-ocean-600 hover:bg-slate-50 rounded-lg transition">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                        </svg>
                                        {itemCount > 0 && (
                                            <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                                                {itemCount}
                                            </span>
                                        )}
                                    </Link>
                                )}

                                <button
                                    onClick={() => notify('Fitur notifikasi sedang dikembangkan', 'info')}
                                    className="relative p-2 text-slate-500 hover:text-ocean-600 hover:bg-slate-50 rounded-lg transition"
                                >
                                    <Bell size={20} strokeWidth={1.5} />
                                </button>

                                <button
                                    onClick={() => notify('Fitur chat sedang dikembangkan', 'info')}
                                    className="relative p-2 text-slate-500 hover:text-ocean-600 hover:bg-slate-50 rounded-lg transition"
                                >
                                    <MessageCircle size={20} strokeWidth={1.5} />
                                </button>

                                <div className="relative">
                                    <button
                                        onClick={() => setProfileOpen(prev => !prev)}
                                        className="flex items-center gap-1.5 ml-1 pl-2 pr-1.5 py-1.5 rounded-lg hover:bg-slate-50 transition"
                                    >
                                        <div className="w-7 h-7 rounded-full ocean-gradient flex items-center justify-center text-white text-[11px] font-bold">
                                            {(decoded?.fullName || decoded?.username || '')?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700 max-w-[120px] truncate">{decoded?.fullName || decoded?.username}</span>
                                        <ChevronDown size={14} className="text-slate-400" strokeWidth={2} />
                                    </button>

                                    {profileOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                                            <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-lg border border-slate-200 shadow-elevated z-50 py-1 animate-fade-in">
                                                {activeRole && (
                                                    <div className="px-3 py-2 border-b border-slate-100">
                                                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded ${roleStyle[activeRole]}`}>
                                                            {roleIcon[activeRole]}
                                                            {activeRole}
                                                        </span>
                                                    </div>
                                                )}
                                                <Link to="/profile" onClick={() => setProfileOpen(false)} className="block px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-ocean-600 transition">
                                                    Profil Saya
                                                </Link>
                                                <Link to={getDashboardLink()} onClick={() => setProfileOpen(false)} className="block px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-ocean-600 transition">
                                                    Dashboard
                                                </Link>
                                                {decoded?.roles?.length > 1 && (
                                                    <Link to="/select-role" onClick={() => setProfileOpen(false)} className="block px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-ocean-600 transition">
                                                        Ganti Role
                                                    </Link>
                                                )}
                                                <div className="border-t border-slate-100 mt-1 pt-1">
                                                    <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition">
                                                        Keluar
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 ml-3">
                                <Link to="/login" className="px-4 py-2 text-sm font-semibold text-ocean-600 border border-ocean-300 rounded-lg hover:bg-ocean-50 transition">
                                    Masuk
                                </Link>
                                <Link to="/register" className="px-4 py-2 text-sm font-semibold text-white ocean-gradient rounded-lg hover:shadow-md transition">
                                    Daftar
                                </Link>
                            </div>
                        )}
                    </div>

                    <button
                        className="md:hidden text-slate-500 hover:text-ocean-600 transition p-2 rounded-lg hover:bg-slate-50"
                        onClick={() => setMenuOpen(prev => !prev)}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        )}
                    </button>
                </div>

                <form onSubmit={handleSearch} className="md:hidden px-0 pb-3">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" strokeWidth={2} />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition"
                        />
                    </div>
                </form>

                {menuOpen && (
                    <div className="md:hidden border-t border-slate-100 px-0 pb-4 flex flex-col gap-1 animate-slide-down bg-white">
                        <MobileLink to="/products" onClick={() => setMenuOpen(false)}>Produk</MobileLink>
                        <MobileLink to="/stores" onClick={() => setMenuOpen(false)}>Toko</MobileLink>

                        {!token ? (
                            <>
                                <div className="h-px bg-slate-100 my-2" />
                                <MobileLink to="/login" onClick={() => setMenuOpen(false)}>Masuk</MobileLink>
                                <Link
                                    to="/register"
                                    onClick={() => setMenuOpen(false)}
                                    className="block text-center bg-ocean-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-ocean-700 transition mt-1"
                                >
                                    Daftar
                                </Link>
                            </>
                        ) : (
                            <>
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

                                <div className="h-px bg-slate-100 my-2" />

                                <Link
                                    to="/profile"
                                    onClick={() => setMenuOpen(false)}
                                    className="block px-3 py-2 rounded-lg hover:bg-slate-50 transition"
                                >
                                    {activeRole && (
                                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded mb-2 ${roleStyle[activeRole]}`}>
                                            {roleIcon[activeRole]}
                                            {activeRole}
                                        </span>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full ocean-gradient flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                                            {(decoded?.fullName || decoded?.username || '')?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700">{decoded?.fullName || decoded?.username}</span>
                                    </div>
                                </Link>

                                {decoded?.roles?.length > 1 && (
                                    <MobileLink to="/select-role" onClick={() => setMenuOpen(false)}>Ganti Role</MobileLink>
                                )}
                                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition mt-1">
                                    Keluar
                                </button>
                            </>
                        )}
                    </div>
                )}
            </nav>
        </>
    )
}

function MobileLink({ to, children, onClick }) {
    return (
        <Link
            to={to}
            onClick={onClick}
            className="block px-3 py-2 text-sm font-medium text-slate-600 hover:text-ocean-600 hover:bg-slate-50 rounded-lg transition"
        >
            {children}
        </Link>
    )
}

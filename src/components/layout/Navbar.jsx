import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Navbar() {
    const { token, activeRole, decoded, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const getDashboardLink = () => {
        if (!activeRole) return '/select-role'
        return `/dashboard/${activeRole.toLowerCase()}`
    }

    const roleColor = {
        BUYER: 'bg-blue-100 text-blue-700',
        SELLER: 'bg-green-100 text-green-700',
        DRIVER: 'bg-orange-100 text-orange-700',
        ADMIN: 'bg-red-100 text-red-700',
    }

    return (
        <nav className="w-full bg-white border-b border-gray-200 px-6 py-3">
            <div className="max-w-6xl mx-auto flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="text-xl font-bold text-blue-600">
                    SEAPEDIA
                </Link>

                {/* Nav Links */}
                <div className="flex items-center gap-6 text-sm">
                    <Link to="/products" className="text-gray-600 hover:text-blue-600">
                        Produk
                    </Link>

                    {!token ? (
                        // GUEST
                        <div className="flex items-center gap-3">
                            <Link
                                to="/login"
                                className="text-gray-600 hover:text-blue-600"
                            >
                                Masuk
                            </Link>
                            <Link
                                to="/register"
                                className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition"
                            >
                                Daftar
                            </Link>
                        </div>
                    ) : (
                        // LOGGED IN
                        <div className="flex items-center gap-4">
                            {/* Active Role Badge */}
                            {activeRole && (
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${roleColor[activeRole] || 'bg-gray-100 text-gray-600'}`}>
                  {activeRole}
                </span>
                            )}

                            {/* Username */}
                            <span className="text-gray-700 font-medium">
                {decoded?.username}
              </span>

                            {/* Dashboard Link */}
                            <Link
                                to={getDashboardLink()}
                                className="text-gray-600 hover:text-blue-600"
                            >
                                Dashboard
                            </Link>

                            {/* Switch Role — hanya kalau punya lebih dari 1 role */}
                            {decoded?.roles?.length > 1 && (
                                <Link
                                    to="/select-role"
                                    className="text-gray-500 hover:text-blue-600 text-xs underline"
                                >
                                    Ganti Role
                                </Link>
                            )}

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="text-red-500 hover:text-red-700 text-sm"
                            >
                                Keluar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
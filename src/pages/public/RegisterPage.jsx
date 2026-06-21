import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

const ROLES = ['BUYER', 'SELLER', 'DRIVER']

export default function RegisterPage() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ username: '', email: '', password: '', roles: [] })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const toggleRole = (role) => {
        setForm(prev => ({
            ...prev,
            roles: prev.roles.includes(role)
                ? prev.roles.filter(r => r !== role)
                : [...prev.roles, role]
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (form.roles.length === 0) {
            setError('Pilih minimal satu role.')
            return
        }

        setLoading(true)
        try {
            const res = await api.post('/auth/register', form)
            const data = res.data.data

            login(data.token)

            if (data.requiresRoleSelection) {
                navigate('/select-role')
            } else {
                navigate(`/dashboard/${data.activeRole.toLowerCase()}`)
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registrasi gagal.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 w-full max-w-md">
                <Link to="/" className="text-blue-600 font-bold text-xl block mb-8">SEAPEDIA</Link>

                <h1 className="text-2xl font-bold text-gray-800 mb-2">Daftar</h1>
                <p className="text-gray-500 text-sm mb-6">Sudah punya akun?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">Masuk</Link>
                </p>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Username</label>
                        <input
                            type="text"
                            value={form.username}
                            onChange={e => setForm({ ...form, username: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="username kamu"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="email@kamu.com"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="min. 6 karakter"
                        />
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">
                            Pilih Role <span className="text-gray-400 font-normal">(boleh lebih dari satu)</span>
                        </label>
                        <div className="flex gap-3">
                            {ROLES.map(role => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => toggleRole(role)}
                                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition ${
                                        form.roles.includes(role)
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                                    }`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 mt-2"
                    >
                        {loading ? 'Memproses...' : 'Daftar'}
                    </button>
                </form>
            </div>
        </div>
    )
}
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'
import api from '../../services/api'

export default function LoginPage() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ username: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const res = await api.post('/auth/login', form)
            const data = res.data.data
            login(data.token)
            if (data.requiresRoleSelection) {
                navigate('/select-role')
            } else {
                navigate(`/dashboard/${data.activeRole.toLowerCase()}`)
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login gagal.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F0F7FF] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="text-2xl font-extrabold text-blue-600 tracking-tight">
                        SEA<span className="text-blue-300">PEDIA</span>
                    </Link>
                </div>

                <div className="bg-white rounded-2xl border border-blue-100 shadow-sm shadow-blue-100 p-8">
                    <h1 className="text-2xl font-bold text-slate-800 mb-1">Selamat datang kembali</h1>
                    <p className="text-slate-400 text-sm mb-7">
                        Belum punya akun?{' '}
                        <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                            Daftar sekarang
                        </Link>
                    </p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-5">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div>
                            <label className="text-sm font-semibold text-slate-600 block mb-1.5">Username</label>
                            <input
                                type="text"
                                value={form.username}
                                onChange={e => setForm({ ...form, username: e.target.value })}
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition"
                                placeholder="Masukkan username"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-600 block mb-1.5">Password</label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold disabled:opacity-50 mt-1"
                        >
                            {loading ? 'Memproses...' : 'Masuk'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'
import api from '../../services/api'

const ROLES = [
    { key: 'BUYER',  label: 'Pembeli',  desc: 'Belanja produk', color: 'blue' },
    { key: 'SELLER', label: 'Penjual',  desc: 'Jual produk',    color: 'emerald' },
    { key: 'DRIVER', label: 'Driver',   desc: 'Antar pesanan',  color: 'orange' },
]

const activeClass = {
    blue:    'bg-blue-600 text-white border-blue-600',
    emerald: 'bg-emerald-500 text-white border-emerald-500',
    orange:  'bg-orange-500 text-white border-orange-500',
}
const inactiveClass = 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'

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
                : [...prev.roles, role],
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
        <div className="min-h-screen bg-[#F0F7FF] flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="text-2xl font-extrabold text-blue-600 tracking-tight">
                        SEA<span className="text-blue-300">PEDIA</span>
                    </Link>
                </div>

                <div className="bg-white rounded-2xl border border-blue-100 shadow-sm shadow-blue-100 p-8">
                    <h1 className="text-2xl font-bold text-slate-800 mb-1">Buat akun baru</h1>
                    <p className="text-slate-400 text-sm mb-7">
                        Sudah punya akun?{' '}
                        <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                            Masuk
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
                                placeholder="username kamu"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-600 block mb-1.5">Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition"
                                placeholder="email@kamu.com"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-600 block mb-1.5">Password</label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition"
                                placeholder="min. 6 karakter"
                            />
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label className="text-sm font-semibold text-slate-600 block mb-2">
                                Pilih Role{' '}
                                <span className="text-slate-400 font-normal">(boleh lebih dari satu)</span>
                            </label>
                            <div className="flex gap-3">
                                {ROLES.map(role => (
                                    <button
                                        key={role.key}
                                        type="button"
                                        onClick={() => toggleRole(role.key)}
                                        className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition ${
                                            form.roles.includes(role.key)
                                                ? activeClass[role.color]
                                                : inactiveClass
                                        }`}
                                    >
                                        <div>{role.label}</div>
                                        <div className="text-xs font-normal opacity-75 mt-0.5">{role.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold disabled:opacity-50 mt-1"
                        >
                            {loading ? 'Memproses...' : 'Daftar'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
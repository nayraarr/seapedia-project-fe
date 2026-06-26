import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'
import api from '../../services/api'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

const ROLES = [
    { key: 'BUYER',  label: 'Pembeli', desc: 'Belanja produk',  gradient: 'from-ocean-100 to-ocean-200', activeRing: 'ring-ocean-500' },
    { key: 'SELLER', label: 'Penjual', desc: 'Jual produk',     gradient: 'from-emerald-100 to-emerald-200', activeRing: 'ring-emerald-500' },
    { key: 'DRIVER', label: 'Driver',  desc: 'Antar pesanan',   gradient: 'from-orange-100 to-amber-200', activeRing: 'ring-orange-500' },
]

export default function RegisterPage() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ username: '', email: '', password: '', roles: [] })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

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
        <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-white to-ocean-50 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">
                <div className="text-center mb-8 animate-fade-in">
                    <Link to="/" className="inline-flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl ocean-gradient flex items-center justify-center shadow-md">
                            <span className="text-white font-extrabold text-lg">S</span>
                        </div>
                        <span className="text-3xl font-extrabold tracking-tight text-ocean-600">
                            SEA<span className="text-ocean-300">PEDIA</span>
                        </span>
                    </Link>
                </div>

                <div className="bg-white rounded-2xl border border-ocean-100 shadow-card p-6 sm:p-8 animate-slide-up">
                    <h1 className="text-2xl font-extrabold text-slate-800 mb-1 tracking-tight">Buat akun baru</h1>
                    <p className="text-slate-400 text-sm mb-7">
                        Sudah punya akun?{' '}
                        <Link to="/login" className="text-ocean-600 font-semibold hover:underline">Masuk</Link>
                    </p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-5 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.29 3.86l-8.2 14A2 2 0 003.82 21h16.36a2 2 0 001.73-3.14l-8.2-14a2 2 0 00-3.42 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <Input
                            label="Username"
                            value={form.username}
                            onChange={e => setForm({ ...form, username: e.target.value })}
                            placeholder="username kamu"
                        />
                        <Input
                            label="Email"
                            type="email"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            placeholder="email@kamu.com"
                        />
                        <Input
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            placeholder="min. 6 karakter"
                            rightElement={(
                                <button type="button" onClick={() => setShowPassword(p => !p)} className="text-slate-400 hover:text-ocean-500 transition cursor-pointer">
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            )}
                        />

                        <div>
                            <label className="text-sm font-semibold text-slate-700 block mb-3">
                                Pilih Role <span className="text-slate-400 font-normal">(boleh lebih dari satu)</span>
                            </label>
                            <div className="flex gap-3">
                                {ROLES.map(role => {
                                    const active = form.roles.includes(role.key)
                                    return (
                                        <button
                                            key={role.key}
                                            type="button"
                                            onClick={() => toggleRole(role.key)}
                                            className={`flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200 cursor-pointer ${
                                                active
                                                    ? `bg-gradient-to-br ${role.gradient} border-transparent ring-2 ${role.activeRing} shadow-sm`
                                                    : 'bg-white text-slate-600 border-slate-200 hover:border-ocean-300 hover:bg-ocean-50'
                                            }`}
                                        >
                                            <div className={active ? 'text-slate-800' : ''}>{role.label}</div>
                                            <div className="text-xs font-normal opacity-70 mt-0.5">{role.desc}</div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <Button type="submit" disabled={loading} fullWidth>
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Memproses...
                                </span>
                            ) : 'Daftar'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

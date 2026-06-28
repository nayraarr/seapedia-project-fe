import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'
import api from '../../services/api'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function LoginPage() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ username: '', password: '' })
    const [error, setError] = useState('')
    const [fieldErrors, setFieldErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (fieldErrors[field]) {
            setFieldErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const validate = () => {
        const errors = {}
        if (!form.username.trim()) errors.username = 'Username tidak boleh kosong'
        if (!form.password.trim()) errors.password = 'Password tidak boleh kosong'
        return errors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setFieldErrors({})

        const clientErrors = validate()
        if (Object.keys(clientErrors).length > 0) {
            setFieldErrors(clientErrors)
            return
        }

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
            const data = err.response?.data
            if (data?.fieldErrors && Object.keys(data.fieldErrors).length > 0) {
                setFieldErrors(data.fieldErrors)
            } else {
                setError(data?.message || 'Login gagal.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-white to-ocean-50 flex items-center justify-center px-4 py-10 relative">

            <div className="w-full max-w-md">
                <div className="text-center mb-8 animate-fade-in">
                    <Link to="/" className="inline-flex items-center gap-3">
                        <img src="/logo.png" alt="SEAPEDIA" className="h-10 w-auto" />
                        <span className="text-3xl font-extrabold tracking-tight text-ocean-600">
                            SEA<span className="text-ocean-300">PEDIA</span>
                        </span>
                    </Link>
                </div>

                <div className="bg-white rounded-2xl border border-ocean-100 shadow-card p-6 sm:p-8 animate-slide-up">
                    <h1 className="text-2xl font-extrabold text-slate-800 mb-1 tracking-tight">Selamat datang kembali</h1>
                    <p className="text-slate-400 text-sm mb-7">
                        Belum punya akun?{' '}
                        <Link to="/register" className="text-ocean-600 font-semibold hover:underline">Daftar sekarang</Link>
                    </p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-5 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <Input
                            label="Username"
                            value={form.username}
                            onChange={e => handleChange('username', e.target.value)}
                            placeholder="Masukkan username"
                            error={fieldErrors.username}
                        />
                        <Input
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={form.password}
                            onChange={e => handleChange('password', e.target.value)}
                            placeholder="••••••••"
                            error={fieldErrors.password}
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
                        <Button type="submit" disabled={loading} fullWidth>
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Memproses...
                                </span>
                            ) : 'Masuk'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

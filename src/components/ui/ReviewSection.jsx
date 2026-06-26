import { useEffect, useState, useCallback } from 'react'
import api from '../../services/api'
import Button from './Button'
import Input from './Input'

const STAR = '★'

export default function ReviewSection() {
    const [reviews, setReviews] = useState([])
    const [form, setForm] = useState({ reviewerName: '', rating: 5, comment: '' })
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const fetchReviews = useCallback(() => {
        api.get('/reviews')
            .then(res => setReviews(res.data.data || []))
            .catch(() => {})
    }, [])

    useEffect(() => { fetchReviews() }, [fetchReviews])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        if (!form.reviewerName.trim() || !form.comment.trim()) {
            setError('Nama dan komentar wajib diisi.')
            return
        }
        setSubmitting(true)
        try {
            await api.post('/reviews', form)
            setSuccess('Review berhasil dikirim!')
            setForm({ reviewerName: '', rating: 5, comment: '' })
            fetchReviews()
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal mengirim review.')
        } finally {
            setSubmitting(false)
        }
    }

    const renderStars = (rating) =>
        [...Array(5)].map((_, i) => (
            <span key={i} className={i < rating ? 'text-amber-400' : 'text-slate-200'} style={{ fontSize: 16 }}>
                {STAR}
            </span>
        ))

    return (
        <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-8 rounded-full ocean-gradient" />
                <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Ulasan Pengguna</h2>
            </div>

            {reviews.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4 mb-10">
                    {reviews.map((review, idx) => (
                        <div key={review.id} className="card-hover p-5 animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full ocean-gradient flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                        {review.reviewerName?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <span className="font-semibold text-slate-800 text-sm">{review.reviewerName}</span>
                                        <p className="text-slate-400 text-xs mt-0.5">
                                            {new Date(review.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex">{renderStars(review.rating)}</div>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="ocean-gradient-subtle rounded-2xl p-12 text-center mb-8 border border-ocean-100">
                    <div className="w-16 h-16 rounded-full bg-ocean-100 flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-ocean-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <p className="text-ocean-700 font-semibold">Belum ada ulasan. Jadilah yang pertama!</p>
                </div>
            )}

            <div className="card p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-ocean-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Tulis Ulasan
                </h3>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-4 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl px-4 py-3 text-sm mb-4 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        placeholder="Nama kamu"
                        value={form.reviewerName}
                        onChange={e => setForm({ ...form, reviewerName: e.target.value })}
                    />

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-600">Rating:</span>
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setForm({ ...form, rating: star })}
                                className={`text-2xl transition-all duration-150 hover:scale-110 ${
                                    star <= form.rating ? 'text-amber-400 scale-100' : 'text-slate-200 hover:text-amber-300'
                                }`}
                            >
                                {STAR}
                            </button>
                        ))}
                    </div>

                    <textarea
                        placeholder="Ceritakan pengalamanmu menggunakan SEAPEDIA..."
                        value={form.comment}
                        onChange={e => setForm({ ...form, comment: e.target.value })}
                        rows={3}
                        className="input-field resize-none min-h-[100px]"
                    />

                    <Button type="submit" disabled={submitting} fullWidth>
                        {submitting ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Mengirim...
                            </span>
                        ) : 'Kirim Ulasan'}
                    </Button>
                </form>
            </div>
        </section>
    )
}

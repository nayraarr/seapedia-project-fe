import { useEffect, useState, useCallback } from 'react'
import api from '../../services/api'

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

    useEffect(() => {
        fetchReviews()
    }, [fetchReviews])

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
            <span key={i} className={i < rating ? 'text-yellow-400' : 'text-slate-200'} style={{ fontSize: 16 }}>
                {STAR}
            </span>
        ))

    return (
        <section className="mb-16">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Ulasan Pengguna</h2>

            {reviews.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4 mb-10">
                    {reviews.map(review => (
                        <div key={review.id} className="bg-white border border-blue-100 rounded-2xl p-5">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                                        {review.reviewerName?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-semibold text-slate-800 text-sm">{review.reviewerName}</span>
                                </div>
                                <div className="flex">{renderStars(review.rating)}</div>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed">{review.comment}</p>
                            <p className="text-slate-300 text-xs mt-3">
                                {new Date(review.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-blue-50 rounded-2xl p-8 text-center mb-8">
                    <p className="text-blue-400 font-medium">Belum ada ulasan. Jadilah yang pertama!</p>
                </div>
            )}

            <div className="bg-white border border-blue-100 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-5">Tulis Ulasan</h3>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-4">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl px-4 py-3 text-sm mb-4">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Nama kamu"
                        value={form.reviewerName}
                        onChange={e => setForm({ ...form, reviewerName: e.target.value })}
                        className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition"
                    />

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">Rating:</span>
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setForm({ ...form, rating: star })}
                                className={`text-2xl transition ${star <= form.rating ? 'text-yellow-400' : 'text-slate-200 hover:text-yellow-300'}`}
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
                        className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition resize-none"
                    />

                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition font-semibold disabled:opacity-50"
                    >
                        {submitting ? 'Mengirim...' : 'Kirim Ulasan'}
                    </button>
                </form>
            </div>
        </section>
    )
}
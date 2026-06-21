import { useEffect, useState } from 'react'
import api from '../../services/api'

const STAR = '★'
const EMPTY_STAR = '☆'

export default function ReviewSection() {
    const [reviews, setReviews] = useState([])
    const [form, setForm] = useState({ reviewerName: '', rating: 5, comment: '' })
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        fetchReviews()
    }, [])

    const fetchReviews = () => {
        api.get('/reviews')
            .then(res => setReviews(res.data.data || []))
            .catch(() => {})
    }

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
            <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        {i < rating ? STAR : EMPTY_STAR}
      </span>
        ))

    return (
        <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Ulasan Pengguna</h2>

            {/* Review List */}
            {reviews.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4 mb-10">
                    {reviews.map(review => (
                        <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-gray-800">{review.reviewerName}</span>
                                <div className="flex">{renderStars(review.rating)}</div>
                            </div>
                            <p className="text-gray-600 text-sm">{review.comment}</p>
                            <p className="text-gray-400 text-xs mt-2">
                                {new Date(review.createdAt).toLocaleDateString('id-ID')}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400 mb-8">Belum ada ulasan. Jadilah yang pertama!</p>
            )}

            {/* Review Form */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Tulis Ulasan</h3>

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                {success && <p className="text-green-500 text-sm mb-3">{success}</p>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Nama kamu"
                        value={form.reviewerName}
                        onChange={e => setForm({ ...form, reviewerName: e.target.value })}
                        className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    {/* Star Rating Picker */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Rating:</span>
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setForm({ ...form, rating: star })}
                                className={`text-2xl ${star <= form.rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition`}
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
                        className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    />

                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {submitting ? 'Mengirim...' : 'Kirim Ulasan'}
                    </button>
                </form>
            </div>
        </section>
    )
}
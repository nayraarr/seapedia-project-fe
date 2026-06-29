import { useEffect, useState } from 'react'
import { Star, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react'
import { getAppReviews, createAppReview } from '../../services/appReviewApi'
import { useAuth } from '../../contexts/useAuth'
import { useCart } from '../../contexts/useCart'
import Button from './Button'

const MAX_VISIBLE_CHARS = 120

export default function AppReviewSection() {
    const { decoded } = useAuth()
    const { notify } = useCart()
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [formOpen, setFormOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [scrollIdx, setScrollIdx] = useState(0)
    const [expandedIds, setExpandedIds] = useState(new Set())

    const [form, setForm] = useState({ rating: 5, comment: '', name: '' })
    const [errors, setErrors] = useState({})

    useEffect(() => {
        getAppReviews()
            .then(res => setReviews(res.data.data || []))
            .catch(() => setReviews([]))
            .finally(() => setLoading(false))
    }, [])

    const handleToggleForm = () => {
        setFormOpen(prev => !prev)
        setErrors({})
        if (!formOpen) {
            setForm({ rating: 5, comment: '', name: '' })
        }
    }

    const handleCloseForm = () => {
        setFormOpen(false)
        setErrors({})
        setForm({ rating: 5, comment: '', name: '' })
    }

    const validate = () => {
        const errs = {}
        if (form.rating < 1) errs.rating = 'Pilih rating terlebih dahulu'
        if (!decoded && !form.name.trim()) errs.name = 'Nama tidak boleh kosong'
        if (!form.comment.trim()) errs.comment = 'Ulasan tidak boleh kosong'
        return errs
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errs = validate()
        setErrors(errs)
        if (Object.keys(errs).length > 0) return

        setSubmitting(true)
        try {
            const payload = { rating: form.rating, comment: form.comment.trim() }
            if (!decoded) {
                payload.reviewerName = form.name.trim()
            }
            const res = await createAppReview(payload)
            setReviews(prev => [res.data.data, ...prev])
            notify('Ulasan berhasil dikirim!', 'success', 'Ulasan')
            handleCloseForm()
        } catch {
            notify('Gagal mengirim ulasan. Silakan coba lagi.', 'error', 'Ulasan')
        } finally {
            setSubmitting(false)
        }
    }

    const scroll = (dir) => {
        const container = document.getElementById('app-review-scroll')
        if (!container) return
        const cardW = 280
        const maxIdx = Math.max(0, reviews.length - Math.floor(container.clientWidth / cardW))
        setScrollIdx(prev => {
            const next = dir === 'left' ? prev - 1 : prev + 1
            return Math.max(0, Math.min(next, maxIdx))
        })
    }

    const toggleExpand = (id) => {
        setExpandedIds(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id); else next.add(id)
            return next
        })
    }

    const truncate = (text) =>
        text.length > MAX_VISIBLE_CHARS ? text.slice(0, MAX_VISIBLE_CHARS) + '...' : text

    const renderStars = (rating, interactive = false) =>
        [1, 2, 3, 4, 5].map(star => (
            <button
                key={star}
                type={interactive ? 'button' : undefined}
                onClick={interactive ? () => setForm({ ...form, rating: star }) : undefined}
                className={`transition-all ${interactive ? 'hover:scale-110' : ''} ${
                    star <= rating ? 'text-amber-400' : 'text-slate-300'
                }`}
            >
                <Star
                    size={interactive ? 22 : 14}
                    strokeWidth={1.5}
                    className={star <= rating ? 'fill-amber-400' : 'fill-none'}
                />
            </button>
        ))

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

    if (loading) {
        return (
            <section className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="skeleton h-6 w-64" />
                    <div className="skeleton h-9 w-28 rounded-lg" />
                </div>
                <div className="flex gap-3 overflow-hidden">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="skeleton h-44 w-[260px] shrink-0 rounded-lg" />
                    ))}
                </div>
            </section>
        )
    }

    return (
        <section className="mb-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <MessageSquare size={18} className="text-ocean-600" strokeWidth={2} />
                    <h2 className="text-sm font-bold text-slate-800">Apa Kata Pengguna SEAPEDIA</h2>
                </div>
                <Button
                    variant={formOpen ? 'ghost' : 'primary'}
                    size="sm"
                    onClick={handleToggleForm}
                >
                    {formOpen ? 'Batal' : 'Tulis Ulasan'}
                </Button>
            </div>

            {formOpen && (
                <div className="mb-5 rounded-lg border border-ocean-200 bg-ocean-50 p-4 animate-slide-up">
                    <h3 className="text-sm font-bold text-slate-700 mb-3">Tulis Ulasan Baru</h3>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        {!decoded && (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Nama kamu"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className={`input-field text-sm ${errors.name ? 'input-error' : ''}`}
                                />
                                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                            </div>
                        )}
                        <div>
                            <p className="text-xs font-medium text-slate-600 mb-1.5">Rating</p>
                            <div className="flex gap-1">{renderStars(form.rating, true)}</div>
                            {errors.rating && <p className="text-xs text-red-500 mt-1">{errors.rating}</p>}
                        </div>
                        <div>
                            <textarea
                                placeholder="Ceritakan pengalamanmu menggunakan SEAPEDIA..."
                                value={form.comment}
                                onChange={e => setForm({ ...form, comment: e.target.value })}
                                rows={3}
                                className={`input-field resize-none min-h-[80px] text-sm ${errors.comment ? 'input-error' : ''}`}
                            />
                            {errors.comment && <p className="text-xs text-red-500 mt-1">{errors.comment}</p>}
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" size="sm" disabled={submitting}>
                                {submitting ? 'Mengirim...' : 'Kirim Ulasan'}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {reviews.length === 0 ? (
                <div className="rounded-lg border border-slate-200 p-10 text-center">
                    <div className="w-12 h-12 rounded-full bg-ocean-50 flex items-center justify-center mx-auto mb-3">
                        <MessageSquare size={22} className="text-ocean-400" strokeWidth={1.5} />
                    </div>
                    <p className="text-sm font-semibold text-slate-600">Belum ada ulasan, jadi yang pertama!</p>
                </div>
            ) : (
                <div className="relative">
                    {reviews.length > 3 && (
                        <>
                            <button
                                onClick={() => scroll('left')}
                                disabled={scrollIdx === 0}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-3 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center z-10 disabled:opacity-30 disabled:cursor-not-allowed transition hover:shadow-lg"
                            >
                                <ChevronLeft size={16} className="text-slate-600" strokeWidth={2} />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                disabled={scrollIdx >= Math.max(0, reviews.length - Math.floor(window.innerWidth > 768 ? 3 : 1))}
                                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-3 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center z-10 disabled:opacity-30 disabled:cursor-not-allowed transition hover:shadow-lg"
                            >
                                <ChevronRight size={16} className="text-slate-600" strokeWidth={2} />
                            </button>
                        </>
                    )}
                    <div
                        id="app-review-scroll"
                        className="flex gap-3 overflow-x-auto scrollbar-thin pb-1 snap-x snap-mandatory scroll-smooth"
                    >
                        {reviews.map((review, idx) => {
                            const isExpanded = expandedIds.has(review.id)
                            const displayText = isExpanded ? review.comment : truncate(review.comment)
                            const needsTruncation = review.comment.length > MAX_VISIBLE_CHARS
                            return (
                                <div
                                    key={review.id}
                                    className="snap-start shrink-0 w-[260px] sm:w-[280px] rounded-lg border border-slate-200 p-4 flex flex-col bg-white"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-7 h-7 rounded-full bg-ocean-600 flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                                            {review.reviewerName?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-slate-800 text-xs truncate">{review.reviewerName || 'Pengguna'}</p>
                                            <p className="text-[10px] text-slate-400">{formatDate(review.createdAt)}</p>
                                        </div>
                                        <div className="ml-auto flex shrink-0">{renderStars(review.rating)}</div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            {displayText}
                                            {needsTruncation && !isExpanded && (
                                                <button
                                                    onClick={() => toggleExpand(review.id)}
                                                    className="text-ocean-600 font-semibold ml-1 hover:underline"
                                                >
                                                    lihat selengkapnya
                                                </button>
                                            )}
                                            {isExpanded && (
                                                <button
                                                    onClick={() => toggleExpand(review.id)}
                                                    className="text-ocean-600 font-semibold ml-1 hover:underline"
                                                >
                                                    tutup
                                                </button>
                                            )}
                                        </p>
                                    </div>

                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </section>
    )
}

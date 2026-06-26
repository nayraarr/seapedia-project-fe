import { useNavigate } from 'react-router-dom'

export default function BackButton({ label = 'Kembali', className = '' }) {
    const navigate = useNavigate()
    return (
        <button
            onClick={() => navigate(-1)}
            className={`group inline-flex items-center gap-1.5 text-sm font-semibold text-ocean-600 hover:text-ocean-700 transition ${className}`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {label}
        </button>
    )
}

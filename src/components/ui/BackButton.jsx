import { useNavigate } from 'react-router-dom'

export default function BackButton({ label = 'Kembali', to, className = '' }) {
    const navigate = useNavigate()
    return (
        <button
            onClick={() => (to ? navigate(to) : navigate(-1))}
            className={`group inline-flex items-center gap-2 text-sm font-semibold text-ocean-700 bg-white border border-ocean-200 hover:border-ocean-300 hover:bg-ocean-50 hover:shadow-sm active:scale-[0.97] px-4 py-2 rounded-lg shadow-card transition-all duration-200 ${className}`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {label}
        </button>
    )
}

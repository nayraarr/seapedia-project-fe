import { useNavigate } from 'react-router-dom'

export default function BackButton({ label = '← Kembali', className = '' }) {
    const navigate = useNavigate()
    return (
        <button onClick={() => navigate(-1)}
                className={`text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline ${className}`}>
            {label}
        </button>
    )
}

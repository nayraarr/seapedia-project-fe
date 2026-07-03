const styleMap = {
    error: {
        container: 'border-red-200 bg-white shadow-red-100/50',
        icon: 'bg-red-50 text-red-600',
        iconSvg: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86l-8.2 14A2 2 0 003.82 21h16.36a2 2 0 001.73-3.14l-8.2-14a2 2 0 00-3.42 0z" />
            </svg>
        ),
    },
    success: {
        container: 'border-emerald-200 bg-white shadow-emerald-100/50',
        icon: 'bg-emerald-50 text-emerald-600',
        iconSvg: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    info: {
        container: 'border-ocean-200 bg-white shadow-ocean-100/50',
        icon: 'bg-ocean-50 text-ocean-600',
        iconSvg: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
}

export default function Toast({ message, type, title, onClose }) {
    if (!message) return null

    const s = styleMap[type] || styleMap.success

    return (
        <div className="fixed top-5 right-5 z-[100] w-[min(92vw,22rem)] animate-slide-down">
            <div className={`rounded-2xl border shadow-xl overflow-hidden backdrop-blur-sm ${s.container}`}>
                <div className="flex items-start gap-3 px-4 py-3.5">
                    <div className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${s.icon}`}>
                        {s.iconSvg}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-800">{title || 'Notifikasi'}</p>
                        <p className="mt-0.5 text-sm leading-5 text-slate-600 break-words">
                            {message}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="ml-2 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                        aria-label="Tutup notifikasi"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

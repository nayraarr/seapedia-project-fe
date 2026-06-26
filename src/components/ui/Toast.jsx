export default function Toast({ message, onClose }) {
    if (!message) return null

    const isError = message.toLowerCase().includes('gagal') || message.toLowerCase().includes('error') || message.toLowerCase().includes('tidak')

    return (
        <div className="fixed top-5 right-5 z-[100] w-[min(92vw,22rem)] animate-slide-down">
            <div className={`rounded-2xl border shadow-xl overflow-hidden backdrop-blur-sm ${
                isError
                    ? 'border-red-200 bg-white shadow-red-100/50'
                    : 'border-emerald-200 bg-white shadow-emerald-100/50'
            }`}>
                <div className="flex items-start gap-3 px-4 py-3.5">
                    <div className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                        isError ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                        {isError ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86l-8.2 14A2 2 0 003.82 21h16.36a2 2 0 001.73-3.14l-8.2-14a2 2 0 00-3.42 0z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-800">Keranjang</p>
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

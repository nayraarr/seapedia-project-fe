export default function ConfirmDialog({
                                          isOpen,
                                          title = 'Konfirmasi',
                                          message = 'Apakah kamu yakin?',
                                          confirmLabel = 'Ya, Lanjutkan',
                                          cancelLabel = 'Batal',
                                          variant = 'danger',
                                          onConfirm,
                                          onCancel,
                                      }) {
    if (!isOpen) return null

    const confirmVariants = {
        danger:  'bg-red-500 hover:bg-red-600 text-white',
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        warning: 'bg-amber-400 hover:bg-amber-500 text-white',
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Dialog */}
            <div className="relative bg-white rounded-2xl shadow-xl border border-blue-100 w-full max-w-sm p-6 z-10">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    variant === 'danger' ? 'bg-red-100' :
                        variant === 'warning' ? 'bg-amber-100' : 'bg-blue-100'
                }`}>
                    {variant === 'danger' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    ) : variant === 'warning' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                </div>

                <h3 className="text-lg font-bold text-slate-800 text-center mb-2">{title}</h3>
                <p className="text-slate-400 text-sm text-center mb-6">{message}</p>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${confirmVariants[variant]}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}
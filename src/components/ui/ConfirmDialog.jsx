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

    const iconMap = {
        danger: {
            bg: 'bg-red-100',
            icon: 'text-red-500',
            path: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
        },
        warning: {
            bg: 'bg-amber-100',
            icon: 'text-amber-500',
            path: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
        },
        primary: {
            bg: 'bg-ocean-100',
            icon: 'text-ocean-600',
            path: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
        },
    }

    const btnMap = {
        danger:  'bg-red-500 hover:bg-red-600 text-white shadow-sm shadow-red-200',
        primary: 'ocean-gradient shadow-sm shadow-ocean-200 text-white',
        warning: 'bg-amber-400 hover:bg-amber-500 text-white shadow-sm shadow-amber-200',
    }

    const current = iconMap[variant] || iconMap.danger

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-white rounded-2xl shadow-modal border border-slate-100 w-full max-w-sm p-6 z-10 animate-scale-in">
                <div className={`w-13 h-13 rounded-full flex items-center justify-center mx-auto mb-4 ${current.bg}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 ${current.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {current.path}
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800 text-center mb-2">{title}</h3>
                <p className="text-slate-500 text-sm text-center mb-6">{message}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 border-2 border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition active:scale-[0.97] cursor-pointer"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition active:scale-[0.97] cursor-pointer ${btnMap[variant]}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}
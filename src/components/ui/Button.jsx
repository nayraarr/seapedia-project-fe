export default function Button({
                                   children,
                                   type = 'button',
                                   variant = 'primary',
                                   size = 'md',
                                   disabled = false,
                                   fullWidth = false,
                                   onClick,
                                   className = '',
                               }) {
    const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition disabled:opacity-50 cursor-pointer'

    const variants = {
        primary:   'bg-blue-600 text-white hover:bg-blue-700',
        outline:   'border border-blue-200 text-blue-600 hover:bg-blue-50',
        ghost:     'text-slate-500 hover:text-blue-600 hover:bg-blue-50',
        danger:    'text-red-400 hover:text-red-600 hover:bg-red-50',
        emerald:   'bg-emerald-500 text-white hover:bg-emerald-600',
        orange:    'bg-orange-500 text-white hover:bg-orange-600',
    }

    const sizes = {
        sm:  'text-xs px-3 py-1.5',
        md:  'text-sm px-4 py-2.5',
        lg:  'text-base px-8 py-3.5',
    }

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`
                ${base}
                ${variants[variant]}
                ${sizes[size]}
                ${fullWidth ? 'w-full' : ''}
                ${className}
            `}
        >
            {children}
        </button>
    )
}
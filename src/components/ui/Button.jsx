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
    const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none active:scale-[0.97]'

    const variants = {
        primary:   'ocean-gradient text-white shadow-md shadow-ocean-200 hover:shadow-lg hover:shadow-ocean-300 active:shadow-sm',
        outline:   'border-2 border-ocean-200 text-ocean-600 hover:bg-ocean-50 hover:border-ocean-300',
        ghost:     'text-slate-500 hover:text-ocean-600 hover:bg-ocean-50',
        danger:    'bg-red-500 text-white hover:bg-red-600 shadow-sm shadow-red-100',
        emerald:   'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm shadow-emerald-100',
        orange:    'bg-orange-500 text-white hover:bg-orange-600 shadow-sm shadow-orange-100',
    }

    const sizes = {
        sm:  'text-xs px-3 py-1.5 gap-1',
        md:  'text-sm px-5 py-2.5 gap-1.5',
        lg:  'text-base px-8 py-3.5 gap-2',
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
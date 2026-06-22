export default function Input({
                                  label,
                                  type = 'text',
                                  value,
                                  onChange,
                                  placeholder = '',
                                  error = '',
                                  disabled = false,
                                  className = '',
                                  rightElement,
                              }) {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label className="text-sm font-semibold text-slate-600">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`
                        w-full border rounded-xl px-4 py-2.5 text-sm
                        focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent
                        transition disabled:opacity-50 disabled:bg-slate-50
                        ${error ? 'border-red-300 bg-red-50' : 'border-slate-200'}
                        ${rightElement ? 'pr-11' : ''}
                    `}
                />
                {rightElement && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {rightElement}
                    </div>
                )}
            </div>
            {error && (
                <p className="text-xs text-red-500">{error}</p>
            )}
        </div>
    )
}
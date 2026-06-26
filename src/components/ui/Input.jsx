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
                <label className="text-sm font-semibold text-slate-700">
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
                    className={error ? 'input-error' : `input-field ${rightElement ? 'pr-11' : ''}`}
                />
                {rightElement && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        {rightElement}
                    </div>
                )}
            </div>
            {error && (
                <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86l-8.2 14A2 2 0 003.82 21h16.36a2 2 0 001.73-3.14l-8.2-14a2 2 0 00-3.42 0z" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    )
}
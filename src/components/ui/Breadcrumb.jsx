import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function Breadcrumb({ items, className = '' }) {
    return (
        <nav className={`flex items-center gap-1 text-sm overflow-x-auto whitespace-nowrap scrollbar-thin ${className}`}>
            {items.map((item, idx) => {
                const isLast = idx === items.length - 1
                return (
                    <span key={idx} className="flex items-center gap-1">
                        {idx > 0 && (
                            <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />
                        )}
                        {item.to && !isLast ? (
                            <Link
                                to={item.to}
                                className="text-ocean-600 hover:text-ocean-700 transition-colors font-medium flex-shrink-0"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span
                                className={`text-slate-500 ${isLast ? 'truncate max-w-[160px] sm:max-w-[320px]' : ''}`}
                                title={isLast ? item.label : undefined}
                            >
                                {item.label}
                            </span>
                        )}
                    </span>
                )
            })}
        </nav>
    )
}

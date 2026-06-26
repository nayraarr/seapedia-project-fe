import { Link } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'

export default function NotFound() {
    return (
        <MainLayout>
            <div className="text-center py-24 animate-fade-in">
                <div className="text-8xl font-extrabold text-gradient mb-4">404</div>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Halaman tidak ditemukan</h1>
                <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">
                    Halaman yang kamu cari tidak ada atau sudah dipindahkan.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 ocean-gradient text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-ocean-200 transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Kembali ke beranda
                </Link>
            </div>
        </MainLayout>
    )
}

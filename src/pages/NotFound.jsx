import { Link } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'

export default function NotFound() {
    return (
        <MainLayout>
            <div className="text-center py-24">
                <p className="text-8xl font-extrabold text-blue-100 mb-2">404</p>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Halaman tidak ditemukan</h1>
                <p className="text-slate-400 text-sm mb-8">
                    Halaman yang kamu cari tidak ada atau sudah dipindahkan.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                    ← Kembali ke beranda
                </Link>
            </div>
        </MainLayout>
    )
}
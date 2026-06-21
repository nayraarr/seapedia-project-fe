import { Link } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'

export default function NotFound() {
    return (
        <MainLayout>
            <div className="text-center py-20">
                <h1 className="text-4xl font-bold mb-4">404 - Halaman tidak ditemukan</h1>
                <p className="mb-6 text-gray-600">Halaman yang Anda cari tidak ditemukan atau telah dipindahkan.</p>
                <Link to="/" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Kembali ke beranda</Link>
            </div>
        </MainLayout>
    )
}

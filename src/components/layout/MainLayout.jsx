import Navbar from './Navbar'
import Footer from './Footer'

export default function MainLayout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-ocean-50/30 to-white flex flex-col">
            <Navbar />
            <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex-1">
                {children}
            </main>
            <Footer />
        </div>
    )
}
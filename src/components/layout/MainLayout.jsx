import Navbar from './Navbar'
import Footer from './Footer'

export default function MainLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#F0F7FF] flex flex-col">
            <Navbar />
            <main className="max-w-6xl mx-auto w-full px-6 py-10 flex-1">
                {children}
            </main>
            <Footer />
        </div>
    )
}
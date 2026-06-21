import Navbar from './Navbar'

export default function MainLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#F0F7FF]">
            <Navbar />
            <main className="max-w-6xl mx-auto px-6 py-10">
                {children}
            </main>
        </div>
    )
}
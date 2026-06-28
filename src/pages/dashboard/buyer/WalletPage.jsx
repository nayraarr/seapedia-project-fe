import { useState, useEffect } from 'react'
import MainLayout from '../../../components/layout/MainLayout'
import BackButton from '../../../components/ui/BackButton'
import { CreditCard } from 'lucide-react'
import { getWallet, topUp, getTransactions } from '../../../services/walletApi'

const TOPUP_PRESETS = [10000, 25000, 50000, 100000, 250000, 500000]

function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

function formatDate(iso) {
    return new Date(iso).toLocaleString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })
}

const TYPE_LABEL = { TOPUP: 'Top Up', PAYMENT: 'Pembayaran', REFUND: 'Refund' }
const TYPE_COLOR = { TOPUP: 'text-emerald-600', PAYMENT: 'text-red-500', REFUND: 'text-ocean-500' }
const TYPE_SIGN  = { TOPUP: '+', PAYMENT: '-', REFUND: '+' }

export default function WalletPage() {
    const [wallet, setWallet] = useState(null)
    const [transactions, setTransactions] = useState([])
    const [amount, setAmount] = useState('')
    const [loading, setLoading] = useState(true)
    const [topUpLoading, setTopUpLoading] = useState(false)
    const [error, setError] = useState('')
    const [fieldErrors, setFieldErrors] = useState({})
    const [success, setSuccess] = useState('')
    const [refresh, setRefresh] = useState(0)

    useEffect(() => {
        Promise.all([getWallet(), getTransactions()])
            .then(([walletRes, txRes]) => {
                setWallet(walletRes.data.data)
                setTransactions(txRes.data.data)
            })
            .catch(() => setError('Gagal memuat data wallet.'))
            .finally(() => setLoading(false))
    }, [refresh])

    const handleTopUp = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        const parsed = parseInt(amount, 10)
        if (!parsed || parsed < 1000) {
            setError('Minimal top up adalah Rp1.000')
            return
        }
        try {
            setTopUpLoading(true)
            await topUp(parsed)
            setSuccess(`Top up ${formatRupiah(parsed)} berhasil!`)
            setAmount('')
            setRefresh(prev => prev + 1)
        } catch (err) {
            const data = err.response?.data
            if (data?.fieldErrors && Object.keys(data.fieldErrors).length > 0) {
                setFieldErrors(data.fieldErrors)
            } else {
                setError(data?.message || 'Gagal melakukan top up.')
            }
        } finally {
            setTopUpLoading(false)
        }
    }

    return (
        <MainLayout>
            <BackButton className="mb-3" />
            <div className="mb-8 animate-fade-in">
                <span className="text-xs font-bold text-ocean-500 uppercase tracking-widest">Buyer</span>
                <h1 className="text-3xl font-bold text-slate-800 mt-1">Wallet Saya <CreditCard size={28} strokeWidth={1.5} className="inline-block align-middle" /></h1>
                <p className="text-slate-400 mt-1">Kelola saldo dan riwayat transaksi</p>
            </div>

            {loading ? (
                <div className="space-y-4">
                    <div className="skeleton h-36" />
                    <div className="skeleton h-48" />
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-6 animate-slide-up">
                    <div className="ocean-gradient rounded-lg p-6 sm:p-8 text-white shadow-card flex flex-col justify-center min-h-[200px]">
                        <p className="text-base opacity-80 mb-2">Saldo Saat Ini</p>
                        <p className="text-4xl sm:text-5xl font-bold tracking-tight">
                            {wallet ? formatRupiah(wallet.balance) : 'Rp0'}
                        </p>
                        {wallet?.updatedAt && (
                            <p className="text-sm opacity-60 mt-3">
                                Diperbarui: {formatDate(wallet.updatedAt)}
                            </p>
                        )}
                    </div>

                    <div className="card-hover p-4">
                        <h2 className="font-bold text-slate-700 mb-3 text-sm">Top Up Saldo</h2>

                        {error && (
                            <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mb-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2.5">
                                {success}
                            </div>
                        )}

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                            {TOPUP_PRESETS.map(preset => (
                                <button
                                    key={preset}
                                    type="button"
                                    onClick={() => setAmount(String(preset))}
                                    className={`text-xs font-semibold py-2 rounded-lg border transition
                                        ${String(amount) === String(preset)
                                        ? 'bg-ocean-600 text-white border-ocean-600'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-ocean-400'}`}
                                >
                                    {formatRupiah(preset)}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleTopUp} className="flex flex-col gap-3">
                            <input
                                type="number"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                placeholder="Atau masukkan nominal lain..."
                                min={1000}
                                className="input-field"
                            />
                            <button
                                type="submit"
                                disabled={topUpLoading}
                                className="bg-ocean-600 hover:bg-ocean-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
                            >
                                {topUpLoading ? 'Memproses...' : 'Top Up Sekarang'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {!loading && (
                <div className="mt-6 card overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100">
                        <h2 className="font-bold text-slate-700">Riwayat Transaksi</h2>
                    </div>
                    {transactions.length === 0 ? (
                        <p className="text-slate-400 text-sm px-6 py-10 text-center">
                            Belum ada transaksi.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 text-slate-400 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-3 text-left">Tanggal</th>
                                    <th className="px-6 py-3 text-left">Keterangan</th>
                                    <th className="px-6 py-3 text-left">Tipe</th>
                                    <th className="px-6 py-3 text-right">Jumlah</th>
                                    <th className="px-6 py-3 text-right">Saldo Akhir</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                {transactions.map(tx => (
                                    <tr key={tx.id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-3 text-slate-400 whitespace-nowrap">{formatDate(tx.createdAt)}</td>
                                        <td className="px-6 py-3 text-slate-600">{tx.description || '-'}</td>
                                        <td className="px-6 py-3">
                                                <span className={`font-semibold ${TYPE_COLOR[tx.type]}`}>
                                                    {TYPE_LABEL[tx.type] || tx.type}
                                                </span>
                                        </td>
                                        <td className={`px-6 py-3 text-right font-semibold ${TYPE_COLOR[tx.type]}`}>
                                            {TYPE_SIGN[tx.type]}{formatRupiah(tx.amount)}
                                        </td>
                                        <td className="px-6 py-3 text-right text-slate-500">
                                            {formatRupiah(tx.balanceAfter)}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </MainLayout>
    )
}

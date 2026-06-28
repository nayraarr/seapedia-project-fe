import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import Button from '../../../components/ui/Button'
import { useAuth } from '../../../contexts/useAuth'
import {
    getAdminDashboard, getAdminUsers, getAdminOrders,
    getAdminDeliveryJobs, getSimulationStatus, advanceSimulation, resetSimulation
} from '../../../services/adminApi'
import {
    generateVoucher, generatePromo, getAdminVouchers,
    getAdminPromos, getVoucherDetail, getPromoDetail
} from '../../../services/discountApi'
import { getAllStores } from '../../../services/storeApi'
import api from '../../../services/api'
import { Users, Store, Package, Receipt, Ticket, Tag, Bike, TriangleAlert, CheckCircle } from 'lucide-react'

function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
    }).format(amount ?? 0)
}

function formatDate(dateStr) {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('id-ID', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
    })
}

function StatCard({ icon, label, value, sub, color = 'slate', onClick }) {
    const colors = {
        slate:   'card border-slate-200 text-slate-700',
        red:     'card border-red-200 text-red-700',
        emerald: 'card border-emerald-200 text-emerald-700',
        yellow:  'card border-yellow-200 text-yellow-700',
        blue:    'card border-ocean-200 text-ocean-700',
        purple:  'card border-purple-200 text-purple-700',
    }
    return (
        <div
            className={`p-4 ${colors[color]} ${onClick ? 'cursor-pointer card-hover' : ''}`}
            onClick={onClick}
        >
            <div className="text-2xl mb-1">{icon}</div>
            <p className="text-xs font-semibold uppercase tracking-wide opacity-60 mb-0.5">{label}</p>
            <p className="text-2xl font-bold">{value ?? '-'}</p>
            {sub && <p className="text-xs opacity-60 mt-0.5">{sub}</p>}
        </div>
    )
}

function SectionTitle({ children, onClick }) {
    const Comp = onClick ? 'button' : 'div'
    return (
        <Comp
            onClick={onClick}
            className={`text-base font-bold text-slate-700 mb-3 mt-6 first:mt-0 flex items-center gap-2 ${onClick ? 'hover:text-red-600 transition-colors' : ''}`}
        >
            {children}
            {onClick && <span className="text-xs font-normal text-red-500 ml-auto">Lihat detail →</span>}
        </Comp>
    )
}

function DataPreview({ title, count, columns, rows, loading, onViewAll, emptyMessage = 'Belum ada data.' }) {
    const hasMore = count > 10
    return (
        <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100">
                <h3 className="font-bold text-slate-700 text-sm">
                    {title} <span className="text-slate-400 font-normal">({count})</span>
                </h3>
                {hasMore && (
                    <Button onClick={onViewAll} variant="outline" size="sm">
                        Lihat Semua
                    </Button>
                )}
            </div>
            {loading ? (
                <div className="text-center py-6 text-slate-400 text-sm">Memuat data...</div>
            ) : rows.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-sm">{emptyMessage}</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="text-left text-xs text-slate-500 uppercase border-b border-slate-50">
                            {columns.map(col => <th key={col} className="px-4 py-2.5 font-semibold">{col}</th>)}
                        </tr>
                        </thead>
                        <tbody>{rows}</tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

function MonitoringTab({ data, onNavigate }) {
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [usersLoading, setUsersLoading] = useState(true)
    const [stores, setStores] = useState([])
    const [storesLoading, setStoresLoading] = useState(true)
    const [products, setProducts] = useState([])
    const [productsLoading, setProductsLoading] = useState(true)
    const [orders, setOrders] = useState([])
    const [ordersLoading, setOrdersLoading] = useState(true)
    const [deliveryJobs, setDeliveryJobs] = useState([])
    const [deliveryJobsLoading, setDeliveryJobsLoading] = useState(true)
    const [vouchers, setVouchers] = useState([])
    const [vouchersLoading, setVouchersLoading] = useState(true)
    const [promos, setPromos] = useState([])
    const [promosLoading, setPromosLoading] = useState(true)
    const [detailItem, setDetailItem] = useState(null)

    useEffect(() => {
        if (!data) return
        getAdminUsers()
            .then(res => setUsers(res.data.data || []))
            .catch(() => {})
            .finally(() => setUsersLoading(false))
        getAllStores()
            .then(res => setStores(res.data.data || []))
            .catch(() => {})
            .finally(() => setStoresLoading(false))
        api.get('/products')
            .then(res => setProducts(res.data.data || []))
            .catch(() => {})
            .finally(() => setProductsLoading(false))
        getAdminOrders()
            .then(res => setOrders(res.data.data || []))
            .catch(() => {})
            .finally(() => setOrdersLoading(false))
        getAdminDeliveryJobs()
            .then(res => setDeliveryJobs(res.data.data || []))
            .catch(() => {})
            .finally(() => setDeliveryJobsLoading(false))
        getAdminVouchers()
            .then(res => setVouchers(res.data.data || []))
            .catch(() => {})
            .finally(() => setVouchersLoading(false))
        getAdminPromos()
            .then(res => setPromos(res.data.data || []))
            .catch(() => {})
            .finally(() => setPromosLoading(false))
    }, [data])

    if (!data) return <div className="text-center py-16 text-slate-400">Memuat data monitoring...</div>

    const overdueList = data.overdueOrderList || []

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
                <StatCard icon={<Users size={20} strokeWidth={1.5} />} label="Users"   value={data.totalUsers}        color="slate"   onClick={() => onNavigate('users')} />
                <StatCard icon={<Store size={20} strokeWidth={1.5} />} label="Toko"    value={data.totalStores}       color="purple"  onClick={() => onNavigate('stores')} />
                <StatCard icon={<Package size={20} strokeWidth={1.5} />} label="Produk"  value={data.totalProducts}     color="slate"   onClick={() => onNavigate('products')} />
                <StatCard icon={<Receipt size={20} strokeWidth={1.5} />} label="Orders"  value={data.totalOrders}       color="blue"    onClick={() => onNavigate('orders')} />
                <StatCard icon={<Ticket size={20} strokeWidth={1.5} />} label="Voucher" value={data.totalVouchers}     color="slate"   onClick={() => onNavigate('vouchers')} />
                <StatCard icon={<Tag size={20} strokeWidth={1.5} />} label="Promo"   value={data.totalPromos}       color="slate"   onClick={() => onNavigate('promos')} />
                <StatCard icon={<Bike size={20} strokeWidth={1.5} />} label="Jobs"    value={data.totalDeliveryJobs} color="yellow"  onClick={() => onNavigate('delivery-jobs')} />
                <StatCard icon={<TriangleAlert size={20} strokeWidth={1.5} />} label="Overdue" value={data.overdueOrders}     color="red"     onClick={() => onNavigate('overdue')} />
            </div>

            <DataPreview
                title={<><Users size={16} className="inline-block mr-1" strokeWidth={1.5} /> Pengguna Terbaru</>} count={data.totalUsers}
                columns={['Username', 'Email', 'Role', 'Bergabung']}
                rows={users.slice(0, 10).map(u => (
                    <tr key={u.id} className="border-b border-slate-50 hover:bg-red-50/40 transition cursor-pointer"
                        onClick={() => navigate(`/dashboard/admin/users/${u.id}`)}>
                        <td className="px-4 py-2.5 font-medium text-slate-700">{u.username}</td>
                        <td className="px-4 py-2.5 text-slate-500 text-xs">{u.email}</td>
                        <td className="px-4 py-2.5">
                            {u.isAdmin
                                ? <span className="badge-red">Admin</span>
                                : <span className="badge-slate">{u.roles.join(', ')}</span>}
                        </td>
                        <td className="px-4 py-2.5 text-slate-500 text-xs">{formatDate(u.createdAt)}</td>
                    </tr>
                ))}
                loading={usersLoading} onViewAll={() => onNavigate('users')}
            />

            <DataPreview
                title={<><Store size={16} className="inline-block mr-1" strokeWidth={1.5} /> Toko Terbaru</>} count={data.totalStores}
                columns={['Nama Toko', 'Pemilik', 'Dibuat']}
                rows={stores.slice(0, 10).map(s => (
                    <tr key={s.id} className="border-b border-slate-50 hover:bg-red-50/40 transition cursor-pointer"
                        onClick={() => navigate(`/stores/${s.id}`)}>
                        <td className="px-4 py-2.5 font-medium text-slate-700">{s.name}</td>
                        <td className="px-4 py-2.5 text-slate-600">{s.ownerUsername}</td>
                        <td className="px-4 py-2.5 text-slate-500 text-xs">{formatDate(s.createdAt)}</td>
                    </tr>
                ))}
                loading={storesLoading} onViewAll={() => onNavigate('stores')} emptyMessage="Belum ada toko."
            />

            <DataPreview
                title={<><Package size={16} className="inline-block mr-1" strokeWidth={1.5} /> Produk Terbaru</>} count={data.totalProducts}
                columns={['Nama Produk', 'Toko', 'Harga', 'Stok']}
                rows={products.slice(0, 10).map(p => (
                    <tr key={p.id} className="border-b border-slate-50 hover:bg-red-50/40 transition cursor-pointer"
                        onClick={() => navigate(`/products/${p.id}`)}>
                        <td className="px-4 py-2.5 font-medium text-slate-700">{p.name}</td>
                        <td className="px-4 py-2.5 text-slate-600 text-xs">{p.storeName}</td>
                        <td className="px-4 py-2.5 text-slate-700 font-semibold">{formatRupiah(p.price)}</td>
                        <td className="px-4 py-2.5">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                p.stock === 0 ? 'badge-red'
                                    : p.stock <= 5 ? 'bg-yellow-50 text-yellow-700'
                                        : 'badge-emerald'
                            }`}>{p.stock}</span>
                        </td>
                    </tr>
                ))}
                loading={productsLoading} onViewAll={() => onNavigate('products')} emptyMessage="Belum ada produk."
            />

            <DataPreview
                title={<><Receipt size={16} className="inline-block mr-1" strokeWidth={1.5} /> Pesanan Terbaru</>} count={data.totalOrders}
                columns={['Toko', 'Buyer', 'Status', 'Total', 'Dibuat']}
                rows={orders.slice(0, 10).map(o => (
                    <tr key={o.id} className="border-b border-slate-50 hover:bg-red-50/40 transition cursor-pointer"
                        onClick={() => navigate(`/dashboard/admin/orders/${o.id}`)}>
                        <td className="px-4 py-2.5 font-medium text-slate-700">{o.storeName}</td>
                        <td className="px-4 py-2.5 text-slate-600">{o.buyerUsername}</td>
                        <td className="px-4 py-2.5">
                            <span className="badge-slate">{o.statusLabel}</span>
                        </td>
                        <td className="px-4 py-2.5 text-slate-700 font-semibold">{formatRupiah(o.totalAmount)}</td>
                        <td className="px-4 py-2.5 text-slate-500 text-xs">{formatDate(o.createdAt)}</td>
                    </tr>
                ))}
                loading={ordersLoading} onViewAll={() => onNavigate('orders')} emptyMessage="Belum ada pesanan."
            />

            <DataPreview
                title={<><Ticket size={16} className="inline-block mr-1" strokeWidth={1.5} /> Voucher Terbaru</>} count={data.totalVouchers}
                columns={['Kode', 'Diskon', 'Sisa', 'Expiry', 'Status']}
                rows={vouchers.slice(0, 10).map(v => (
                    <tr key={v.id} className="border-b border-slate-50 hover:bg-red-50/40 transition">
                        <td className="px-4 py-2.5 font-mono font-bold text-slate-700">{v.code}</td>
                        <td className="px-4 py-2.5 text-slate-600">{v.discountType === 'PERCENTAGE' ? `${v.discountValue}%` : formatRupiah(v.discountValue)}</td>
                        <td className="px-4 py-2.5 text-slate-600">{v.remainingUsage ?? v.usageLimit - v.usedCount}/{v.usageLimit}</td>
                        <td className="px-4 py-2.5 text-slate-500 text-xs">{formatDate(v.expiryDate)}</td>
                        <td className="px-4 py-2.5">
                            {v.expired
                                ? <span className="badge-red">Expired</span>
                                : v.active
                                    ? <span className="badge-emerald">Aktif</span>
                                    : <span className="badge-slate">Nonaktif</span>}
                        </td>
                    </tr>
                ))}
                loading={vouchersLoading} onViewAll={() => onNavigate('vouchers')} emptyMessage="Belum ada voucher."
            />

            <DataPreview
                title={<><Tag size={16} className="inline-block mr-1" strokeWidth={1.5} /> Promo Terbaru</>} count={data.totalPromos}
                columns={['Kode', 'Diskon', 'Expiry', 'Status']}
                rows={promos.slice(0, 10).map(p => (
                    <tr key={p.id} className="border-b border-slate-50 hover:bg-red-50/40 transition">
                        <td className="px-4 py-2.5 font-mono font-bold text-slate-700">{p.code}</td>
                        <td className="px-4 py-2.5 text-slate-600">{p.discountType === 'PERCENTAGE' ? `${p.discountValue}%` : formatRupiah(p.discountValue)}</td>
                        <td className="px-4 py-2.5 text-slate-500 text-xs">{formatDate(p.expiryDate)}</td>
                        <td className="px-4 py-2.5">
                            {p.expired
                                ? <span className="badge-red">Expired</span>
                                : p.active
                                    ? <span className="badge-emerald">Aktif</span>
                                    : <span className="badge-slate">Nonaktif</span>}
                        </td>
                    </tr>
                ))}
                loading={promosLoading} onViewAll={() => onNavigate('promos')} emptyMessage="Belum ada promo."
            />

            <DataPreview
                title={<><Bike size={16} className="inline-block mr-1" strokeWidth={1.5} /> Delivery Jobs Terbaru</>} count={data.totalDeliveryJobs}
                columns={['Toko', 'Driver', 'Status', 'Dibuat']}
                rows={deliveryJobs.slice(0, 10).map(j => (
                    <tr key={j.id} className="border-b border-slate-50 hover:bg-red-50/40 transition cursor-pointer"
                        onClick={() => setDetailItem({ type: 'delivery-job', data: j })}>
                        <td className="px-4 py-2.5 font-medium text-slate-700">{j.storeName}</td>
                        <td className="px-4 py-2.5 text-slate-600">
                            {j.driverId
                                ? j.driverId.slice(0, 8) + '...'
                                : <span className="text-xs text-slate-400">Belum ada</span>}
                        </td>
                        <td className="px-4 py-2.5">
                            <span className="badge-slate">{j.orderStatusLabel}</span>
                        </td>
                        <td className="px-4 py-2.5 text-slate-500 text-xs">{formatDate(j.createdAt)}</td>
                    </tr>
                ))}
                loading={deliveryJobsLoading} onViewAll={() => onNavigate('delivery-jobs')} emptyMessage="Belum ada delivery job."
            />

            <div>
                <SectionTitle><><TriangleAlert size={16} className="inline-block mr-1" strokeWidth={1.5} /> Pesanan Overdue ({data.overdueOrders})</></SectionTitle>
                {overdueList.length === 0 ? (
                    <div className="badge-emerald px-4 py-3 text-sm font-medium rounded-lg">
                        <CheckCircle size={16} className="inline-block mr-1" strokeWidth={1.5} /> Tidak ada pesanan overdue saat ini.
                    </div>
                ) : (
                    <div className="card border-red-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                <tr className="text-left text-xs text-slate-500 uppercase border-b border-slate-100 bg-red-50">
                                    <th className="px-4 py-3">Order ID</th>
                                    <th className="px-4 py-3">Toko</th>
                                    <th className="px-4 py-3">Buyer</th>
                                    <th className="px-4 py-3">Dibuat</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {overdueList.map(o => (
                                    <tr key={o.orderId} className="border-b border-slate-50 hover:bg-red-50/40 transition cursor-pointer"
                                        onClick={() => navigate(`/dashboard/admin/orders/${o.orderId}`)}>
                                        <td className="px-4 py-3 font-mono text-xs text-slate-500">{o.orderId.slice(0, 8)}...</td>
                                        <td className="px-4 py-3 font-medium text-slate-700">{o.storeName}</td>
                                        <td className="px-4 py-3 text-slate-600">{o.buyerUsername}</td>
                                        <td className="px-4 py-3 text-slate-500 text-xs">{formatDate(o.createdAt)}</td>
                                        <td className="px-4 py-3">
                                            {o.processed ? (
                                                <span className="badge-orange">
                                                    DIKEMBALIKAN
                                                </span>
                                            ) : (
                                                <span className="badge-red">
                                                    {o.minutesOverdue} menit
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {detailItem && detailItem.type === 'delivery-job' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in" onClick={() => setDetailItem(null)}>
                    <div className="card p-6 max-w-md w-full mx-4 shadow-xl animate-slide-up" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-800 text-lg">Detail Delivery Job</h3>
                            <button onClick={() => setDetailItem(null)} className="text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div><p className="text-xs font-semibold text-slate-400 uppercase">Order ID</p><p className="font-mono text-xs text-slate-800">{detailItem.data.id}</p></div>
                            <div><p className="text-xs font-semibold text-slate-400 uppercase">Toko</p><p className="font-medium text-slate-800">{detailItem.data.storeName}</p></div>
                            <div><p className="text-xs font-semibold text-slate-400 uppercase">Driver</p><p className="font-medium text-slate-800">{detailItem.data.driverId || 'Belum ada'}</p></div>
                            <div><p className="text-xs font-semibold text-slate-400 uppercase">Status</p><p className="font-medium text-slate-800">{detailItem.data.orderStatusLabel}</p></div>
                            <div><p className="text-xs font-semibold text-slate-400 uppercase">Dibuat</p><p className="font-medium text-slate-800">{formatDate(detailItem.data.createdAt)}</p></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function ListModal({ title, items, columns, loading, onClose, renderRow }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="card max-w-4xl w-full mx-4 shadow-xl max-h-[80vh] flex flex-col animate-slide-up" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                    <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 text-lg">&times;</button>
                </div>
                <div className="overflow-y-auto p-6">
                    {loading ? (
                        <div className="text-center py-10 text-slate-400">Memuat data...</div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-10 text-slate-400">Tidak ada data.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                <tr className="text-left text-xs text-slate-500 uppercase border-b border-slate-100">
                                    {columns.map(col => <th key={col} className="px-4 py-3 font-semibold">{col}</th>)}
                                </tr>
                                </thead>
                                <tbody>
                                {items.map((item, i) => renderRow(item, i))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function DetailField({ label, value, mono }) {
    return (
        <div>
            <p className="text-xs font-semibold text-slate-400 uppercase mb-0.5">{label}</p>
            <p className={`text-slate-800 ${mono ? 'font-mono font-bold' : 'font-medium'}`}>{value ?? '-'}</p>
        </div>
    )
}

function DetailModal({ item, onClose }) {
    if (!item) return null
    const data = item.data
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="card p-6 max-w-lg w-full mx-4 shadow-xl animate-slide-up" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800 text-lg">Detail {item.type}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
                </div>
                <div className="space-y-3 text-sm">
                    <DetailField label="Code" value={data.code} mono />
                    <DetailField label="Tipe Diskon" value={data.discountType === 'PERCENTAGE' ? `${data.discountValue}%` : `Rp${data.discountValue}`} />
                    <DetailField label="Maks Diskon" value={data.maxDiscountAmount ? formatRupiah(data.maxDiscountAmount) : 'Tidak ada'} />
                    <DetailField label="Min Pembelian" value={data.minPurchaseAmount ? formatRupiah(data.minPurchaseAmount) : 'Rp0'} />
                    {item.type === 'VOUCHER' && <DetailField label="Sisa Pemakaian" value={`${data.remainingUsage ?? data.usageLimit - data.usedCount} / ${data.usageLimit}`} />}
                    <DetailField label="Expiry" value={data.expiryDate ? formatDate(data.expiryDate) : '-'} />
                    <DetailField label="Status" value={data.expired ? 'Expired' : data.active ? 'Aktif' : 'Nonaktif'} />
                    {data.description && <DetailField label="Deskripsi" value={data.description} />}
                </div>
            </div>
        </div>
    )
}

const initialVoucherForm = {
    code: '', description: '', discountType: 'PERCENTAGE', discountValue: '',
    maxDiscountAmount: '', minPurchaseAmount: '0', usageLimit: '', expiryDate: '',
}
const initialPromoForm = {
    code: '', description: '', discountType: 'PERCENTAGE', discountValue: '',
    maxDiscountAmount: '', minPurchaseAmount: '0', expiryDate: '',
}

export default function AdminDashboard() {
    const { decoded } = useAuth()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('monitoring')
    const [monitoringData, setMonitoringData] = useState(null)
    const [monitoringLoading, setMonitoringLoading] = useState(true)

    const [voucherForm, setVoucherForm] = useState(initialVoucherForm)
    const [promoForm, setPromoForm] = useState(initialPromoForm)
    const [vouchers, setVouchers] = useState([])
    const [promos, setPromos] = useState([])
    const [listLoading, setListLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [fieldErrors, setFieldErrors] = useState({})
    const [selectedItem, setSelectedItem] = useState(null)
    const [detailItem, setDetailItem] = useState(null)

    const [modalList, setModalList] = useState(null)
    const [modalLoading, setModalLoading] = useState(false)
    const [modalData, setModalData] = useState([])

    const [simulationOffset, setSimulationOffset] = useState(0)
    const [simulationInput, setSimulationInput] = useState('')
    const [simulating, setSimulating] = useState(false)
    const [simulatedNow, setSimulatedNow] = useState(null)

    const fetchVouchers = () =>
        getAdminVouchers().then(res => setVouchers(res.data.data || [])).catch(() => {})
    const fetchPromos = () =>
        getAdminPromos().then(res => setPromos(res.data.data || [])).catch(() => {})

    const refreshMonitoring = useCallback(() => {
        getAdminDashboard()
            .then(res => {
                setMonitoringData(res.data.data)
                setSimulationOffset(res.data.data.simulationOffsetMinutes ?? 0)
            })
            .catch(() => {})
            .finally(() => setMonitoringLoading(false))
    }, [])

    const refreshSimulation = useCallback(() => {
        getSimulationStatus()
            .then(res => {
                setSimulationOffset(res.data.data.offsetMinutes ?? 0)
                setSimulatedNow(res.data.data.simulatedNow ?? null)
            })
            .catch(() => {})
    }, [])

    useEffect(() => {
        Promise.all([fetchVouchers(), fetchPromos()]).finally(() => setListLoading(false))
        refreshMonitoring()
        refreshSimulation()
    }, [refreshMonitoring, refreshSimulation])

    const handleAdvanceTime = async (minutes) => {
        setSimulating(true)
        try {
            await advanceSimulation(minutes)
            await refreshSimulation()
            await refreshMonitoring()
        } catch {
            setMessage({ type: 'error', text: 'Gagal memajukan waktu.' })
        } finally {
            setSimulating(false)
        }
    }

    const handleResetTime = async () => {
        setSimulating(true)
        try {
            await resetSimulation()
            await refreshSimulation()
            await refreshMonitoring()
        } catch {
            setMessage({ type: 'error', text: 'Gagal mereset simulasi.' })
        } finally {
            setSimulating(false)
        }
    }

    const handleVoucherChange = (e) => {
        const { name, value } = e.target
        setVoucherForm(prev => ({ ...prev, [name]: name === 'code' ? value.toUpperCase() : value }))
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const handlePromoChange = (e) => {
        const { name, value } = e.target
        setPromoForm(prev => ({ ...prev, [name]: name === 'code' ? value.toUpperCase() : value }))
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validateVoucher = () => {
        const errors = {}
        if (!voucherForm.code.trim()) errors.code = 'Kode voucher tidak boleh kosong'
        if (!voucherForm.discountValue || Number(voucherForm.discountValue) < 1) errors.discountValue = 'Nilai diskon harus lebih dari 0'
        if (!voucherForm.usageLimit || Number(voucherForm.usageLimit) < 1) errors.usageLimit = 'Batas pemakaian harus diisi'
        if (!voucherForm.expiryDate) errors.expiryDate = 'Tanggal berlaku harus diisi'
        return errors
    }

    const handleCreateVoucher = async (e) => {
        e.preventDefault()
        setMessage({ type: '', text: '' })
        setFieldErrors({})

        const clientErrors = validateVoucher()
        if (Object.keys(clientErrors).length > 0) {
            setFieldErrors(clientErrors)
            return
        }

        setSubmitting(true)
        try {
            const payload = {
                code: voucherForm.code,
                description: voucherForm.description || undefined,
                discountType: voucherForm.discountType,
                discountValue: Number(voucherForm.discountValue),
                maxDiscountAmount: voucherForm.maxDiscountAmount ? Number(voucherForm.maxDiscountAmount) : undefined,
                minPurchaseAmount: Number(voucherForm.minPurchaseAmount) || 0,
                usageLimit: Number(voucherForm.usageLimit),
                expiryDate: voucherForm.expiryDate + ':00',
            }
            await generateVoucher(payload)
            setMessage({ type: 'success', text: `Voucher "${voucherForm.code}" berhasil dibuat.` })
            setVoucherForm(initialVoucherForm)
            await fetchVouchers()
        } catch (err) {
            const data = err.response?.data
            if (data?.fieldErrors && Object.keys(data.fieldErrors).length > 0) {
                setFieldErrors(data.fieldErrors)
            } else {
                setMessage({ type: 'error', text: data?.message || 'Gagal membuat voucher.' })
            }
        } finally {
            setSubmitting(false)
        }
    }

    const validatePromo = () => {
        const errors = {}
        if (!promoForm.code.trim()) errors.code = 'Kode promo tidak boleh kosong'
        if (!promoForm.discountValue || Number(promoForm.discountValue) < 1) errors.discountValue = 'Nilai diskon harus lebih dari 0'
        if (!promoForm.expiryDate) errors.expiryDate = 'Tanggal berlaku harus diisi'
        return errors
    }

    const handleCreatePromo = async (e) => {
        e.preventDefault()
        setMessage({ type: '', text: '' })
        setFieldErrors({})

        const clientErrors = validatePromo()
        if (Object.keys(clientErrors).length > 0) {
            setFieldErrors(clientErrors)
            return
        }

        setSubmitting(true)
        try {
            const payload = {
                code: promoForm.code,
                description: promoForm.description || undefined,
                discountType: promoForm.discountType,
                discountValue: Number(promoForm.discountValue),
                maxDiscountAmount: promoForm.maxDiscountAmount ? Number(promoForm.maxDiscountAmount) : undefined,
                minPurchaseAmount: Number(promoForm.minPurchaseAmount) || 0,
                expiryDate: promoForm.expiryDate + ':00',
            }
            await generatePromo(payload)
            setMessage({ type: 'success', text: `Promo "${promoForm.code}" berhasil dibuat.` })
            setPromoForm(initialPromoForm)
            await fetchPromos()
        } catch (err) {
            const data = err.response?.data
            if (data?.fieldErrors && Object.keys(data.fieldErrors).length > 0) {
                setFieldErrors(data.fieldErrors)
            } else {
                setMessage({ type: 'error', text: data?.message || 'Gagal membuat promo.' })
            }
        } finally {
            setSubmitting(false)
        }
    }

    const handleViewDetail = async (type, id) => {
        try {
            const res = type === 'VOUCHER' ? await getVoucherDetail(id) : await getPromoDetail(id)
            setSelectedItem({ type, data: res.data.data })
        } catch {
            setMessage({ type: 'error', text: `Gagal memuat detail ${type.toLowerCase()}.` })
        }
    }

    const handleSectionClick = (key) => {
        if (key === 'overdue') return
        if (key === 'vouchers') { setActiveTab('vouchers'); setMessage({ type: '', text: '' }); return }
        if (key === 'promos')   { setActiveTab('promos');   setMessage({ type: '', text: '' }); return }

        let fetchFn, title, columns, renderRow

        if (key === 'users') {
            fetchFn = getAdminUsers
            title = 'Daftar Pengguna'
            columns = ['Username', 'Email', 'Role', 'Dibuat']
            renderRow = (u) => (
                <tr key={u.id} className="border-b border-slate-50 hover:bg-red-50/40 transition cursor-pointer"
                    onClick={() => navigate(`/dashboard/admin/users/${u.id}`)}>
                    <td className="px-4 py-3 font-medium text-slate-700">{u.username}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{u.email}</td>
                    <td className="px-4 py-3">
                        {u.isAdmin
                            ? <span className="badge-red">Admin</span>
                            : <span className="badge-slate">{u.roles.join(', ')}</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{formatDate(u.createdAt)}</td>
                </tr>
            )
        } else if (key === 'stores') {
            fetchFn = getAllStores
            title = 'Daftar Toko'
            columns = ['Nama Toko', 'Pemilik', 'Dibuat']
            renderRow = (s) => (
                <tr key={s.id} className="border-b border-slate-50 hover:bg-red-50/40 transition cursor-pointer"
                    onClick={() => navigate(`/stores/${s.id}`)}>
                    <td className="px-4 py-3 font-medium text-slate-700">{s.name}</td>
                    <td className="px-4 py-3 text-slate-600">{s.ownerUsername}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{formatDate(s.createdAt)}</td>
                </tr>
            )
        } else if (key === 'products') {
            fetchFn = () => api.get('/products')
            title = 'Daftar Produk'
            columns = ['Nama Produk', 'Toko', 'Harga', 'Stok']
            renderRow = (p) => (
                <tr key={p.id} className="border-b border-slate-50 hover:bg-red-50/40 transition cursor-pointer"
                    onClick={() => navigate(`/products/${p.id}`)}>
                    <td className="px-4 py-3 font-medium text-slate-700">{p.name}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{p.storeName}</td>
                    <td className="px-4 py-3 font-semibold text-slate-700">{formatRupiah(p.price)}</td>
                    <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            p.stock === 0 ? 'badge-red'
                                : p.stock <= 5 ? 'bg-yellow-50 text-yellow-700'
                                    : 'badge-emerald'
                        }`}>{p.stock}</span>
                    </td>
                </tr>
            )
        } else if (key === 'orders') {
            fetchFn = getAdminOrders
            title = 'Daftar Pesanan'
            columns = ['Toko', 'Buyer', 'Status', 'Total', 'Dibuat']
            renderRow = (o) => (
                <tr key={o.id} className="border-b border-slate-50 hover:bg-red-50/40 transition cursor-pointer"
                    onClick={() => navigate(`/dashboard/admin/orders/${o.id}`)}>
                    <td className="px-4 py-3 font-medium text-slate-700">{o.storeName}</td>
                    <td className="px-4 py-3 text-slate-600">{o.buyerUsername}</td>
                    <td className="px-4 py-3"><span className="badge-slate">{o.statusLabel}</span></td>
                    <td className="px-4 py-3 text-slate-700 font-semibold">{formatRupiah(o.totalAmount)}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{formatDate(o.createdAt)}</td>
                </tr>
            )
        } else if (key === 'delivery-jobs') {
            fetchFn = getAdminDeliveryJobs
            title = 'Daftar Delivery Jobs'
            columns = ['Toko', 'Driver', 'Status', 'Dibuat']
            renderRow = (j) => (
                <tr key={j.id} className="border-b border-slate-50 hover:bg-red-50/40 transition cursor-pointer"
                    onClick={() => setDetailItem({ type: 'delivery-job', data: j })}>
                    <td className="px-4 py-3 font-medium text-slate-700">{j.storeName}</td>
                    <td className="px-4 py-3 text-slate-600">{j.driverId ? j.driverId.slice(0, 8) + '...' : <span className="text-xs text-slate-400">Belum ada</span>}</td>
                    <td className="px-4 py-3"><span className="badge-slate">{j.orderStatusLabel}</span></td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{formatDate(j.createdAt)}</td>
                </tr>
            )
        } else return

        setModalLoading(true)
        setModalList({ title, columns, renderRow })
        fetchFn()
            .then(res => setModalData(res.data.data || []))
            .catch(() => setModalData([]))
            .finally(() => setModalLoading(false))
    }

    const tabs = [
        { key: 'monitoring', label: 'Monitoring' },
        { key: 'vouchers',   label: 'Voucher' },
        { key: 'promos',     label: 'Promo' },
    ]

    const inputClass = "input-field w-full focus:ring-red-300"

    return (
        <MainLayout>
            <div className="mb-6 animate-fade-in">
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Dashboard</span>
                <h1 className="text-2xl font-bold text-slate-800 mt-1">Halo, {decoded?.username}!</h1>
                <p className="text-slate-400 text-sm mt-1">Monitoring &amp; Manajemen Diskon</p>
            </div>

            {message.text && (
                <div className={`mb-4 text-sm rounded-lg px-3 py-2.5 border animate-fade-in ${
                    message.type === 'success'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-red-50 border-red-200 text-red-600'
                }`}>{message.text}</div>
            )}

            {/* Time Simulation Panel */}
            <div className="border border-ocean-200 rounded-lg p-4 mb-6 animate-slide-up">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-bold text-ocean-700">⏰ Simulasi Waktu</span>
                    {simulationOffset > 0 ? (
                        <span className="text-xs bg-white text-red-600 px-3 py-1 rounded-full font-semibold border border-red-200 shadow-sm">
                            +{simulationOffset} menit {simulatedNow && `(~ ${formatDate(simulatedNow)})`}
                        </span>
                    ) : (
                        <span className="text-xs text-slate-500">Waktu nyata</span>
                    )}
                    <div className="flex items-center gap-1 ml-auto flex-wrap">
                        {[{ label: '+30m', val: 30 }, { label: '+1j', val: 60 }, { label: '+6j', val: 360 }, { label: '+1h', val: 1440 }].map(btn => (
                            <button key={btn.val} onClick={() => handleAdvanceTime(btn.val)} disabled={simulating}
                                    className="text-xs font-semibold bg-white text-slate-600 hover:bg-red-50 hover:text-red-600 px-3 py-1.5 rounded-lg border border-slate-200 transition disabled:opacity-50 shadow-card">
                                {btn.label}
                            </button>
                        ))}
                        <div className="flex items-center gap-1 ml-2">
                            <input
                                type="number" min="1" value={simulationInput}
                                onChange={e => setSimulationInput(e.target.value)}
                                placeholder="menit"
                                className="input-field w-20 text-xs px-2 py-1.5"
                            />
                            <button
                                onClick={() => { const m = parseInt(simulationInput); if (m > 0) handleAdvanceTime(m); setSimulationInput('') }}
                                disabled={simulating || !simulationInput}
                                className="text-xs font-semibold bg-red-500 text-white hover:bg-red-600 px-3 py-1.5 rounded-lg transition disabled:opacity-50 shadow-card"
                            >
                                Majukan
                            </button>
                        </div>
                        {simulationOffset > 0 && (
                            <button onClick={handleResetTime} disabled={simulating}
                                    className="text-xs font-semibold text-red-500 hover:text-red-700 px-3 py-1.5 transition">
                                Reset
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-red-100 rounded-lg p-1 w-fit animate-fade-in overflow-x-auto">
                {tabs.map(t => (
                    <button key={t.key}
                            onClick={() => { setActiveTab(t.key); setMessage({ type: '', text: '' }); setFieldErrors({}) }}
                            className={`px-5 py-2 text-sm font-semibold rounded-md transition ${
                                activeTab === t.key ? 'bg-white text-red-800 shadow-sm' : 'text-red-600 hover:text-red-800'
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {activeTab === 'monitoring' && (
                monitoringLoading
                    ? <div className="text-center py-16 text-slate-400">Memuat data monitoring...</div>
                    : <MonitoringTab data={monitoringData} onNavigate={handleSectionClick} />
            )}

            {activeTab === 'vouchers' && (
                listLoading ? <div className="text-center py-16 text-slate-400">Memuat data...</div> : (
                    <div className="space-y-6 animate-slide-up">
                        <div className="card-hover p-4">
                            <h2 className="font-bold text-slate-700 text-base mb-3">Buat Voucher Baru</h2>
                            <form onSubmit={handleCreateVoucher} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div><label className="block text-xs font-semibold text-slate-500 mb-1">Kode Voucher</label><input name="code" value={voucherForm.code} onChange={handleVoucherChange} required className={`${inputClass} ${fieldErrors.code ? 'input-error' : ''}`} placeholder="CONTOH50" />{fieldErrors.code && <p className="text-xs text-red-500 mt-0.5">{fieldErrors.code}</p>}</div>
                                <div><label className="block text-xs font-semibold text-slate-500 mb-1">Tipe Diskon</label><select name="discountType" value={voucherForm.discountType} onChange={handleVoucherChange} className={inputClass}><option value="PERCENTAGE">Persen (%)</option><option value="FIXED">Nominal (Rp)</option></select></div>
                                <div><label className="block text-xs font-semibold text-slate-500 mb-1">Nilai Diskon</label><input name="discountValue" type="number" value={voucherForm.discountValue} onChange={handleVoucherChange} required min="1" className={`${inputClass} ${fieldErrors.discountValue ? 'input-error' : ''}`} placeholder={voucherForm.discountType === 'PERCENTAGE' ? '10' : '5000'} />{fieldErrors.discountValue && <p className="text-xs text-red-500 mt-0.5">{fieldErrors.discountValue}</p>}</div>
                                <div><label className="block text-xs font-semibold text-slate-500 mb-1">Maks Diskon (kosongkan jika %)</label><input name="maxDiscountAmount" type="number" value={voucherForm.maxDiscountAmount} onChange={handleVoucherChange} min="1" className={inputClass} placeholder="Rp" /></div>
                                <div><label className="block text-xs font-semibold text-slate-500 mb-1">Min Pembelian</label><input name="minPurchaseAmount" type="number" value={voucherForm.minPurchaseAmount} onChange={handleVoucherChange} min="0" className={inputClass} placeholder="0" /></div>
                                <div><label className="block text-xs font-semibold text-slate-500 mb-1">Batas Pemakaian</label><input name="usageLimit" type="number" value={voucherForm.usageLimit} onChange={handleVoucherChange} required min="1" className={`${inputClass} ${fieldErrors.usageLimit ? 'input-error' : ''}`} placeholder="100" />{fieldErrors.usageLimit && <p className="text-xs text-red-500 mt-0.5">{fieldErrors.usageLimit}</p>}</div>
                                <div><label className="block text-xs font-semibold text-slate-500 mb-1">Berlaku Sampai</label><input name="expiryDate" type="datetime-local" value={voucherForm.expiryDate} onChange={handleVoucherChange} required className={`${inputClass} ${fieldErrors.expiryDate ? 'input-error' : ''}`} />{fieldErrors.expiryDate && <p className="text-xs text-red-500 mt-0.5">{fieldErrors.expiryDate}</p>}</div>
                                <div className="md:col-span-2 lg:col-span-3"><label className="block text-xs font-semibold text-slate-500 mb-1">Deskripsi (opsional)</label><input name="description" value={voucherForm.description} onChange={handleVoucherChange} className={inputClass} placeholder="Deskripsi voucher" /></div>
                                <div className="md:col-span-2 lg:col-span-3 flex justify-end">
                                    <Button type="submit" disabled={submitting}>{submitting ? 'Menyimpan...' : 'Buat Voucher'}</Button>
                                </div>
                            </form>
                        </div>

                        <div className="card-hover p-4">
                            <h2 className="font-bold text-slate-700 text-base mb-3">Daftar Voucher</h2>
                            {vouchers.length === 0 ? (
                                <p className="text-sm text-slate-400 text-center py-8">Belum ada voucher.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead><tr className="text-left text-xs text-slate-500 uppercase border-b border-slate-100">
                                            <th className="px-3 py-3">Kode</th><th className="px-3 py-3">Diskon</th><th className="px-3 py-3">Min Beli</th><th className="px-3 py-3">Sisa</th><th className="px-3 py-3">Expiry</th><th className="px-3 py-3">Status</th><th className="px-3 py-3"></th>
                                        </tr></thead>
                                        <tbody>
                                        {vouchers.map(v => (
                                            <tr key={v.id} className="border-b border-slate-50 hover:bg-red-50/40 transition">
                                                <td className="px-3 py-3 font-mono font-bold text-slate-700">{v.code}</td>
                                                <td className="px-3 py-3 text-slate-600">{v.discountType === 'PERCENTAGE' ? `${v.discountValue}%` : formatRupiah(v.discountValue)}</td>
                                                <td className="px-3 py-3 text-slate-600">{formatRupiah(v.minPurchaseAmount)}</td>
                                                <td className="px-3 py-3 text-slate-600">{v.remainingUsage ?? v.usageLimit - v.usedCount}/{v.usageLimit}</td>
                                                <td className="px-3 py-3 text-slate-500 text-xs">{formatDate(v.expiryDate)}</td>
                                                <td className="px-3 py-3">{v.expired ? <span className="badge-red">Expired</span> : v.active ? <span className="badge-emerald">Aktif</span> : <span className="badge-slate">Nonaktif</span>}</td>
                                                <td className="px-3 py-3"><button onClick={() => handleViewDetail('VOUCHER', v.id)} className="text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-3 py-1.5 rounded-lg transition">Detail</button></td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )
            )}

            {activeTab === 'promos' && (
                listLoading ? <div className="text-center py-16 text-slate-400">Memuat data...</div> : (
                    <div className="space-y-6 animate-slide-up">
                            <div className="card-hover p-4">
                            <h2 className="font-bold text-slate-700 text-base mb-3">Buat Promo Baru</h2>
                            <form onSubmit={handleCreatePromo} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div><label className="block text-xs font-semibold text-slate-500 mb-1">Kode Promo</label><input name="code" value={promoForm.code} onChange={handlePromoChange} required className={`${inputClass} ${fieldErrors.code ? 'input-error' : ''}`} placeholder="PROMO60" />{fieldErrors.code && <p className="text-xs text-red-500 mt-0.5">{fieldErrors.code}</p>}</div>
                                <div><label className="block text-xs font-semibold text-slate-500 mb-1">Tipe Diskon</label><select name="discountType" value={promoForm.discountType} onChange={handlePromoChange} className={inputClass}><option value="PERCENTAGE">Persen (%)</option><option value="FIXED">Nominal (Rp)</option></select></div>
                                <div><label className="block text-xs font-semibold text-slate-500 mb-1">Nilai Diskon</label><input name="discountValue" type="number" value={promoForm.discountValue} onChange={handlePromoChange} required min="1" className={`${inputClass} ${fieldErrors.discountValue ? 'input-error' : ''}`} placeholder={promoForm.discountType === 'PERCENTAGE' ? '10' : '5000'} />{fieldErrors.discountValue && <p className="text-xs text-red-500 mt-0.5">{fieldErrors.discountValue}</p>}</div>
                                <div><label className="block text-xs font-semibold text-slate-500 mb-1">Maks Diskon (kosongkan jika %)</label><input name="maxDiscountAmount" type="number" value={promoForm.maxDiscountAmount} onChange={handlePromoChange} min="1" className={inputClass} placeholder="Rp" /></div>
                                <div><label className="block text-xs font-semibold text-slate-500 mb-1">Min Pembelian</label><input name="minPurchaseAmount" type="number" value={promoForm.minPurchaseAmount} onChange={handlePromoChange} min="0" className={inputClass} placeholder="0" /></div>
                                <div><label className="block text-xs font-semibold text-slate-500 mb-1">Berlaku Sampai</label><input name="expiryDate" type="datetime-local" value={promoForm.expiryDate} onChange={handlePromoChange} required className={`${inputClass} ${fieldErrors.expiryDate ? 'input-error' : ''}`} />{fieldErrors.expiryDate && <p className="text-xs text-red-500 mt-0.5">{fieldErrors.expiryDate}</p>}</div>
                                <div className="md:col-span-2 lg:col-span-3"><label className="block text-xs font-semibold text-slate-500 mb-1">Deskripsi (opsional)</label><input name="description" value={promoForm.description} onChange={handlePromoChange} className={inputClass} placeholder="Deskripsi promo" /></div>
                                <div className="md:col-span-2 lg:col-span-3 flex justify-end">
                                    <Button type="submit" disabled={submitting}>{submitting ? 'Menyimpan...' : 'Buat Promo'}</Button>
                                </div>
                            </form>
                        </div>

                            <div className="card-hover p-4">
                            <h2 className="font-bold text-slate-700 text-base mb-3">Daftar Promo</h2>
                            {promos.length === 0 ? (
                                <p className="text-sm text-slate-400 text-center py-8">Belum ada promo.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead><tr className="text-left text-xs text-slate-500 uppercase border-b border-slate-100">
                                            <th className="px-3 py-3">Kode</th><th className="px-3 py-3">Diskon</th><th className="px-3 py-3">Min Beli</th><th className="px-3 py-3">Expiry</th><th className="px-3 py-3">Status</th><th className="px-3 py-3"></th>
                                        </tr></thead>
                                        <tbody>
                                        {promos.map(p => (
                                            <tr key={p.id} className="border-b border-slate-50 hover:bg-red-50/40 transition">
                                                <td className="px-3 py-3 font-mono font-bold text-slate-700">{p.code}</td>
                                                <td className="px-3 py-3 text-slate-600">{p.discountType === 'PERCENTAGE' ? `${p.discountValue}%` : formatRupiah(p.discountValue)}</td>
                                                <td className="px-3 py-3 text-slate-600">{formatRupiah(p.minPurchaseAmount)}</td>
                                                <td className="px-3 py-3 text-slate-500 text-xs">{formatDate(p.expiryDate)}</td>
                                                <td className="px-3 py-3">{p.expired ? <span className="badge-red">Expired</span> : p.active ? <span className="badge-emerald">Aktif</span> : <span className="badge-slate">Nonaktif</span>}</td>
                                                <td className="px-3 py-3"><button onClick={() => handleViewDetail('PROMO', p.id)} className="text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-3 py-1.5 rounded-lg transition">Detail</button></td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )
            )}

            {selectedItem && <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}

            {detailItem && detailItem.type === 'delivery-job' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in" onClick={() => setDetailItem(null)}>
                    <div className="card p-6 max-w-md w-full mx-4 shadow-xl animate-slide-up" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-800 text-lg">Detail Delivery Job</h3>
                            <button onClick={() => setDetailItem(null)} className="text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div><p className="text-xs font-semibold text-slate-400 uppercase">Order ID</p><p className="font-mono text-xs text-slate-800">{detailItem.data.id}</p></div>
                            <div><p className="text-xs font-semibold text-slate-400 uppercase">Toko</p><p className="font-medium text-slate-800">{detailItem.data.storeName}</p></div>
                            <div><p className="text-xs font-semibold text-slate-400 uppercase">Driver</p><p className="font-medium text-slate-800">{detailItem.data.driverId || 'Belum ada'}</p></div>
                            <div><p className="text-xs font-semibold text-slate-400 uppercase">Status</p><p className="font-medium text-slate-800">{detailItem.data.orderStatusLabel}</p></div>
                            <div><p className="text-xs font-semibold text-slate-400 uppercase">Dibuat</p><p className="font-medium text-slate-800">{formatDate(detailItem.data.createdAt)}</p></div>
                        </div>
                    </div>
                </div>
            )}

            {modalList && (
                <ListModal
                    title={modalList.title}
                    columns={modalList.columns}
                    items={modalData}
                    loading={modalLoading}
                    onClose={() => { setModalList(null); setModalData([]) }}
                    renderRow={modalList.renderRow}
                />
            )}
        </MainLayout>
    )
}

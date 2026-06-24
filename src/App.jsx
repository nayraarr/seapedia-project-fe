import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/useAuth'
import { useCart } from './contexts/useCart'
import ProfilePage from './pages/dashboard/ProfilePage'
import StoreManagementPage from './pages/dashboard/seller/StoreManagementPage'
import StoresPage from './pages/public/StoresPage'
import StoreDetailPage from './pages/public/StoreDetailPage'
import ProductManagementPage from './pages/dashboard/seller/ProductManagementPage'
import ProductFormPage from './pages/dashboard/seller/ProductFormPage'
import WalletPage from './pages/dashboard/buyer/WalletPage'
import AddressManagementPage from './pages/dashboard/buyer/AddressManagementPage'
import CartPage from './pages/dashboard/buyer/CartPage'
import OrderHistoryPage from './pages/dashboard/buyer/OrderHistoryPage'
import OrderDetailPage from './pages/dashboard/buyer/OrderDetailPage'
import SpendingReportPage from './pages/dashboard/buyer/SpendingReportPage'
import IncomeReportPage from './pages/dashboard/seller/IncomeReportPage'

// public pages
import HomePage from './pages/public/HomePage'
import ProductsPage from './pages/public/ProductsPage'
import ProductDetailPage from './pages/public/ProductDetailPage'
import LoginPage from './pages/public/LoginPage'
import RegisterPage from './pages/public/RegisterPage'

// auth pages
import SelectRolePage from './pages/auth/SelectRolePage'

// dashboard shells
import BuyerDashboard from './pages/dashboard/buyer/BuyerDashboard'
import SellerDashboard from './pages/dashboard/seller/SellerDashboard'
import DriverDashboard from './pages/dashboard/driver/DriverDashboard'
import AvailableJobsPage from './pages/dashboard/driver/AvailableJobsPage'
import DriverJobDetailPage from './pages/dashboard/driver/DriverJobDetailPage'
import ActiveJobsPage from './pages/dashboard/driver/ActiveJobsPage'
import DriverIncomeReportPage from './pages/dashboard/driver/DriverIncomeReportPage'
import AdminDashboard from './pages/dashboard/admin/AdminDashboard'
import AdminOrderDetailPage from './pages/dashboard/admin/AdminOrderDetailPage'
import AdminUserDetailPage from './pages/dashboard/admin/AdminUserDetailPage'
import IncomingOrdersPage from './pages/dashboard/seller/IncomingOrdersPage'
import SellerOrderDetailPage from './pages/dashboard/seller/OrderDetailPage'
import NotFound from './pages/NotFound'
import Toast from './components/ui/Toast'

// route guards
function ProtectedRoute({ children, requiredRole, allowedRoles }) {
  const { token, activeRole } = useAuth()
  if (!token) return <Navigate to="/login" />
  const roles = allowedRoles || (requiredRole ? [requiredRole] : null)
  if (roles && !roles.includes(activeRole)) {
    if (!activeRole) return <Navigate to="/select-role" />
    return <Navigate to={`/dashboard/${activeRole.toLowerCase()}`} />
  }
  return children
}


export default function App() {
  const { toast, dismissToast } = useCart()

  return (
      <BrowserRouter>
        <Toast message={toast} onClose={dismissToast} />
        <Routes>
          {/* public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/stores/:id" element={<StoreDetailPage />} />

          {/* role selection */}
          <Route path="/select-role" element={
            <ProtectedRoute><SelectRolePage /></ProtectedRoute>
          } />

          {/* dashboards */}
          <Route path="/dashboard/buyer" element={
            <ProtectedRoute requiredRole="BUYER"><BuyerDashboard /></ProtectedRoute>
          } />
          <Route path="/dashboard/buyer/cart" element={
            <ProtectedRoute requiredRole="BUYER"><CartPage /></ProtectedRoute>
          } />
          <Route path="/dashboard/buyer/orders" element={
            <ProtectedRoute requiredRole="BUYER"><OrderHistoryPage /></ProtectedRoute>
          } />
          <Route path="/dashboard/buyer/orders/:orderId" element={
            <ProtectedRoute requiredRole="BUYER"><OrderDetailPage /></ProtectedRoute>
          } />
          <Route path="/dashboard/buyer/wallet" element={
            <ProtectedRoute requiredRole="BUYER"><WalletPage /></ProtectedRoute>
          } />
          <Route path="/dashboard/buyer/addresses" element={
            <ProtectedRoute requiredRole="BUYER"><AddressManagementPage /></ProtectedRoute>
          } />
          <Route path="/dashboard/buyer/report" element={
            <ProtectedRoute requiredRole="BUYER"><SpendingReportPage /></ProtectedRoute>
          } />
          <Route path="/dashboard/seller" element={
            <ProtectedRoute requiredRole="SELLER"><SellerDashboard /></ProtectedRoute>
          } />
          <Route path="/dashboard/seller/store" element={
            <ProtectedRoute requiredRole="SELLER"><StoreManagementPage /></ProtectedRoute>
          } />
          <Route path="/dashboard/seller/products" element={
            <ProtectedRoute allowedRoles={['SELLER']}><ProductManagementPage /></ProtectedRoute>
          } />
          <Route path="/dashboard/seller/products/new" element={
            <ProtectedRoute allowedRoles={['SELLER']}><ProductFormPage /></ProtectedRoute>
          } />
          <Route path="/dashboard/seller/products/edit/:id" element={
            <ProtectedRoute allowedRoles={['SELLER']}><ProductFormPage /></ProtectedRoute>
          } />
          <Route path="/dashboard/seller/orders/incoming" element={
            <ProtectedRoute allowedRoles={['SELLER']}><IncomingOrdersPage /></ProtectedRoute>
          } />
          <Route path="/dashboard/seller/orders/:orderId" element={
            <ProtectedRoute allowedRoles={['SELLER']}><SellerOrderDetailPage /></ProtectedRoute>
          } />
          <Route path="/dashboard/seller/report" element={
            <ProtectedRoute allowedRoles={['SELLER']}><IncomeReportPage /></ProtectedRoute>
          } />
          <Route path="/dashboard/driver" element={
            <ProtectedRoute requiredRole="DRIVER"><DriverDashboard /></ProtectedRoute>
          } />
          <Route path="/dashboard/driver/jobs" element={
            <ProtectedRoute requiredRole="DRIVER"><AvailableJobsPage /></ProtectedRoute>
          } />
          <Route path="/dashboard/driver/jobs/:jobId" element={
            <ProtectedRoute requiredRole="DRIVER"><DriverJobDetailPage /></ProtectedRoute>
          } />
          <Route path="/dashboard/driver/active" element={
            <ProtectedRoute requiredRole="DRIVER"><ActiveJobsPage /></ProtectedRoute>
          } />
          <Route path="/dashboard/driver/report" element={
            <ProtectedRoute requiredRole="DRIVER"><DriverIncomeReportPage /></ProtectedRoute>
          } />
          <Route path="/dashboard/admin" element={
            <ProtectedRoute requiredRole="ADMIN"><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/dashboard/admin/orders/:orderId" element={
            <ProtectedRoute requiredRole="ADMIN"><AdminOrderDetailPage /></ProtectedRoute>
          } />
          <Route path="/dashboard/admin/users/:userId" element={
            <ProtectedRoute requiredRole="ADMIN"><AdminUserDetailPage /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
  )
}

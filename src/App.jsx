import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthProvider'
import { useAuth } from './contexts/useAuth'
import ProfilePage from './pages/dashboard/ProfilePage'
import StoreManagementPage from './pages/dashboard/seller/StoreManagementPage'
import StoresPage from './pages/public/StoresPage'
import StoreDetailPage from './pages/public/StoreDetailPage'
import ProductManagementPage from './pages/dashboard/seller/ProductManagementPage'
import ProductFormPage from './pages/dashboard/seller/ProductFormPage'
import WalletPage from './pages/dashboard/buyer/WalletPage'
import AddressManagementPage from './pages/dashboard/buyer/AddressManagementPage'

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
import AdminDashboard from './pages/dashboard/admin/AdminDashboard'
import NotFound from './pages/NotFound'

// route guards
function ProtectedRoute({ children, requiredRole }) {
  const { token, activeRole } = useAuth()
  if (!token) return <Navigate to="/login" />
  if (requiredRole && activeRole !== requiredRole) {
    if (!activeRole) return <Navigate to="/select-role" />
    return <Navigate to={`/dashboard/${activeRole.toLowerCase()}`} />
  }
  return children
}


export default function App() {
  return (
      <AuthProvider>
        <BrowserRouter>
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
            <Route path="/dashboard/buyer/wallet" element={
              <ProtectedRoute requiredRole="BUYER"><WalletPage /></ProtectedRoute>
            } />
            <Route path="/dashboard/buyer/addresses" element={
              <ProtectedRoute requiredRole="BUYER"><AddressManagementPage /></ProtectedRoute>
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
            <Route path="/dashboard/driver" element={
              <ProtectedRoute requiredRole="DRIVER"><DriverDashboard /></ProtectedRoute>
            } />
            <Route path="/dashboard/admin" element={
              <ProtectedRoute requiredRole="ADMIN"><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
  )
}
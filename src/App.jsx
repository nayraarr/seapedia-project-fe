import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthProvider'
import { useAuth } from './contexts/useAuth'
import ProfilePage from './pages/dashboard/ProfilePage'

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
  if (requiredRole && activeRole !== requiredRole) return <Navigate to="/select-role" />
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

            {/* role selection */}
            <Route path="/select-role" element={
              <ProtectedRoute><SelectRolePage /></ProtectedRoute>
            } />

            {/* dashboards */}
            <Route path="/dashboard/buyer" element={
              <ProtectedRoute requiredRole="BUYER"><BuyerDashboard /></ProtectedRoute>
            } />
            <Route path="/dashboard/seller" element={
              <ProtectedRoute requiredRole="SELLER"><SellerDashboard /></ProtectedRoute>
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
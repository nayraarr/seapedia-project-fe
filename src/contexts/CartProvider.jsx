import { useEffect, useState, useCallback, useMemo } from 'react'
import { CartContext } from './cartContext'
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../services/cartApi'
import { useAuth } from './useAuth'

export function CartProvider({ children }) {
    const [cart, setCart] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [toast, setToast] = useState(null)
    const { token, activeRole } = useAuth()
    const isBuyer = activeRole === 'BUYER'

    const fetchCart = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await getCart()
            setCart(res.data.data)
        } catch {
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (token && isBuyer) {
            const loadCart = async () => {
                await fetchCart()
            }
            loadCart()
        } else {
            queueMicrotask(() => {
                setCart(null)
                setError(null)
                setToast(null)
            })
        }
    }, [token, isBuyer, fetchCart])

    useEffect(() => {
        if (!toast) return undefined
        const timer = setTimeout(() => setToast(null), 4500)
        return () => clearTimeout(timer)
    }, [toast])

    const notifyError = useCallback((message) => {
        setError(message)
        setToast({ message, type: 'error', title: 'Keranjang' })
    }, [])

    const dismissToast = useCallback(() => {
        setToast(null)
    }, [])

    const notify = useCallback((message, type, title) => {
        setToast({ message, type: type || 'info', title })
    }, [])

    const add = useCallback(async (productId, quantity = 1, storeId) => {
        setError(null)
        if (storeId && cart?.storeId && cart?.items?.length > 0 && cart.storeId !== storeId) {
            const msg = `Keranjang sudah berisi produk dari toko lain. Selesaikan atau kosongkan keranjang sebelum berbelanja dari toko lain.`
            notifyError(msg)
            return { ok: false, message: msg }
        }
        try {
            const res = await addToCart(productId, quantity)
            setCart(res.data.data)
            return { ok: true }
        } catch (err) {
            const msg = err.response?.data?.message || 'Gagal menambahkan ke keranjang'
            notifyError(msg)
            return { ok: false, message: msg }
        }
    }, [notifyError, cart])

    const update = useCallback(async (cartItemId, quantity) => {
        setError(null)
        try {
            const res = await updateCartItem(cartItemId, quantity)
            setCart(res.data.data)
            return { ok: true }
        } catch (err) {
            const msg = err.response?.data?.message || 'Gagal memperbarui keranjang'
            notifyError(msg)
            return { ok: false, message: msg }
        }
    }, [notifyError])

    const remove = useCallback(async (cartItemId) => {
        setError(null)
        try {
            const res = await removeCartItem(cartItemId)
            setCart(res.data.data)
            return { ok: true }
        } catch (err) {
            const msg = err.response?.data?.message || 'Gagal menghapus item'
            notifyError(msg)
            return { ok: false, message: msg }
        }
    }, [notifyError])

    const clear = useCallback(async () => {
        setError(null)
        try {
            await clearCart()
            setCart(null)
            return { ok: true }
        } catch (err) {
            const msg = err.response?.data?.message || 'Gagal mengosongkan keranjang'
            notifyError(msg)
            return { ok: false, message: msg }
        }
    }, [notifyError])

    const itemCount = cart?.totalItems ?? 0

    const value = useMemo(
        () => ({ cart, loading, error, toast, itemCount, fetchCart, add, update, remove, clear, dismissToast, notify }),
        [cart, loading, error, toast, itemCount, fetchCart, add, update, remove, clear, dismissToast, notify]
    )

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

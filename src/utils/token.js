export const isTokenExpired = (tkn) => {
    if (!tkn) return true
    try {
        const payload = JSON.parse(atob(tkn.split('.')[1]))
        return payload.exp * 1000 < Date.now()
    } catch {
        return true
    }
}

export const isTokenExpiringSoon = (tkn, thresholdMinutes = 2) => {
    if (!tkn) return true
    try {
        const payload = JSON.parse(atob(tkn.split('.')[1]))
        const expiresAt = payload.exp * 1000
        const threshold = thresholdMinutes * 60 * 1000
        return expiresAt - Date.now() < threshold
    } catch {
        return true
    }
}

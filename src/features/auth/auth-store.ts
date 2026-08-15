import { logoutAction } from "@/features/auth/actions"

type Tokens = { accessToken: string | null; refreshToken: string | null }

let tokens: Tokens = { accessToken: null, refreshToken: null }
const logoutListeners = new Set<() => void>()

export const authStore = {
  getTokens: () => tokens,
  setTokens: (next: Tokens) => {
    tokens = next
  },
  onLogout: (listener: () => void) => {
    logoutListeners.add(listener)
    return () => {
      logoutListeners.delete(listener)
    }
  },
  logout: async (options: { reload?: boolean } = {}) => {
    tokens = { accessToken: null, refreshToken: null }
    await logoutAction()
    logoutListeners.forEach((listener) => listener())
    if (options.reload) window.location.reload()
  },
}

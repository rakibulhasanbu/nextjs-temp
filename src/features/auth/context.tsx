"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"

import { authStore } from "@/features/auth/auth-store"
import { User } from "@/features/auth/types"

type AuthContextValue = {
  user: User | null
  state: "loading" | "success"
  setUser: (user: User) => void
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void
  logout: (options?: { reload?: boolean }) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

type Props = {
  children: React.ReactNode
  initialUser?: User
  initialAccessToken?: string
  initialRefreshToken?: string
}

export const AuthProvider = ({ children, initialUser, initialAccessToken, initialRefreshToken }: Props) => {
  const [user, setUserState] = useState<User | null>(initialUser ?? null)
  const [state, setState] = useState<"loading" | "success">("loading")
  const hasInitialized = useRef(false)

  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true

    if (initialAccessToken && initialRefreshToken) {
      authStore.setTokens({ accessToken: initialAccessToken, refreshToken: initialRefreshToken })
    }
    setState("success")
  }, [initialAccessToken, initialRefreshToken])

  useEffect(() => {
    return authStore.onLogout(() => setUserState(null))
  }, [])

  const setUser = useCallback((next: User) => setUserState(next), [])

  const setTokens = useCallback((next: { accessToken: string; refreshToken: string }) => {
    authStore.setTokens(next)
  }, [])

  const logout = useCallback((options?: { reload?: boolean }) => authStore.logout(options), [])

  const value = useMemo(
    () => ({ user, state, setUser, setTokens, logout }),
    [user, state, setUser, setTokens, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

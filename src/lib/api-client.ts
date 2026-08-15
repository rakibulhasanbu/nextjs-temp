import { toast } from "sonner"

import { config } from "@/config"
import { revalidateTokensAction } from "@/features/auth/actions"
import { authStore } from "@/features/auth/auth-store"
import { METHOD } from "@/lib/api-types"

const API_BASE_URL = config.serverUrl

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

type RequestOptions = {
  method?: string
  body?: unknown
  params?: Record<string, string | number | string[] | undefined>
  skipAuthRetry?: boolean
}

const buildUrl = (path: string, params?: RequestOptions["params"]) => {
  const url = new URL(`${API_BASE_URL}${path}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined) return
      if (Array.isArray(value)) value.forEach((v) => url.searchParams.append(key, v))
      else url.searchParams.append(key, String(value))
    })
  }
  return url.toString()
}

const rawFetch = async (path: string, options: RequestOptions = {}) => {
  const { accessToken } = authStore.getTokens()
  const response = await fetch(buildUrl(path, options.params), {
    method: options.method ?? METHOD.GET,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: accessToken } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
  const data = await response.json().catch(() => null)
  return { response, data }
}

const refreshAccessToken = async () => {
  const { refreshToken } = authStore.getTokens()
  if (!refreshToken) return false

  const { response, data } = await rawFetch("/auth/refresh-token", {
    method: METHOD.POST,
    body: { refreshToken },
    skipAuthRetry: true,
  })

  const accessToken = data?.data?.accessToken as string | undefined
  if (!response.ok || !accessToken) return false

  authStore.setTokens({ accessToken, refreshToken })
  await revalidateTokensAction(accessToken, refreshToken)
  return true
}

export const apiFetch = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  let { response, data } = await rawFetch(path, options)

  if (response.status === 401 && !options.skipAuthRetry) {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      ;({ response, data } = await rawFetch(path, options))
    } else {
      toast.error("Session expired")
      await authStore.logout({ reload: true })
      throw new ApiError("Session expired", 401)
    }
  }

  if (!response.ok) {
    throw new ApiError(data?.message || "Something went wrong", response.status)
  }

  return data as T
}

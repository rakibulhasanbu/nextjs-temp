"use server"

import { cookies } from "next/headers"

import { config } from "@/config"
import { User } from "@/features/auth/types"

export const loginAction = async (email: string, password: string) => {
  try {
    const response = await fetch(`${config.serverUrl}/auth/signin`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        status: "error",
        error: data.message || "Invalid credentials",
      }
    }

    const { accessToken, refreshToken, user } = data.data

    await setTokensToCookies(accessToken, refreshToken)

    if (user) {
      await setUserToCookies(user)
    }

    return {
      status: "success",
      data: data.data,
    }
  } catch (error) {
    console.error(error)
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Something went wrong",
    }
  }
}

interface RegisterActionProps {
  name: string
  email: string
  password: string
}
export const registerAction = async ({ name, email, password }: RegisterActionProps) => {
  try {
    const response = await fetch(`${config.serverUrl}/auth/signup`, {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        status: "error",
        error: data.message || "Invalid credentials",
      }
    }

    const { accessToken, refreshToken, user } = data.data

    await setTokensToCookies(accessToken, refreshToken)

    if (user) {
      await setUserToCookies(user)
    }

    return {
      status: "success",
      data: data.data,
    }
  } catch (error) {
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Something went wrong",
    }
  }
}

export const verifyEmailAction = async (email: string, token: number) => {
  try {
    const storedAccessToken = await getAccessTokenFromCookies()

    const response = await fetch(`${config.serverUrl}/auth/verify-signup-token`, {
      method: "POST",
      body: JSON.stringify({
        email,
        token,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `${storedAccessToken}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        status: "error",
        error: data.message || "Invalid OTP",
      }
    }

    const { accessToken, refreshToken, user } = data.data

    await setTokensToCookies(accessToken, refreshToken)

    if (user) {
      await setUserToCookies(user)
    }

    return {
      status: "success",
      data: data.data,
    }
  } catch (error) {
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Something went wrong",
    }
  }
}

export const loginWithGoogleAction = async (body: {
  credential?: string
  code?: string
  access_token?: string
}) => {
  try {
    const response = await fetch(`${config.serverUrl}/auth/google-login`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        status: "error",
        error: data.message || "Invalid credentials",
      }
    }

    const { accessToken, refreshToken, user } = data.data

    await setTokensToCookies(accessToken, refreshToken)

    if (user) {
      await setUserToCookies(user)
    }
    return {
      status: "success",
      data,
    }
  } catch (error) {
    console.error(error)
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Something went wrong",
    }
  }
}

export const logoutAction = async () => {
  const cookieStore = await cookies()
  cookieStore.delete({ name: "accessToken", path: "/" })
  cookieStore.delete({ name: "refreshToken", path: "/" })
}

const setTokensToCookies = async (accessToken: string, refreshToken: string) => {
  const cookieStore = await cookies()
  const base = {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
  }

  cookieStore.set("accessToken", accessToken, {
    ...base,
    maxAge: 60 * 60 * 24 * 90, // 90 days
  })

  cookieStore.set("refreshToken", refreshToken, {
    ...base,
    maxAge: 60 * 60 * 24 * 90, // 90 days
  })
}

const setUserToCookies = async (user: User) => {
  const cookieStore = await cookies()
  const base = {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
  }
  // set user to cookies
  cookieStore.set("user", JSON.stringify(user), {
    ...base,
    maxAge: 60 * 60 * 24 * 90, // 90 days
  })
}

export const revalidateTokensAction = async (accessToken: string, refreshToken: string) => {
  await setTokensToCookies(accessToken, refreshToken)
}

const getAccessTokenFromCookies = async () => {
  const cookieStore = await cookies()
  return cookieStore.get("accessToken")?.value
}

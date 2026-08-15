"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { User, UserRole } from "@/features/auth/types"
import { apiFetch } from "@/lib/api-client"
import { METHOD, PaginatedResponse, QueryParams, ResponseObject } from "@/lib/api-types"

export const useVerifySignupOTPMutation = () =>
  useMutation({
    mutationFn: (payload: { token: number }) =>
      apiFetch<{ user: User; accessToken: string }>("/auth/verify-signup-token", {
        method: METHOD.POST,
        body: payload,
      }),
  })

export const useReSendVerificationSignupOTPMutation = () =>
  useMutation({
    mutationFn: (payload: { email: string }) =>
      apiFetch<void>(`/auth/resend-signup-email/${payload.email}`, {
        method: METHOD.POST,
        body: payload,
      }),
  })

export const useGetUserQuery = () =>
  useQuery({
    queryKey: ["user", "me"],
    queryFn: () => apiFetch<ResponseObject<User>>("/user/me"),
  })

export const useGetUsersQuery = (params: QueryParams) =>
  useQuery({
    queryKey: ["users", params],
    queryFn: () => apiFetch<PaginatedResponse<User>>("/user/", { params }),
  })

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      apiFetch<void>(`/user/${id}`, { method: METHOD.PATCH, body: { role } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  })
}

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: string }) => apiFetch<void>(`/user/${id}`, { method: METHOD.DELETE }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  })
}

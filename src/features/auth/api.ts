import { User, UserRole } from "@/features/auth/types"
import { api } from "@/redux/api"
import { METHOD, PaginatedResponse, QueryParams, ResponseObject, TagType } from "@/redux/types"

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    verifySignupOTP: builder.mutation<{ user: User; accessToken: string }, { token: number }>({
      query: (payload) => ({
        url: "/auth/verify-signup-token",
        method: METHOD.POST,
        body: payload,
      }),
    }),

    reSendVerificationSignupOTP: builder.mutation<void, { email: string }>({
      query: (payload) => ({
        url: `/auth/resend-signup-email/${payload.email}`,
        method: METHOD.POST,
        body: payload,
      }),
    }),

    getUser: builder.query<ResponseObject<User>, void>({
      query: () => ({
        url: "/user/me",
        method: METHOD.GET,
      }),
      providesTags: [TagType.User],
    }),

    getUsers: builder.query<PaginatedResponse<User>, QueryParams>({
      query: (params) => ({
        url: "/user/",
        method: METHOD.GET,
        params,
      }),
      providesTags: [TagType.User],
    }),

    updateUser: builder.mutation<void, { id: string; role: UserRole }>({
      query: ({ id, role }) => ({
        url: `/user/${id}`,
        method: METHOD.PATCH,
        body: { role },
      }),
      invalidatesTags: [TagType.User],
    }),

    deleteUser: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/user/${id}`,
        method: METHOD.DELETE,
      }),
      invalidatesTags: [TagType.User],
    }),
  }),
})

export const {
  useVerifySignupOTPMutation,
  useReSendVerificationSignupOTPMutation,
  useGetUserQuery,
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = authApi

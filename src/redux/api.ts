import { config } from "@/config"
import { logoutThunk, setTokens, setTokensThunk } from "@/features/auth/slice"
import { METHOD, ResponseObject, RootState, tagTypes } from "@/redux/types"
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
  retry,
} from "@reduxjs/toolkit/query/react"
import { toast } from "sonner"

export const API_TIMEOUT = 120_000 // 2 minutes
export const API_BASE_URL = config.serverUrl

export const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  timeout: API_TIMEOUT,

  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken

    if (token) {
      headers.set("Authorization", `${token}`)
    }
    return headers
  },
})

const baseQueryWithoutAuth = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  timeout: API_TIMEOUT,
})

export const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    const refreshToken = (api.getState() as RootState).auth.refreshToken

    if (refreshToken) {
      const refreshResult = await baseQueryWithoutAuth(
        {
          url: "/auth/refresh-token",
          method: METHOD.POST,
          body: { refreshToken },
        },
        api,
        extraOptions
      )

      if (!refreshResult.error && refreshResult.data) {
        const response = refreshResult.data as ResponseObject<{
          accessToken: string
        }>
        const tokens = {
          accessToken: response.data.accessToken,
          refreshToken: refreshToken,
        }

        api.dispatch(setTokens(tokens))
        await api.dispatch(setTokensThunk(tokens))

        result = await baseQuery(args, api, extraOptions)
      } else {
        await api.dispatch(logoutThunk())
        toast.error("Session expired")
      }

      // if (refreshResult.data) {
      //     console.log("setting new token");
      //     const authData = refreshResult.data as { accessToken: string };
      //     api.dispatch({
      //         type: "auth/setToken",
      //         payload: authData.accessToken,
      //     });

      //     result = await baseQuery(args, api, extraOptions);
      // } else {
      //     api.dispatch({ type: "auth/logout" });
      //     toast.error("Session expired");
      // }
    } else {
      api.dispatch({ type: "auth/logout" })
    }
  }

  return result
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: retry(baseQueryWithReAuth, { maxRetries: 0 }),
  endpoints: () => ({}),
  tagTypes: tagTypes,
})

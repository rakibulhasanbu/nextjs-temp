import { store } from "@/redux/store";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export enum TagType {
  User = "User",
}

export const tagTypes = Object.values(TagType);

export const METHOD = {
  POST: "POST",
  GET: "GET",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
};

export interface IMeta {
  limit: number;
  page: number;
  total: number;
}

export type PaginatedResponse<T> = {
  data: T[];
  meta?: IMeta;
  success: boolean;
  message: string;
  statusCode: number;
};

export type ResponseObject<T> = {
  data: T;
  message: string;
  success: boolean;
  statusCode: number;
};

export type ErrorResponse = {
  path: string | number;
  message: string;
};

export type QueryParams = {
  [key: string]: string | string[] | number | undefined;
};

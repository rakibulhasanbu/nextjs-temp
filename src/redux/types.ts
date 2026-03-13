import { store } from "@/redux/store";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export enum TagType {
    User = "User",
    Product = "Product",
    Category = "Category",
    Order = "Order",
    Customer = "Customer",
    Component = "Component",
    Media = "Media",
    Payment = "Payment",
    Brand = "Brand",
    MadeIn = "MadeIn",
    ProductModel = "ProductModel",
    ReturnOrder = "ReturnOrder",
}

export const tagTypes = Object.values(TagType);
// hi
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

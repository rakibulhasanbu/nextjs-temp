"use client";

import React from "react";

import { persister, store } from "@/redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

const ClientPersistGate = ({ children }: { children: React.ReactNode }) => {
    const isClient = typeof window !== "undefined";

    if (!isClient) {
        return <>{ children }</>;
    }

    return <PersistGate persistor={ persister }>{ children }</PersistGate>;
};

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider store={ store }>
            <ClientPersistGate>{ children }</ClientPersistGate>
        </Provider>
    );
};

/* eslint-disable */
"use client";

import React, { useState, useEffect } from "react";

import { persister, store } from "@/redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    return (
        <Provider store={ store }>
            { isHydrated ? (
                <PersistGate loading={ null } persistor={ persister }>
                    { children }
                </PersistGate>
            ) : (
                <>{ children }</>
            ) }
        </Provider>
    );
};

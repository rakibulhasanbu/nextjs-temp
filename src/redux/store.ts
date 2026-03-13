import authReducer from "@/features/auth/slice";
import { api } from "@/redux/api";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist";

import { storage } from "./storage";

const STORE_KEY_PREFIX = "invm";

const persistConfig = {
    auth: {
        key: `${STORE_KEY_PREFIX}_auth`,
        storage: storage,
        whitelist: ["accessToken", "user"],
    },
    shop: {
        key: `${STORE_KEY_PREFIX}_shop`,
        storage: storage,
        whitelist: ["shop"],
    },
    landingPage: {
        key: `${STORE_KEY_PREFIX}_landingPage`,
        storage: storage,
        whitelist: ["landingPage"],
    },
};

const rootReducer = combineReducers({
    [api.reducerPath]: api.reducer,
    auth: persistReducer(persistConfig.auth, authReducer),
});

export const store = configureStore({
    reducer: rootReducer,
    devTools: false,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(api.middleware),
});

export const persister = persistStore(store);

// store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore, createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage";

const EXPIRE_AFTER = 60 * 60 * 1000; // 1 hour

const expireTransform = createTransform(
  (inboundState, key) => ({
    ...inboundState,
    _persistedAt: Date.now(),
  }),
  (outboundState, key) => {
    if (Date.now() - (outboundState?._persistedAt || 0) > EXPIRE_AFTER) {
      return undefined;
    }
    return outboundState;
  }
);

const initialState = {
  user: null,
  tokens: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };
    case "SET_TOKENS":
      return {
        ...state,
        tokens: action.payload,
      };
    case "CLEAR_USER":
      return initialState;
    default:
      return state;
  }
};

const persistConfig = {
  key: "root",
  storage,
  transforms: [expireTransform],
  whitelist: ["user", "tokens"], // Only persist these
};

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // For redux-persist
    }),
});

export const persistor = persistStore(store);



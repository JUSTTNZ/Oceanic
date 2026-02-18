import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore, createTransform, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

// SSR-safe storage: returns a noop storage on the server
const createNoopStorage = () => ({
  getItem() { return Promise.resolve(null); },
  setItem(_key, value) { return Promise.resolve(value); },
  removeItem() { return Promise.resolve(); },
});

const storage = typeof window !== "undefined"
  ? createWebStorage("local")
  : createNoopStorage();

// Set expiration time in milliseconds (1 hour)
const EXPIRE_AFTER = 60 * 60 * 1000; // 1 hour = 3600000 ms

// Transform to add and check expiry
const expireTransform = createTransform(
  // transform state before saving to storage
  (inboundState, key) => {
    return {
      ...inboundState,
      _persistedAt: Date.now(),
    };
  },
  // transform state being rehydrated
  (outboundState, key) => {
    const currentTime = Date.now();
    const savedTime = outboundState?._persistedAt || 0;

    if (currentTime - savedTime > EXPIRE_AFTER) {
      // Expired - return initial state
      return undefined;
    }

    return outboundState;
  }
);

const initialState = {
  user: '',
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: {
          ...state.user, // Keep existing user data
          ...action.payload // Merge with updated fields
        }
        
      };
      case "CLEAR_USER":
      return { ...state, user: null };
    default:
      return state;
  }
};

const persistConfig = {
  key: "root",
  storage,
  transforms: [expireTransform],
};

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

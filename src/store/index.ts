
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector, useDispatch, connect, Connect } from 'react-redux';
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import userReducer from "./features/user";
import contentReducer from "./features/content";
import thunk from 'redux-thunk'


const persistedReducer = persistReducer(
  { key: "miniflux-ui storage", storage, timeout: 50, }, // REVISIT: maybe the timeout will cause data lost
  combineReducers({ userReducer, contentReducer })
);

export const store = configureStore({

  reducer: persistedReducer,
  middleware: [thunk],

})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const appConnect: Connect<RootState> = connect

export default store
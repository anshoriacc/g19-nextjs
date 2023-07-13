import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { encryptTransform } from 'redux-persist-transform-encrypt';

import authSlice from './reducers/authSlice';
import { authQuery } from './reducers/authQuery';
import { profileQuery } from './reducers/profileQuery';
import { productQuery } from './reducers/productQuery';
import { reservationQuery } from './reducers/reservationQuery';
import { bannerQuery } from './reducers/bannerQuery';

const key = process.env.NEXT_PUBLIC_KEY;

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: [
    authQuery.reducerPath,
    profileQuery.reducerPath,
    productQuery.reducerPath,
    reservationQuery.reducerPath,
    bannerQuery.reducerPath,
  ],
  transforms: [
    encryptTransform({
      secretKey: key,
      onError: function (error) {
        console.log(error);
      },
    }),
  ],
};

const reducer = combineReducers({
  auth: authSlice,
  [authQuery.reducerPath]: authQuery.reducer,
  [profileQuery.reducerPath]: profileQuery.reducer,
  [productQuery.reducerPath]: productQuery.reducer,
  [reservationQuery.reducerPath]: reservationQuery.reducer,
  [bannerQuery.reducerPath]: bannerQuery.reducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(authQuery.middleware)
      .concat(profileQuery.middleware)
      .concat(productQuery.middleware)
      .concat(reservationQuery.middleware)
      .concat(bannerQuery.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

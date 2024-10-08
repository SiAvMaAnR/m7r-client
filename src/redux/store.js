import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { authReducer, systemReducer, signalRReducer } from './_exports'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['system', 'auth']
}

const rootReducer = combineReducers({
  auth: authReducer,
  system: systemReducer,
  signalR: signalRReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

const persistor = persistStore(store)

export { store, persistor }

import { applyMiddleware, compose } from "redux";
import storage from "redux-persist/lib/storage";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { createInjectorsEnhancer } from "redux-injectors";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import { createReducer } from "lib/reducers";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";


export function configureAppStore() {
  let composeEnhancers = compose;
  const persistConfig = {
    key: "root",
    version: 1,
    storage,
    stateReconciler: autoMergeLevel2,
  };
  const sagaMiddleware = createSagaMiddleware();
  const { run: runSaga } = sagaMiddleware;
  // Create the store with two middlewares
  // 1. sagaMiddleware: Makes redux-sagas work
  // 2. routerMiddleware: Syncs the location/URL path to the state
  const middlewares = [
    ...getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, PAUSE, PURGE, REGISTER, PERSIST, REHYDRATE],
      },
      // serializableCheck: false,
    }),
    sagaMiddleware,
  ];
  const enhancers = [
    createInjectorsEnhancer({
      createReducer,
      runSaga,
    }),
  ];

  // if (typeof window !== "undefined") {
  //   if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
  //     composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({});
  // }

  const persistedReducer = persistReducer(persistConfig, createReducer());

  const store = configureStore({
    reducer: persistedReducer,
    middleware: middlewares,
    devTools: {
      shouldHotReload: false,
    },
    enhancers,
  });

  // const store = createStore(persistedReducer, composeEnhancers(...enhancers));

  const persistor = persistStore(store);

  return {
    persistor,
    store,
  };
}

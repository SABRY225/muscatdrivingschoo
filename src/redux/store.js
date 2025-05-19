import { configureStore, combineReducers } from "@reduxjs/toolkit";
import adminRreducer from "./adminSlice";
import studentRreducer from "./studentSlice";
import teacherReducer from "./teacherSlice";
import parentReducer from "./parentSlice";
import guestReducer from "./guestSlice";
import currencyReducer from "./currency";
import ForgetPasswordReducer from "./ForgetPasswordSlice";
import conversionRateReducer from "./conversionRate";

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
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root1",
  version: 1,
  storage,
};

const persistConfig2 = {
  key: "root2",
  version: 1,
  storage,
};

const persistConfig3 = {
  key: "root3",
  version: 1,
  storage,
};

const persistConfig4 = {
  key: "root4",
  version: 1,
  storage,
};

const persistConfig5 = {
  key: "5",
  version: 1,
  storage,
};

const persistConfig6 = {
  key: "6",
  version: 1,
  storage,
};
const persistConfig7 = {
  key: "7",
  version: 1,
  storage,
};

const persistConfig8 = {
  key: "root5",
  version: 1,
  storage,
};


const rootReducer = combineReducers({
  admin   : persistReducer(persistConfig,   adminRreducer),
  student : persistReducer(persistConfig2,  studentRreducer),
  teacher : persistReducer(persistConfig3,  teacherReducer),
  parent  : persistReducer(persistConfig4,  parentReducer),
  guest   : persistReducer(persistConfig8,  guestReducer),
  currency: persistReducer(persistConfig5,  currencyReducer),
  forgetPassword: persistReducer(persistConfig6, ForgetPasswordReducer),
  conversionRate: persistReducer(persistConfig7, conversionRateReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

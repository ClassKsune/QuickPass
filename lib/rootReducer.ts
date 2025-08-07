import { combineReducers } from "@reduxjs/toolkit";
import cartSliceReducer from "./slices/cartSlice";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};

export const rootReducer = combineReducers({
  cart: persistReducer({
    key: "cart",
    storage: AsyncStorage,
  }, cartSliceReducer),
})
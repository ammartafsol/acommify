import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import commonReducer from "./common/commonSlice";
import cartReducer from "./cart/cartSlice";

const rootReducer = combineReducers({
  authReducer,
  commonReducer,
  cartReducer,
});

export default rootReducer;

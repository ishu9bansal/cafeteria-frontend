import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import counterReducer from './slices/counterSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        counter: counterReducer,
    }
});

export default store;
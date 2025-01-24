import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
    },
    reducers: {
        setCart: (state, action) => {
            state.items = action.payload;
        },
        emptyCart: (state, action) => {
            state.items = [];
        },
    },
});

export const { setCart, emptyCart } = cartSlice.actions;

export default cartSlice.reducer;
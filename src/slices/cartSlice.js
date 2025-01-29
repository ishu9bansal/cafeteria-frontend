import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        loading: false,
    },
    reducers: {
        setCart: (state, action) => {
            state.items = action.payload;
        },
        emptyCart: (state, action) => {
            state.items = [];
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    },
});

export const { setCart, emptyCart, setLoading } = cartSlice.actions;

export default cartSlice.reducer;
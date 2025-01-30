import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
    name: "counter",
    initialState: {
        dishes: [],
        details: null,
    },
    reducers: {
        setDishes: (state, action) => {
            state.dishes = action.payload;
        },
        setCounter: (state, action) => {
            state.details = action.payload;
        },
    },
});

export const { setDishes, setCounter } = counterSlice.actions;

export default counterSlice.reducer;

export const selectCanUserEditCounter = (state) => {
    // return false;
    const { user } = state.auth;
    const { details: counter } = state.counter;

    return user && counter && counter.merchants?.includes(user._id);
};
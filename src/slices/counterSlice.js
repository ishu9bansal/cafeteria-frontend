import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
    name: "counter",
    initialState: {
        dishes: [],
        details: null,
        users: [],
    },
    reducers: {
        setDishes: (state, action) => {
            state.dishes = action.payload;
        },
        setCounter: (state, action) => {
            state.details = action.payload;
        },
        setUsers: (state, action) => {
            state.users = action.payload;
        },
    },
});

export const { setDishes, setCounter, setUsers } = counterSlice.actions;

export default counterSlice.reducer;
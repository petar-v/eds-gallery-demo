import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ThunkApi, AppState } from "./";

export interface ExampleState {
    greeting: string;
}

const initialState: ExampleState = {
    greeting: "Hello",
};

export const exampleSlice = createSlice({
    name: "example",
    initialState,
    reducers: {
        setGreeting(state, action) {
            state.greeting = action.payload;
        },
    },
});

export const setGreeting = createAsyncThunk<void, string, ThunkApi>(
    "socket/initializeSocket",
    async (greeting: string, { extra, dispatch }) => {
        dispatch(exampleSlice.actions.setGreeting(greeting));
    },
);

export const selectGreetingState = (state: AppState) =>
    state[exampleSlice.name].backend;

export default exampleSlice.reducer;

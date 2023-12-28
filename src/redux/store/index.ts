import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import { combineReducers } from "@reduxjs/toolkit";

const combinedReducer = combineReducers({
    slice: {},
});

const extraThunkArg = {};
type ExtraThunkType = typeof extraThunkArg;

const reducer: typeof combinedReducer = (state, action) => {
    if (action.type === HYDRATE) {
        const nextState = {
            ...state,
            ...action.payload,
        };
        return nextState;
    } else {
        return combinedReducer(state, action);
    }
};

const makeStore = () => {
    const store = configureStore({
        reducer,
        devTools: process.env.NODE_ENV !== "production",
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                thunk: {
                    extraArgument: extraThunkArg,
                },
                serializableCheck: false,
            }),
    });
    return store;
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppState,
    ExtraThunkType,
    Action
>;
export type ThunkApi = {
    extra: ExtraThunkType;
    state: AppState;
};

export const wrapper = createWrapper<AppStore>(makeStore);

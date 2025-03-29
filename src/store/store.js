import { configureStore } from "@reduxjs/toolkit";
import interviewReducer from './slices/interviewSlice';

export const store = configureStore({
    reducer:{
        interview: interviewReducer,
    },
});

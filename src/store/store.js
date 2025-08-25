import { configureStore } from "@reduxjs/toolkit";
import authenticate from "./authentication/Authenticate";

export default configureStore({
    reducer: {
        authenticate
    },
    // devTools: true, // Enable Redux DevTools in development mode
})
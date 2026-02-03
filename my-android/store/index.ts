import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { authService } from '@/services/authService';
import {chatService} from "@/services/chatService";

export const store = configureStore({
    reducer: {
        auth: authReducer,

        [authService.reducerPath]: authService.reducer,
        [chatService.reducerPath]: chatService.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authService.middleware,
            chatService.middleware,
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
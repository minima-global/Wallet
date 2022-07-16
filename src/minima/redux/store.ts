import { configureStore, ThunkAction, Action, AnyAction } from "@reduxjs/toolkit";

import balanceReducer from './slices/balanceSlice';
import { BalanceState } from './slices/balanceSlice';
import notificationReducer from './slices/notificationSlice';
import { NotificationState } from './slices/notificationSlice';

export type RootState = {
    balance: BalanceState;
    notification: NotificationState
};

export const store = configureStore({
    reducer: {
        balance: balanceReducer,
        notification: notificationReducer
    }
});

export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;

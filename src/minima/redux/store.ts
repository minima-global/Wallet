import { configureStore, ThunkAction, Action, AnyAction } from "@reduxjs/toolkit";

import balanceReducer from './slices/balanceSlice';
import { BalanceState } from './slices/balanceSlice';
import { MiningState } from "./slices/miningSlice";
import notificationReducer from './slices/notificationSlice';
import { NotificationState } from './slices/notificationSlice';
import miningReducer from './slices/miningSlice';

export type RootState = {
    balance: BalanceState;
    notification: NotificationState;
    mining: MiningState;
};

export const store = configureStore({
    reducer: {
        balance: balanceReducer,
        notification: notificationReducer,
        mining: miningReducer
    }
});

export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;

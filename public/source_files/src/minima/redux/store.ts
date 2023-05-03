import { configureStore, ThunkAction, AnyAction } from '@reduxjs/toolkit';

import { balanceMiddleware, BalanceState } from './slices/balanceSlice';
import { MiningState } from './slices/miningSlice';
import { SendFormState } from './slices/app/sendSlice';
import { NotificationState } from './slices/notificationSlice';
import balanceReducer from './slices/balanceSlice';
import notificationReducer from './slices/notificationSlice';
import miningReducer from './slices/miningSlice';
import sendFormReducer from './slices/app/sendSlice';
import { TokenState } from './slices/tokenSlice';
import tokenReducer from './slices/tokenSlice';
import historyReducer from './slices/historySlice';
import { HistoryState } from './slices/historySlice';

export type RootState = {
    balance: BalanceState;
    notification: NotificationState;
    mining: MiningState;
    sendForm: SendFormState;
    tokens: TokenState;
    history: HistoryState;
};

export const store = configureStore({
    reducer: {
        balance: balanceReducer,
        notification: notificationReducer,
        mining: miningReducer,
        sendForm: sendFormReducer,
        tokens: tokenReducer,
        history: historyReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(balanceMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;

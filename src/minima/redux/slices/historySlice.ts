import { TxPOW } from './../../../types/minima/index';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store';
import { Token } from '../../../@types/minima';

import * as RPC from '../../commands';

export interface HistoryState {
    txpows: TxPOW[];
}
const initialState: HistoryState = {
    txpows: [],
};

export const callAndStoreHistory = (): AppThunk => async (dispatch) => {
    try {
        const walletTokens = await RPC.getHistory();

        dispatch(updateHistory(walletTokens));
    } catch (error) {
        throw error;
    }
};

export const historySlice = createSlice({
    name: 'balance',
    initialState,
    reducers: {
        updateHistory: (state, action: PayloadAction<any>) => {
            state.txpows = action.payload;
        },
    },
});

export const { updateHistory } = historySlice.actions;
export default historySlice.reducer;

export const selectHistory = (state: RootState): TxPOW[] => {
    return state.history.txpows;
};

import { DetailsTxPOW, TxPOW } from './../../../types/minima/index';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store';

import * as RPC from '../../commands';

export interface HistoryState {
    txpows: TxPOW[];
    details: DetailsTxPOW[];
}
const initialState: HistoryState = {
    txpows: [],
    details: [],
};

export const callAndStoreHistory = (): AppThunk => async (dispatch) => {
    try {
        const historyTxpows = await RPC.getHistory();

        dispatch(updateHistory(historyTxpows));
    } catch (error) {
        throw error;
    }
};
export const callAndStoreHistoryDetails = (): AppThunk => async (dispatch) => {
    try {
        const historyDetails = await RPC.getHistoryDetails();

        dispatch(updateHistoryDetails(historyDetails));
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
        updateHistoryDetails: (state, action: PayloadAction<any>) => {
            state.details = action.payload;
        },
    },
});

export const { updateHistory, updateHistoryDetails } = historySlice.actions;
export default historySlice.reducer;

export const selectHistory = (state: RootState): Map<string, { detail: DetailsTxPOW; txpow: TxPOW }> => {
    const map = new Map();
    let index = 0;
    for (const obj of state.history.txpows) {
        map.set(obj.txpowid, { detail: state.history.details[index], txpow: obj });
        index++;
    }

    return map;
};

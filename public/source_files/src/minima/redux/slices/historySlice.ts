import { DetailsTxPOW, TxPOW } from './../../../types/minima/index';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store';

import * as RPC from '../../commands';

export interface HistoryState {
    txpows: { txpows: TxPOW[]; details: DetailsTxPOW[] } | null;
}
const initialState: HistoryState = {
    txpows: null,
};

export const callAndStoreHistory = (): AppThunk => async (dispatch) => {
    try {
        const historyTxpows = await RPC.getHistory();
        const historyDetails = await RPC.getHistoryDetails();

        dispatch(updateHistory({ txpows: historyTxpows, details: historyDetails }));
    } catch (error) {
        dispatch(updateHistory(null));
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

export const selectHistory = (state: RootState): Map<string, { detail: DetailsTxPOW; txpow: TxPOW }> | null => {
    const map = new Map();

    if (!state.history.txpows) return null;

    let index = 0;
    for (const obj of state.history.txpows.txpows) {
        map.set(obj.txpowid, { detail: state.history.txpows.details[index], txpow: obj });
        index++;
    }

    return map;
};

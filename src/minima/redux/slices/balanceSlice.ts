import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { MinimaToken } from './../../../types/minima/index';
import { AppThunk, RootState } from '../store';

import { callBalance } from '../../rpc-commands';

export interface BalanceState {
    funds: MinimaToken[];
}
const initialState: BalanceState = {
    funds: [],
};

export const callAndStoreBalance =
    (ms: number): AppThunk =>
    async (dispatch, getState) => {
        // console.log(`Calling for new balance at ${ms}`)
        setTimeout(() => {
            callBalance()
                .then((data: any) => {
                    // console.log(`New Balance Data`, data)
                    dispatch(updateBalance(data.response));
                })
                .catch((err) => {
                    console.error(err);
                });
        }, ms);
};

export const balanceSlice = createSlice({
    name: "balance",
    initialState,
    reducers: {
        updateBalance: (state, action: PayloadAction<any>) => {
            // console.log(action);
            const balance = action.payload;
            state.funds = balance;
        },
    },
});

export const { updateBalance } = balanceSlice.actions;
export default balanceSlice.reducer;

// Return balance
export const selectBalance = (state: RootState): MinimaToken[] => {
  return state.balance.funds;
};

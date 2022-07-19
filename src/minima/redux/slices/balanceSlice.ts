import { isPropertyString, containsText } from './../../../shared/functions';
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

// Return token
export const selectTokenWithID = (id: string) => (state: RootState): MinimaToken | undefined => {
  return state.balance.funds.find((b: MinimaToken) => b.tokenid === id);
};
// Return NFTs
export const selectNFTs= (state: RootState): MinimaToken[] | undefined => {
  return state.balance.funds.filter((b: MinimaToken) => b.token && b.token.hasOwnProperty("nft") && b.token.nft);
};
// Return Filter NFTs
export const selectFilterNFTs = (id: string) => (state: RootState): MinimaToken | undefined => {
    return state.balance.funds.find((b: MinimaToken) => b.tokenid === id);
  };

// Return filtered list
export const selectBalanceFilter = (filterText: string) => (state: RootState): MinimaToken[] => {
    return state.balance.funds.filter(
        (opt: MinimaToken) =>
            (isPropertyString(opt.token) && containsText(opt.token, filterText)) ||
            (!isPropertyString(opt.token) && containsText(opt.token.name, filterText)) ||
            (isPropertyString(opt.tokenid) && containsText(opt.tokenid, filterText))
    );
};



import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store';
import { Token } from '../../../@types/minima';

import * as RPC from '../../commands';

export interface TokenState {
    tokens: Token[];
}
const initialState: TokenState = {
    tokens: [],
};

export const callAndStoreTokens = (): AppThunk => async (dispatch) => {
    try {
        const walletTokens = await RPC.getTokens();

        dispatch(updateTokens(walletTokens.filter((c) => c.tokenid !== '0x00').map((c) => c.token)));
    } catch (error) {
        throw error;
    }
};

export const tokenSlice = createSlice({
    name: 'balance',
    initialState,
    reducers: {
        updateTokens: (state, action: PayloadAction<any>) => {
            state.tokens = action.payload;
        },
    },
});

export const { updateTokens } = tokenSlice.actions;
export default tokenSlice.reducer;

export const selectTokens = (state: RootState): Token[] => {
    return state.tokens.tokens;
};

export const selectTokensWithDecimalZero = (state: RootState): Token[] => {
    const tokensWithDecimalZero = state.tokens.tokens.filter((t) => t.decimals === 0);

    return [...new Map(tokensWithDecimalZero.map((item) => [item['tokenid'], item])).values()];
};

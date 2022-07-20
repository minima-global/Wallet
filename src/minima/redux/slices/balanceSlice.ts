import { toggleNotification } from './notificationSlice';
import { isPropertyString, containsText, hexToString } from './../../../shared/functions';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { MinimaToken } from './../../../types/minima/index';
import { AppThunk, RootState } from '../store';

import { callBalance } from '../../rpc-commands';
import { addTokenToFavoritesTable, removeTokenFromFavoritesTable, selectFavorites } from '../../libs/nft';

export interface BalanceState {
    funds: MinimaToken[];
    favouriteNFT: string[];
}
const initialState: BalanceState = {
    funds: [],
    favouriteNFT: []
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
export const initFavoritesTableAndUpdate =
    (): AppThunk =>
    async (dispatch, getState) => {
        selectFavorites().then((data: any) => {
            const tokenids = data.map((d: any) => d.TOKENID);
            dispatch(initFavoritesTable(tokenids));
        }).catch((err) => {
            console.error(err);
        })
};
export const addFavoritesTableAndUpdate =
    (tokenid: string): AppThunk =>
    async (dispatch, getState) => {
        addTokenToFavoritesTable(tokenid).then(() => {
            selectFavorites().then((data: any) => {
                const tokenids = data.map((d: any) => d.TOKENID);
                dispatch(initFavoritesTable(tokenids))
            }).catch((err) => {
                console.error(err);
            })
        }).catch((err) => {
            console.error(err);
            dispatch(toggleNotification("SQL error, please report logs to admin", "error", "error"))
        })
        
};
export const removeFromFavoritesTableAndUpdate =
    (tokenid: string): AppThunk =>
    async (dispatch, getState) => {
        removeTokenFromFavoritesTable(tokenid).then(() => {
            selectFavorites().then((data: any) => {
                const tokenids = data.map((d: any) => d.TOKENID);
                dispatch(initFavoritesTable(tokenids))
            }).catch((err) => {
                console.error(err);
            })

        }).catch((err) => {
            console.error(err);
            dispatch(toggleNotification("SQL error, please report logs to admin", "error", "error"))
        })
};


export const balanceSlice = createSlice({
    name: "balance",
    initialState,
    reducers: {
        updateBalance: (state, action: PayloadAction<any>) => {
            // console.log(action);
            let balance = action.payload;
            balance.forEach((b: MinimaToken) => {
                if (typeof b.token === 'object' && b.token['nft']) {
                    b.token.description = hexToString(b.token.description);
                    b.token.owner =  hexToString(b.token.owner);
                    b.token.external_url =  hexToString(b.token.external_url);
                    b.token.name = hexToString(b.token.name);
                }

                if (typeof b.token === 'object' && !b.token.hasOwnProperty("nft") && b.token.hasOwnProperty("url")) {
                    b.token.url = hexToString(b.token.url);
                    b.token.description = hexToString(b.token.description);
                }
            })
            state.funds = balance;
        },
        initFavoritesTable: (state, action: PayloadAction<any>) => {
            const tokenids = action.payload;
            state.favouriteNFT = tokenids;
        },
    },
});

export const { updateBalance, initFavoritesTable } = balanceSlice.actions;
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
// Return Favourite NFTs
export const selectFavouriteNFTs = (state: RootState): MinimaToken[] | undefined => {

    return state.balance.funds.filter((t: MinimaToken) => state.balance.favouriteNFT?.includes(t.tokenid));
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



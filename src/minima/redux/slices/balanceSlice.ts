import { toggleNotification } from './notificationSlice';
import { isPropertyString, containsText, hexToString } from './../../../shared/functions';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store';

import {  getWalletBalance } from '../../rpc-commands';
import { addTokenToFavoritesTable, removeTokenFromFavoritesTable, selectFavorites } from '../../libs/nft';
import { MinimaToken } from '../../types/minima2';

const NEWBLOCK = 'NEWBLOCK';

export interface BalanceState {
    funds: MinimaToken[];
    favouriteNFT: string[];
    updateRequired: boolean;
}
const initialState: BalanceState = {
    funds: [],
    favouriteNFT: [],
    updateRequired: false
};

export const callAndStoreBalance =
    (): AppThunk =>
    async (dispatch) => {
        // console.log(`Calling for new balance at ${ms}`)
        getWalletBalance()
            .then((wallet: MinimaToken[]) => {
            console.log(wallet);    
            const hasUnconfirmedBalance = !!wallet.find((i) => i.unconfirmed !== "0");
            if (hasUnconfirmedBalance) {

                dispatch(needsUpdating(true))

            }
            
            if (!hasUnconfirmedBalance) {

                dispatch(needsUpdating(false))
            
            }

            dispatch(updateBalance(wallet));
            })
            .catch((err) => {
                console.error(err);
            });
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
            
            state.funds = balance;
        },
        initFavoritesTable: (state, action: PayloadAction<any>) => {
            const tokenids = action.payload;
            state.favouriteNFT = tokenids;
        },
        needsUpdating: (state, action: PayloadAction<any>) => {

            state.updateRequired = action.payload;


        }
    },
});

export const { updateBalance, initFavoritesTable, needsUpdating } = balanceSlice.actions;
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
  return state.balance.funds.filter((b: MinimaToken) => b.token && b.token.hasOwnProperty("nft") && b.token.nft === 'true');
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

export const selectBalanceNeedsUpdating = (state: RootState): boolean => {
    return state.balance.updateRequired;
}

export const balanceMiddleware = (store: any) => (next: any) => (action: any) => {

    
    if (action.type === NEWBLOCK && selectBalanceNeedsUpdating(store.getState())) {
    
        store.dispatch(callAndStoreBalance())
    }


    return next(action)
}

export function onNewBlock() {
    return {
        type: NEWBLOCK,
    }
}
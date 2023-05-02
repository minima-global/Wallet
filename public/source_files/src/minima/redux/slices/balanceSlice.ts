import { callAndStoreTokens } from './tokenSlice';
import { toggleNotification } from './notificationSlice';
import { isPropertyString, containsText, hexToString, makeTokenImage } from './../../../shared/functions';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store';

import { getWalletBalance } from '../../rpc-commands';
import {
    addTokenToFavoritesTable,
    removeTokenFromFavoritesTable,
    selectFavorites,
    showTablesCount,
} from '../../libs/nft';
import { MinimaToken, Token } from '../../../@types/minima';

const NEWBLOCK = 'NEWBLOCK';

export interface BalanceState {
    funds: MinimaToken[];
    favouriteNFT: string[];
    updateRequired: boolean;
}
const initialState: BalanceState = {
    funds: [],
    favouriteNFT: [],
    updateRequired: false,
};

export const callAndStoreBalance = (): AppThunk => async (dispatch) => {
    try {
        const walletBalance = await getWalletBalance();

        const hasUnconfirmedBalance = !!walletBalance.find((i) => i.unconfirmed !== '0');

        if (hasUnconfirmedBalance) {
            dispatch(needsUpdating(true));
        }

        if (!hasUnconfirmedBalance) {
            dispatch(needsUpdating(false));
        }

        dispatch(updateBalance(walletBalance));
    } catch (error) {
        console.error(error);
    }
};
const delay = async (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

export const initFavoritesTableAndUpdate = (): AppThunk => async (dispatch, getState) => {
    try {
        const tablesCount = await showTablesCount();
        const favoritesTableCreated = tablesCount === 1;
        // are there any tables?
        if (favoritesTableCreated) {
            const myFavoriteTokensArray = await selectFavorites();
            dispatch(initFavoritesTable(myFavoriteTokensArray));
        }
        // if no tables.. wait and re-try
        if (!favoritesTableCreated) {
            await delay(2000);
            initFavoritesTableAndUpdate();
        }
    } catch (error) {
        console.error(error);
    }
};
export const addFavoritesTableAndUpdate =
    (tokenid: string): AppThunk =>
    async (dispatch, getState) => {
        addTokenToFavoritesTable(tokenid)
            .then(() => {
                selectFavorites()
                    .then((data: any) => {
                        dispatch(initFavoritesTable(data));
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            })
            .catch((err) => {
                console.error(err);
                dispatch(toggleNotification('SQL error, please report logs to admin', 'error', 'error'));
            });
    };
export const removeFromFavoritesTableAndUpdate =
    (tokenid: string): AppThunk =>
    async (dispatch, getState) => {
        removeTokenFromFavoritesTable(tokenid)
            .then(() => {
                selectFavorites()
                    .then((data: any) => {
                        dispatch(initFavoritesTable(data));
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            })
            .catch((err) => {
                console.error(err);
                dispatch(toggleNotification('SQL error, please report logs to admin', 'error', 'error'));
            });
    };

export const balanceSlice = createSlice({
    name: 'balance',
    initialState,
    reducers: {
        updateBalance: (state, action: PayloadAction<any>) => {
            // console.log(action);
            let balance = action.payload;

            balance.map((t: MinimaToken) => {
                if (t.token.url && t.token.url.startsWith('<artimage>', 0)) {
                    t.token.url = makeTokenImage(t.token.url, t.tokenid);
                }
                return t;
            });

            state.funds = balance;
        },
        initFavoritesTable: (state, action: PayloadAction<any>) => {
            const tokenids = action.payload;
            state.favouriteNFT = tokenids;
        },
        needsUpdating: (state, action: PayloadAction<any>) => {
            state.updateRequired = action.payload;
        },
    },
});

export const { updateBalance, initFavoritesTable, needsUpdating } = balanceSlice.actions;
export default balanceSlice.reducer;

// Return balance
export const selectBalance = (state: RootState): MinimaToken[] => {
    // make all nfts & tokens if uploaded content into renderable uris
    return state.balance.funds.map((t) => {
        if (t.token.url && t.token.url.startsWith('<artimage>', 0)) {
            // console.log(makeTokenImage(t.token.url, t.tokenid));
            //t.token.url = makeTokenImage(t.token.url, t.tokenid);

            return t;
        }

        return t;
    });
};

// Return token
export const selectTokenWithID =
    (id?: string) =>
    (state: RootState): MinimaToken | undefined => {
        return state.balance.funds.find((b: MinimaToken) => b.tokenid === id);
    };
// Return NFTs
export const selectNFTs = (state: RootState): MinimaToken[] | undefined => {
    return state.balance.funds.filter((b: MinimaToken) => b.token && b.token.type && b.token.type === 'NFT');
};
// Return Filter NFTs
export const selectFilterNFTs =
    (id: string) =>
    (state: RootState): MinimaToken | undefined => {
        return state.balance.funds.find((b: MinimaToken) => b.tokenid === id);
    };
// Return Favourite NFTs
export const selectFavouriteNFTs = (state: RootState): Token[] => {
    return state.tokens.tokens.filter((t: Token) => state.balance.favouriteNFT?.includes(t.tokenid));
};

// Return filtered list
export const selectBalanceFilter =
    (filterText: string) =>
    (state: RootState): MinimaToken[] => {
        return state.balance.funds.filter(
            (opt: MinimaToken) =>
                (isPropertyString(opt.token) && containsText(opt.token, filterText)) ||
                (!isPropertyString(opt.token) && containsText(opt.token.name, filterText)) ||
                (isPropertyString(opt.tokenid) && containsText(opt.tokenid, filterText))
        );
    };

export const selectBalanceNeedsUpdating = (state: RootState): boolean => {
    return state.balance.updateRequired;
};

export const balanceMiddleware = (store: any) => (next: any) => (action: any) => {
    if (action.type === NEWBLOCK && selectBalanceNeedsUpdating(store.getState())) {
        store.dispatch(callAndStoreBalance());
        store.dispatch(callAndStoreTokens());
    }

    return next(action);
};

export function onNewBlock() {
    return {
        type: NEWBLOCK,
    };
}

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

        dispatch(updateTokens(walletTokens));
    } catch (error) {
        throw error;
    }
};
// const delay = async (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

// export const initFavoritesTableAndUpdate = (): AppThunk => async (dispatch, getState) => {
//     try {
//         const tablesCount = await showTablesCount();
//         const favoritesTableCreated = tablesCount === 1;
//         // are there any tables?
//         if (favoritesTableCreated) {
//             const myFavoriteTokensArray = await selectFavorites();
//             // console.log('myFavoriteTokensArray', myFavoriteTokensArray);
//             dispatch(initFavoritesTable(myFavoriteTokensArray));
//         }
//         // if no tables.. wait and re-try
//         if (!favoritesTableCreated) {
//             await delay(2000);
//             initFavoritesTableAndUpdate();
//         }
//     } catch (error) {
//         console.error(error);
//     }
// };
// export const addFavoritesTableAndUpdate =
//     (tokenid: string): AppThunk =>
//     async (dispatch, getState) => {
//         addTokenToFavoritesTable(tokenid)
//             .then(() => {
//                 selectFavorites()
//                     .then((data: any) => {
//                         dispatch(initFavoritesTable(data));
//                     })
//                     .catch((err) => {
//                         console.error(err);
//                     });
//             })
//             .catch((err) => {
//                 console.error(err);
//                 dispatch(toggleNotification('SQL error, please report logs to admin', 'error', 'error'));
//             });
//     };
// export const removeFromFavoritesTableAndUpdate =
//     (tokenid: string): AppThunk =>
//     async (dispatch, getState) => {
//         removeTokenFromFavoritesTable(tokenid)
//             .then(() => {
//                 selectFavorites()
//                     .then((data: any) => {
//                         dispatch(initFavoritesTable(data));
//                     })
//                     .catch((err) => {
//                         console.error(err);
//                     });
//             })
//             .catch((err) => {
//                 console.error(err);
//                 dispatch(toggleNotification('SQL error, please report logs to admin', 'error', 'error'));
//             });
//     };

export const tokenSlice = createSlice({
    name: 'balance',
    initialState,
    reducers: {
        updateTokens: (state, action: PayloadAction<any>) => {
            state.tokens = action.payload;
        },
        // initFavoritesTable: (state, action: PayloadAction<any>) => {
        //     const tokenids = action.payload;
        //     state.favouriteNFT = tokenids;
        // },
        // needsUpdating: (state, action: PayloadAction<any>) => {
        //     state.updateRequired = action.payload;
        // },
    },
});

export const { updateTokens } = tokenSlice.actions;
export default tokenSlice.reducer;

export const selectTokens = (state: RootState): Token[] => {
    return state.tokens.tokens;
};

export const selectTokensWithDecimalZero = (state: RootState): Token[] => {
    return state.tokens.tokens.filter((t) => t.decimals === 0);
};

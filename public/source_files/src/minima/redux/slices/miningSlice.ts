import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {  RootState } from '../store';


export interface MiningState {
    isMining: boolean;
}
const initialState: MiningState = {
    isMining: false
};


export const miningSlice = createSlice({
    name: "mining",
    initialState,
    reducers: {
        updateMiningState: (state, action: PayloadAction<any>) => {
            // console.log(action);
            const status = action.payload;
            state.isMining = status;
        },
    },
});

export const { updateMiningState } = miningSlice.actions;
export default miningSlice.reducer;

// Return balance
export const selectMiningState = (state: RootState): boolean => {
  return state.mining.isMining
};

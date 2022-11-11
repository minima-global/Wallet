import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {  RootState } from '../../store';

type Status = 'USERINPUT' | 'SUCCESS' | 'ERROR' | 'LOADING' 
export interface SendFormState {
  formState: Status
}
const initialState: SendFormState = {
  formState: 'USERINPUT'
};


export const sendSlice = createSlice({
    name: "sendform",
    initialState,
    reducers: {
        updateMiningState: (state, action: PayloadAction<Status>) => {
            const status = action.payload;
            state.formState = status;
        },
    },
});

export const { updateMiningState } = sendSlice.actions;
export default sendSlice.reducer;

// return status of form 
export const selectSendFormStatus = (state: RootState): Status => {
  return state.sendForm.formState;
};

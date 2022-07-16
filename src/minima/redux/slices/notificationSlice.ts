import { createSlice } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store';
import { AlertColor } from '@mui/material';

export interface NotificationProps {
  message?: string;
  severity?: AlertColor;
  type?: string; // for className for cssmodule
}
export interface NotificationState {
    display?: boolean;
    props: NotificationProps;
}
const initialState: NotificationState = {
    display: false,
    props: {}
};

export const toggleNotification =
    (message: string, severity: string, type: string): AppThunk =>
    async (dispatch, getState) => {
      const props = {message, severity, type};
      dispatch(updateState({display: true, ...props}));

      setTimeout(() => {
        dispatch(updateState({display: false, ...props}))
      }, 3000);
        
};

export const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        updateState: (state, action) => {
            const status = action.payload;
            state.display = status.display;
            state.props.message = status.message;
            state.props.type = status.type;
            state.props.severity = status.severity;
            
        },
    },
});

export const { updateState } = notificationSlice.actions;
export default notificationSlice.reducer;

// Return balance
export const selectNotificationState = (state: RootState): NotificationState => {
  return state.notification
};

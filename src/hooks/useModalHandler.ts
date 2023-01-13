import React from 'react';

type IStatusModal = 'Success' | 'Failed' | 'Pending' | false;
export const useModalHandler = () => {
    const [modalEmployee, setModalEmployee] = React.useState('');
    const [statusModal, setStatusModal] = React.useState<IStatusModal>(false);
    const [modalStatusMessage, setModalStatusMessage] = React.useState<false | string>(false);

    const handleSuccessState = (message: string) => {
        setStatusModal('Success');
        setModalStatusMessage(message);
        handleCloseModalManager();
    };
    const handleErrorState = (pending: boolean, message: string) => {
        console.log('pending', pending);
        setStatusModal(pending ? 'Pending' : 'Failed');
        setModalStatusMessage(
            pending
                ? 'This action is now pending and can be accepted in the pending transactions in the desktop hub or the apk.'
                : message
        );
        handleCloseModalManager();
    };

    const handleCloseModalManager = () => {
        setModalEmployee('');
    };
    const handleProceedButton = () => {
        setModalEmployee('confirmation');
    };
    const handleCloseStatusModal = () => setStatusModal(false);

    return {
        modalEmployee,
        setModalEmployee,
        statusModal,
        setStatusModal,
        modalStatusMessage,
        setModalStatusMessage,
        handleSuccessState,
        handleErrorState,
        handleCloseModalManager,
        handleProceedButton,
        handleCloseStatusModal,
    };
};

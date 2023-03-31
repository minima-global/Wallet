import { callAndStoreTokens } from './../minima/redux/slices/tokenSlice';
import { callAndStoreBalance, initFavoritesTableAndUpdate } from './../minima/redux/slices/balanceSlice';
import { useAppDispatch } from './../minima/redux/hooks';
import { useState, useEffect } from 'react';
import { events } from '../minima/libs/events';
import { createFavoritesTable } from '../minima/libs/nft';
export const useMinimaStatusCheck = () => {
    const dispatch = useAppDispatch();

    const [nodeStatus, setNodeStatus] = useState<'offline' | 'online' | 'checking'>('checking');
    const [MDSStatus, setMDSStatus] = useState<'offline' | 'online' | 'checking'>('checking');

    useEffect(() => {
        events.onInit(() => {
            setNodeStatus('online');
            setMDSStatus('online');

            dispatch(callAndStoreBalance());
            dispatch(callAndStoreTokens());
            createFavoritesTable();
            dispatch(initFavoritesTableAndUpdate());
        });

        events.onFail(() => {
            setMDSStatus('offline');
        });
    }, [dispatch]);

    return {
        nodeStatus,
        MDSStatus,
    };
};

export default useMinimaStatusCheck;

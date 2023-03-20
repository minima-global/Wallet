import { callAndStoreTokens } from './../minima/redux/slices/tokenSlice';
import { callAndStoreBalance, initFavoritesTableAndUpdate } from './../minima/redux/slices/balanceSlice';
import { useAppDispatch } from './../minima/redux/hooks';
import { useState, useEffect } from 'react';
import { events } from '../minima/libs/events';
import { createFavoritesTable } from '../minima/libs/nft';
export const useMinimaStatusCheck = () => {
    const dispatch = useAppDispatch();

    const [nodeStatus, setNodeStatus] = useState(false);
    const [myMDSStatus, setMDSStatus] = useState(false);

    useEffect(() => {
        events.onInit(() => {
            dispatch(callAndStoreBalance());
            dispatch(callAndStoreTokens());
            createFavoritesTable();
            dispatch(initFavoritesTableAndUpdate());

            setNodeStatus(true);
            setMDSStatus(true);
        });

        events.onFail(() => setMDSStatus(false));
    }, []);

    return {
        nodeStatus,
        myMDSStatus,
    };
};

export default useMinimaStatusCheck;

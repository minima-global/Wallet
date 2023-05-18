import { callAndStoreTokens } from './../minima/redux/slices/tokenSlice';
import { callAndStoreBalance, initFavoritesTableAndUpdate } from './../minima/redux/slices/balanceSlice';
import { useAppDispatch } from './../minima/redux/hooks';
import { useState, useEffect } from 'react';
import { events } from '../minima/libs/events';
import { createFavoritesTable } from '../minima/libs/nft';
export const useMinimaStatusCheck = () => {
    const dispatch = useAppDispatch();
    const [_minimaStatus, setStatus] = useState(false);
    const [loadingStatusCheck, setStatusCheck] = useState(true);

    useEffect(() => {
        if (loadingStatusCheck) {
            events.onInit(() => {
                MDS.cmd('balance', (r) => {
                    if (r.status) {
                        setStatus(true);
                        setStatusCheck(false);
                    }
                });

                dispatch(callAndStoreBalance());
                dispatch(callAndStoreTokens());
                createFavoritesTable();
                dispatch(initFavoritesTableAndUpdate());
            });
        }

        if (!_minimaStatus && loadingStatusCheck) {
            setTimeout(() => {
                setStatusCheck(false);
            }, 5000);
        }
    }, [dispatch, _minimaStatus, loadingStatusCheck]);

    useEffect(() => {
        events.onFail(() => {
            setStatus(false);
        });
    }, [dispatch, _minimaStatus]);

    return {
        _minimaStatus,

        loadingStatusCheck,
    };
};

export default useMinimaStatusCheck;

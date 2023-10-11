import { useState, useEffect, useContext } from 'react';

import * as RPC from '../minima/commands';
import { appContext } from '../AppContext';
const useIsVaultLocked = () => {
    const { loaded } = useContext(appContext);
    const [isVaultLocked, setVaultLocked] = useState(false);

    useEffect(() => {
        if (loaded.current === true) {
            RPC.getStatus().then((res) => {
                if (res.locked) setVaultLocked(true);
            });
        }
    }, [loaded.current]);

    return isVaultLocked;
};

export default useIsVaultLocked;

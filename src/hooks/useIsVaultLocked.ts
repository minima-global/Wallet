import { useState, useEffect } from 'react';

import * as RPC from '../minima/commands';
const useIsVaultLocked = () => {
    const [isVaultLocked, setVaultLocked] = useState(false);

    useEffect(() => {
        RPC.getStatus().then((res) => {
            if (res.locked) setVaultLocked(true);
        });
    }, []);

    return isVaultLocked;
};

export default useIsVaultLocked;

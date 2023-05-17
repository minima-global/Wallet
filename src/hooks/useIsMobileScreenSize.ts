import { useState, useEffect } from 'react';
const useIsMobileScreenSize = () => {
    const [isMobile, setMobile] = useState(false);

    useEffect(() => {
        window.addEventListener('resize', () => {
            const isMobileScreenSize = window.innerWidth <= 600;

            if (isMobileScreenSize) setMobile(true);
            if (!isMobileScreenSize) setMobile(false);
        });
    }, []);

    return isMobile;
};

export default useIsMobileScreenSize;

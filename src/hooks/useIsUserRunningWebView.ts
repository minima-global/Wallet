import { useState, useEffect } from 'react';
const useIsUserRunningWebView = () => {
    const [userRunningWebView, setUserRunningWebView] = useState(false);

    useEffect(() => {
        const isAndroidWebView = navigator.userAgent.includes('; wv');

        if (isAndroidWebView) setUserRunningWebView(true);
    }, []);

    return userRunningWebView;
};

export default useIsUserRunningWebView;

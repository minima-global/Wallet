import { useContext } from 'react';
import { appContext } from '../../../AppContext';

import { createPortal } from 'react-dom';

const Notification = () => {
    const { notificationMessage } = useContext(appContext);

    return (
        <>
            {notificationMessage &&
                createPortal(
                    <div className="w-[calc(100%-32px)] left-2 md:left-auto md:right-4 absolute md:max-w-max md: right-2 bottom-5 rounded bg-[#FFA010] p-4 z-50 animate-fadeIn flex items-center gap-2">
                        {notificationMessage}
                    </div>,
                    document.body
                )}
        </>
    );
};

export default Notification;

import { useState } from "react";

const RefreshButton = ({ onClick }: { onClick: () => void }) => {
    const [refreshing, setRefreshing] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const handleClick = async () => {
        setRefreshing(true);
        setDisabled(true);
        await onClick();

        setTimeout(() => {
            setRefreshing(false);
        }, 1000);

        setTimeout(() => {
            setDisabled(false);
        }, 200);
    }

    return (
        <button disabled={disabled} onClick={handleClick} type="button" className={`text-white h-[44px] w-[44px] p-0 border border-contrast2 rounded-full flex justify-center items-center bg-darkContrast hover:bg-contrast2 enabled:active:scale-90 disabled:opacity-80 disabled:cursor-not-allowed ${refreshing ? "animate-spin transition-all !text-orange" : ""}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-all w-[16px] h-[16px] "><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hidden transition-all w-[16px] h-[16px] "><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
        </button>
    )
}

export default RefreshButton;
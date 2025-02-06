import { useContext, useEffect, useState } from "react";
import { appContext } from "../../AppContext";
import { useNavigate } from "@tanstack/react-router";

const Pending = () => {
    const { isPending, setIsPending } = useContext(appContext);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        const callback = (e: CustomEvent) => {
            console.log(isPending);
            console.log(e.detail);
            console.log(e.detail.uid && e.detail.uid === isPending?.uid)
            if (e.detail.uid && e.detail.uid === isPending?.uid) {
                setIsPending(null);
                setSuccess(true);
            }
        }

        window.addEventListener('MDS_PENDING', callback as EventListener);

        return () => {
            window.removeEventListener('MDS_PENDING', callback as EventListener);
        }
    }, [isPending]);

    const skip = () => {
        setIsPending(null);
        navigate({ to: '/' });
    }

    const hideSuccess = () => {
        setSuccess(false);
        navigate({ to: '/' });
    }

    return (
        <>
            <div className={`${success ? 'opacity-100' : 'pointer-events-none opacity-0'} delay-100 transition-opacity duration-100 flex absolute z-50 inset-0 top-0 left-0 justify-center items-center w-screen h-screen`}>
                <div className={`bg-contrast1 mb-4 fixed z-[60] rounded-lg w-[440px] text-center text-white p-5 transform transition-all duration-200 ${success ? 'translate-y-[0%] opacity-100' : 'translate-y-[4px] opacity-0'}`}>
                    <h1 className="text-white text-2xl mt-1 mb-5 font-bold">Success</h1>
                    <p className="text-grey80 text-base text-sm mb-2 max-w-[90%] mx-auto">The transaction has been sent successfully.</p>
                    <div className="space-y-2">
                        <button onClick={hideSuccess} className="mt-5 text-black bg-orange hover:bg-lighterOrange text-sm py-2.5 px-4 w-full rounded-sm">Go to balance</button>
                    </div>
                </div>
                <div className="z-50 fixed bg-black opacity-90 w-screen h-screen top-0 left-0"></div>
            </div>
            <div className={`${isPending ? 'opacity-100' : 'pointer-events-none opacity-0'} delay-100 transition-opacity duration-100 flex absolute z-50 inset-0 top-0 left-0 justify-center items-center w-screen h-screen`}>
                <div className={`bg-contrast1 mb-4 fixed z-[60] rounded-lg w-[440px] text-center text-white p-5 transform transition-all duration-200 ${isPending ? 'translate-y-[0%] opacity-100' : 'translate-y-[4px] opacity-0'}`}>
                    <h1 className="text-white text-2xl mt-1.5 mb-5 font-bold">Pending</h1>
                    <p className="text-grey80 text-base text-sm mb-2 max-w-[90%] mx-auto">Please accept the pending transaction to continue or skip to continue if you want to accept the command later.</p>
                    <div className="space-y-2">
                        <button onClick={skip} className="mt-5 text-grey80 bg-contrast2 hover:opacity-80 text-sm py-3 px-4 w-full rounded-sm">Go to balance</button>
                    </div>
                </div>
                <div className="z-50 fixed bg-black opacity-90 w-screen h-screen top-0 left-0"></div>
            </div>
        </>
    )
}

export default Pending;
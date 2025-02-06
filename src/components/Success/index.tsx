import { useContext } from "react";
import { useNavigate } from "@tanstack/react-router";
import { appContext } from "../../AppContext";

const Pending = () => {
    const { isSuccess, setIsSuccess } = useContext(appContext);
    const navigate = useNavigate();

    const confirm = () => {
        if (isSuccess && typeof isSuccess === 'object') {
            isSuccess.callback();
        }

        navigate({ to: '/' });
        setIsSuccess(null);
    }

    return (
        <>
            <div className={`${isSuccess ? 'opacity-100' : 'pointer-events-none opacity-0'} delay-100 transition-opacity duration-100 flex absolute z-50 inset-0 top-0 left-0 justify-center items-center w-screen h-screen`}>
                <div className={`bg-contrast1 mb-4 fixed z-[60] rounded-lg w-[440px] text-center text-white p-5 transform transition-all duration-200 ${isSuccess ? 'translate-y-[0%] opacity-100' : 'translate-y-[4px] opacity-0'}`}>
                    <h1 className="text-white text-2xl mt-1 mb-5 font-bold">Success</h1>
                    <p className="text-grey80 text-base text-sm mb-2 max-w-[90%] mx-auto">The transaction has been sent successfully.</p>
                    <div className="space-y-2">
                        <button onClick={confirm} className="mt-5 text-black bg-orange hover:bg-lighterOrange text-sm py-2.5 px-4 w-full rounded-sm">Go to balance</button>
                    </div>
                </div>
                <div className="z-50 fixed bg-black opacity-90 w-screen h-screen top-0 left-0"></div>
            </div>
        </>
    )
}

export default Pending;
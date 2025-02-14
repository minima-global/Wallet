import { useContext } from "react";
import { appContext } from "../../AppContext";
import { useNavigate } from "@tanstack/react-router";
import useTranslation from "../../hooks/useTranslation";
import Button from "../Button";

const Error = () => {
    const { t } = useTranslation();
    const { isError, setIsError } = useContext(appContext);
    const navigate = useNavigate();

    const dismiss = () => {
        setIsError(prev => ({ ...prev, display: false }));
        navigate({ to: '/' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <>
            <div className={`${isError?.display ? 'opacity-100' : 'pointer-events-none opacity-0'} delay-100 transition-opacity duration-100 flex absolute z-50 inset-0 top-0 left-0 justify-center items-center w-screen h-screen`}>
                <div className={`bg-contrast1 mb-4 fixed z-[60] rounded-lg w-[440px] text-center text-white p-5 transform transition-all duration-200 ${isError?.display ? 'translate-y-[0%] opacity-100' : 'translate-y-[4px] opacity-0'}`}>
                    <h1 className="text-white text-2xl mt-1.5 mb-5 font-bold">Error</h1>
                    <p className="text-grey80 text-base text-sm mb-2 max-w-[90%] mx-auto">
                        {isError?.message}
                    </p>
                    <div className="mt-6 space-y-2">
                        <Button variant="tertiary" onClick={dismiss}>
                            {t('go_to_balance')}
                        </Button>
                    </div>
                </div>
                <div className="z-50 fixed bg-black opacity-90 w-screen h-screen top-0 left-0"></div>
            </div>
        </>
    )
}

export default Error;
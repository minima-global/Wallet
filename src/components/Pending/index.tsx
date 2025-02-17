import { useContext, useEffect } from "react";
import { appContext } from "../../AppContext";
import { useNavigate } from "@tanstack/react-router";
import useTranslation from "../../hooks/useTranslation";
import Button from "../Button";

const Pending = () => {
    const { t } = useTranslation();
    const { isPending, setIsPending, setIsDenied, setIsSuccess, setIsError } = useContext(appContext);
    const navigate = useNavigate();

    useEffect(() => {
        const callback = (e: CustomEvent) => {
            if (e.detail.uid && e.detail.uid === isPending?.uid) {
                setIsPending(null);

                if (e.detail.accept) {
                    if (e.detail.result.status) {
                        return setIsSuccess(true);
                    }

                    return setIsError({ display: true, message: e.detail.result.error || "An unknown error occurred, please try again later." });
                }

                return setIsDenied(true);
            }
        }

        window.addEventListener('MDS_PENDING', callback as EventListener);

        return () => {
            window.removeEventListener('MDS_PENDING', callback as EventListener);
        }
    }, [isPending]);

    const skip = () => {
        setIsPending(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigate({ to: '/' });
    }

    return (
        <>
            <div className={`${isPending ? 'opacity-100' : 'pointer-events-none opacity-0'} delay-100 transition-opacity duration-100 flex absolute z-50 inset-0 top-0 left-0 justify-center items-center w-screen h-screen`}>
                <div className={`bg-contrast1 mb-4 fixed z-[60] rounded-lg w-full max-w-[90%] md:max-w-[440px] text-center text-white p-5 transform transition-all duration-200 ${isPending ? 'translate-y-[0%] opacity-100' : 'translate-y-[4px] opacity-0'}`}>
                    <img src="./assets/pending.png" alt="pending" className="w-12 h-12 rounded mx-auto mt-4 mb-6" />
                    <h1 className="text-white text-2xl mt-1.5 mb-5 font-bold">{t('pending')}</h1>
                    <p className="text-grey80 text-base text-sm mb-2 max-w-[90%] mx-auto">{t('pending_transaction_message')}</p>
                    <div className="mt-6 space-y-2">
                        <Button variant="tertiary" onClick={skip}>
                            {t('continue')}
                        </Button>
                    </div>
                </div>
                <div className="z-50 fixed bg-black opacity-90 w-screen h-screen top-0 left-0"></div>
            </div>
        </>
    )
}

export default Pending;
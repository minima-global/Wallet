import { useContext } from "react";
import { useNavigate } from "@tanstack/react-router";
import { appContext } from "../../AppContext";
import useTranslation from "../../hooks/useTranslation";

const Pending = () => {
    const { t } = useTranslation();
    const { isSuccess, setIsSuccess } = useContext(appContext);
    const navigate = useNavigate();

    const confirm = () => {
        if (isSuccess && typeof isSuccess === 'object') {
            isSuccess.callback();
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigate({ to: '/' });
        setIsSuccess(null);
    }

    return (
        <>
            <div className={`${isSuccess ? 'opacity-100' : 'pointer-events-none opacity-0'} delay-100 transition-opacity duration-100 flex absolute z-50 inset-0 top-0 left-0 justify-center items-center w-screen h-screen`}>
                <div className={`bg-contrast1 mb-4 fixed z-[60] rounded-lg w-full max-w-[90%] md:max-w-[440px] text-center text-white p-5 transform transition-all duration-200 ${isSuccess ? 'translate-y-[0%] opacity-100' : 'translate-y-[4px] opacity-0'}`}>
                    <svg className="w-8 h-8 mt-2 mb-4 mx-auto" width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.05 27.427L29.527 13.95L27.7845 12.2385L16.05 23.9925L10.127 18.0695L8.4345 19.781L16.05 27.427ZM19.0035 38C16.3962 38 13.9395 37.5013 11.6335 36.504C9.3275 35.5067 7.311 34.1448 5.584 32.4185C3.857 30.6922 2.4945 28.6765 1.4965 26.3715C0.498833 24.0668 0 21.6108 0 19.0035C0 16.3755 0.498667 13.9053 1.496 11.593C2.49333 9.28067 3.85517 7.26933 5.5815 5.559C7.30783 3.84867 9.3235 2.4945 11.6285 1.4965C13.9332 0.498833 16.3892 0 18.9965 0C21.6245 0 24.0947 0.498666 26.407 1.496C28.7193 2.49333 30.7307 3.84683 32.441 5.5565C34.1513 7.26617 35.5055 9.27667 36.5035 11.588C37.5012 13.8993 38 16.3688 38 18.9965C38 21.6038 37.5013 24.0605 36.504 26.3665C35.5067 28.6725 34.1532 30.689 32.4435 32.416C30.7338 34.143 28.7233 35.5055 26.412 36.5035C24.1007 37.5012 21.6312 38 19.0035 38ZM19 35.7305C23.6563 35.7305 27.6088 34.1012 30.8575 30.8425C34.1062 27.5835 35.7305 23.636 35.7305 19C35.7305 14.3437 34.1062 10.3912 30.8575 7.1425C27.6088 3.89383 23.6563 2.2695 19 2.2695C14.364 2.2695 10.4165 3.89383 7.1575 7.1425C3.89883 10.3912 2.2695 14.3437 2.2695 19C2.2695 23.636 3.89883 27.5835 7.1575 30.8425C10.4165 34.1012 14.364 35.7305 19 35.7305Z" fill="#4FE3C1"/>
                    </svg>
                    <h1 className="text-white text-2xl mt-1 mb-5 font-bold">{t('success')}</h1>
                    <p className="text-grey80 text-base text-sm mb-2 max-w-[90%] mx-auto">{t('this_transaction_has_been_sent_successfully')}</p>
                    <div className="space-y-2">
                        <button onClick={confirm} className="mt-5 text-black bg-orange hover:bg-lighterOrange text-sm py-3 px-4 w-full rounded-sm">{t('go_to_balance')}</button>
                    </div>
                </div>
                <div className="z-50 fixed bg-black opacity-90 w-screen h-screen top-0 left-0"></div>
            </div>
        </>
    )
}

export default Pending;
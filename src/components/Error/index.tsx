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
                <div className={`bg-contrast1 mb-4 fixed z-[60] rounded-lg w-full max-w-[90%] md:max-w-[440px] text-center text-white p-5 transform transition-all duration-200 ${isError?.display ? 'translate-y-[0%] opacity-100' : 'translate-y-[4px] opacity-0'}`}>
                    <svg className="w-8 h-8 mt-2 mb-5 mx-auto" width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.999 28.4615C19.3957 28.4615 19.722 28.3338 19.978 28.0785C20.2337 27.8235 20.3615 27.4977 20.3615 27.101C20.3615 26.7043 20.2338 26.378 19.9785 26.122C19.7235 25.8663 19.3977 25.7385 19.001 25.7385C18.6043 25.7385 18.278 25.866 18.022 26.121C17.7663 26.3763 17.6385 26.7023 17.6385 27.099C17.6385 27.4957 17.7662 27.822 18.0215 28.078C18.2765 28.3337 18.6023 28.4615 18.999 28.4615ZM17.977 21.4075H20.246V8.931H17.977V21.4075ZM19.0165 38C16.3848 38 13.92 37.5013 11.622 36.504C9.32367 35.5067 7.311 34.1448 5.584 32.4185C3.857 30.6922 2.4945 28.6792 1.4965 26.3795C0.498833 24.0802 0 21.6132 0 18.9785C0 16.3565 0.498667 13.892 1.496 11.585C2.49333 9.278 3.85517 7.26933 5.5815 5.559C7.30783 3.84867 9.32083 2.4945 11.6205 1.4965C13.9198 0.498833 16.3868 0 19.0215 0C21.6435 0 24.108 0.498666 26.415 1.496C28.722 2.49333 30.7307 3.84683 32.441 5.5565C34.1513 7.26617 35.5055 9.27667 36.5035 11.588C37.5012 13.8993 38 16.3645 38 18.9835C38 21.6152 37.5013 24.08 36.504 26.378C35.5067 28.6763 34.1532 30.6858 32.4435 32.4065C30.7338 34.1275 28.7233 35.49 26.412 36.494C24.1007 37.498 21.6355 38 19.0165 38ZM19.025 35.7305C23.6647 35.7305 27.6088 34.1012 30.8575 30.8425C34.1062 27.5835 35.7305 23.6277 35.7305 18.975C35.7305 14.3353 34.1093 10.3912 30.867 7.1425C27.6247 3.89383 23.669 2.2695 19 2.2695C14.364 2.2695 10.4165 3.89067 7.1575 7.133C3.89883 10.3753 2.2695 14.331 2.2695 19C2.2695 23.636 3.89883 27.5835 7.1575 30.8425C10.4165 34.1012 14.3723 35.7305 19.025 35.7305Z" fill="#FF627E"/>
                    </svg>
                    <h1 className="text-white text-2xl mt-1.5 mb-5 font-bold">
                        {t("error")}
                    </h1>
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
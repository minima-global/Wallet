import { useContext } from "react";
import { useNavigate } from "@tanstack/react-router";
import { appContext } from "../../AppContext";
import useTranslation from "../../hooks/useTranslation";
import Button from "../Button";

const Pending = () => {
    const { t } = useTranslation();
    const { isDenied, setIsDenied } = useContext(appContext);
    const navigate = useNavigate();

    const confirm = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigate({ to: '/' });
        setIsDenied(false);
    }

    return (
        <>
            <div className={`${isDenied ? 'opacity-100' : 'pointer-events-none opacity-0'} delay-100 transition-opacity duration-100 flex absolute z-50 inset-0 top-0 left-0 justify-center items-center w-screen h-screen`}>
                <div className={`bg-contrast1 mb-4 fixed z-[60] rounded-lg w-full max-w-[90%] md:max-w-[440px] text-center text-white p-5 transform transition-all duration-200 ${isDenied ? 'translate-y-[0%] opacity-100' : 'translate-y-[4px] opacity-0'}`}>
                    <h1 className="text-white text-2xl mt-1 mb-5 font-bold">Denied</h1>
                    <p className="text-grey80 text-base text-sm mb-2 max-w-[90%] mx-auto">
                        Your transaction was denied in the Pending MiniDapp.
                    </p>
                    <div className="space-y-2">
                        <Button onClick={confirm} className="mt-5 text-black bg-orange hover:bg-lighterOrange text-sm py-3 px-4 w-full rounded-sm">
                            {t('go_to_balance')}
                        </Button>
                    </div>
                </div>
                <div className="z-50 fixed bg-black opacity-90 w-screen h-screen top-0 left-0"></div>
            </div>
        </>
    )
}

export default Pending;
import { useRouter } from "@tanstack/react-router";
import useTranslation from "../../hooks/useTranslation";

const BackButton = () => {
    const { t } = useTranslation();
    const router = useRouter();

    const goBack = () => {
        router.history.back();
    }

    return (
        <div onClick={goBack} className="cursor-pointer text-xs flex bg-contrast1 rounded-full flex items-center gap-3 w-fit px-3.5 py-1.5 text-white mb-5 cursor-pointer select-none origin-center active:scale-[0.95] transition-all duration-100">
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.00052 9.711L0.289062 4.99955L5.00052 0.288086L5.77448 1.06204L1.83698 4.99955L5.77448 8.93705L5.00052 9.711Z" fill="#E9E9EB" />
            </svg>
            {t('back')}
        </div>
    )
}

export default BackButton
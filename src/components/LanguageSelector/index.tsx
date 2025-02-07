import { useContext, useState } from "react";
import { appContext } from "../../AppContext";

const LanguageSelector = ({ isAtTop }: { isAtTop: boolean }) => {
    const { language, setLanguage } = useContext(appContext);
    const [isOpen, setIsOpen] = useState(false);
    
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    }

    const handleLanguageClick = (language: string) => {
        setLanguage(language);
        setIsOpen(false);
        localStorage.setItem('minima_language', language);
    }

    return (
        <div>
            <div onClick={toggleOpen} className="relative z-20 cursor-pointer text-white border-[3px] border-contrast2 rounded-full px-3 w-full transition-all active:scale-[95%] flex gap-2 py-1.5 pl-3.5 pr-2.5">
                {language === 'en' && <div className="font-bold">EN</div>}
                {language === 'zh' && <div className="font-bold">汉语</div>}
                {language === 'ru' && <div className="font-bold">Pусский</div>}
                {language === 'ukr' && <div className="font-bold">Українська</div>}
                {language === 'fr' && <div className="font-bold">Français</div>}
                {language === 'es' && <div className="font-bold">Español</div>}
                {language === 'ja' && <div className="font-bold">日本語</div>}
                {language === 'ko' && <div className="font-bold">한국어</div>}
                <svg width="20" height="20" className={`transition-all ${isAtTop ? "" : "scale-[80%]"}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 19.5C8.6975 19.5 7.46833 19.2503 6.3125 18.751C5.15667 18.2517 4.14867 17.5718 3.2885 16.7115C2.42817 15.8513 1.74833 14.8433 1.249 13.6875C0.749667 12.5317 0.5 11.3025 0.5 10C0.5 8.68717 0.749667 7.45542 1.249 6.30475C1.74833 5.15408 2.42817 4.14867 3.2885 3.2885C4.14867 2.42817 5.15667 1.74833 6.3125 1.249C7.46833 0.749667 8.6975 0.5 10 0.5C11.3128 0.5 12.5446 0.749667 13.6953 1.249C14.8459 1.74833 15.8513 2.42817 16.7115 3.2885C17.5718 4.14867 18.2517 5.15408 18.751 6.30475C19.2503 7.45542 19.5 8.68717 19.5 10C19.5 11.3025 19.2503 12.5317 18.751 13.6875C18.2517 14.8433 17.5718 15.8513 16.7115 16.7115C15.8513 17.5718 14.8459 18.2517 13.6953 18.751C12.5446 19.2503 11.3128 19.5 10 19.5ZM10 17.9788C10.5103 17.3019 10.9398 16.6192 11.2885 15.9307C11.6372 15.2422 11.9212 14.4897 12.1405 13.673H7.8595C8.09167 14.5153 8.37892 15.2808 8.72125 15.9693C9.06342 16.6578 9.48967 17.3276 10 17.9788ZM8.0635 17.7038C7.68017 17.1538 7.33592 16.5285 7.03075 15.828C6.72558 15.1273 6.48842 14.409 6.31925 13.673H2.927C3.45517 14.7115 4.1635 15.584 5.052 16.2905C5.9405 16.9968 6.94433 17.4679 8.0635 17.7038ZM11.9365 17.7038C13.0557 17.4679 14.0595 16.9968 14.948 16.2905C15.8365 15.584 16.5448 14.7115 17.073 13.673H13.6807C13.4794 14.4153 13.2262 15.1368 12.921 15.8375C12.616 16.5382 12.2878 17.1602 11.9365 17.7038ZM2.298 12.173H6.0155C5.95267 11.8013 5.90708 11.4369 5.87875 11.0798C5.85058 10.7227 5.8365 10.3628 5.8365 10C5.8365 9.63717 5.85058 9.27725 5.87875 8.92025C5.90708 8.56308 5.95267 8.19867 6.0155 7.827H2.298C2.20183 8.16667 2.12817 8.51983 2.077 8.8865C2.02567 9.25317 2 9.62433 2 10C2 10.3757 2.02567 10.7468 2.077 11.1135C2.12817 11.4802 2.20183 11.8333 2.298 12.173ZM7.51525 12.173H12.4848C12.5474 11.8013 12.5929 11.4402 12.6212 11.0895C12.6494 10.7388 12.6635 10.3757 12.6635 10C12.6635 9.62433 12.6494 9.26117 12.6212 8.9105C12.5929 8.55983 12.5474 8.19867 12.4848 7.827H7.51525C7.45258 8.19867 7.40708 8.55983 7.37875 8.9105C7.35058 9.26117 7.3365 9.62433 7.3365 10C7.3365 10.3757 7.35058 10.7388 7.37875 11.0895C7.40708 11.4402 7.45258 11.8013 7.51525 12.173ZM13.9845 12.173H17.702C17.7982 11.8333 17.8718 11.4802 17.923 11.1135C17.9743 10.7468 18 10.3757 18 10C18 9.62433 17.9743 9.25317 17.923 8.8865C17.8718 8.51983 17.7982 8.16667 17.702 7.827H13.9845C14.0473 8.19867 14.0929 8.56308 14.1212 8.92025C14.1494 9.27725 14.1635 9.63717 14.1635 10C14.1635 10.3628 14.1494 10.7227 14.1212 11.0798C14.0929 11.4369 14.0473 11.8013 13.9845 12.173ZM13.6807 6.327H17.073C16.5385 5.27567 15.835 4.40317 14.9625 3.7095C14.09 3.016 13.0813 2.54167 11.9365 2.2865C12.3198 2.8685 12.6608 3.50508 12.9595 4.19625C13.2583 4.88725 13.4987 5.5975 13.6807 6.327ZM7.8595 6.327H12.1405C11.9083 5.491 11.6163 4.72075 11.2645 4.01625C10.9125 3.31175 10.491 2.64675 10 2.02125C9.509 2.64675 9.0875 3.31175 8.7355 4.01625C8.38367 4.72075 8.09167 5.491 7.8595 6.327ZM2.927 6.327H6.31925C6.50125 5.5975 6.74167 4.88725 7.0405 4.19625C7.33917 3.50508 7.68017 2.8685 8.0635 2.2865C6.91217 2.54167 5.90192 3.01767 5.03275 3.7145C4.16342 4.41117 3.4615 5.282 2.927 6.327Z" fill="currentColor"></path>
                </svg>
            </div>
            <div className={`absolute right-0 top-[100%] z-20 flex h-fit min-w-[123px] flex-col transition-all duration-100 translate-y-2 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}>
                <div className="flex flex-col gap-[2px] bg-contrast1">
                    <button onClick={() => handleLanguageClick("en")} className="bg-contrast2 px-4 py-2 text-white hover:bg-white hover:text-black">English</button>
                    <button onClick={() => handleLanguageClick("zh")} className="bg-contrast2 px-4 py-2 text-white hover:bg-white hover:text-black">汉语</button>
                    <button onClick={() => handleLanguageClick("ja")} className="bg-contrast2 px-4 py-2 text-white hover:bg-white hover:text-black">日本語</button>
                    <button onClick={() => handleLanguageClick("ko")} className="bg-contrast2 px-4 py-2 text-white hover:bg-white hover:text-black">한국어</button>
                    <button onClick={() => handleLanguageClick("ru")} className="bg-contrast2 px-4 py-2 text-white hover:bg-white hover:text-black">Pусский</button>
                    <button onClick={() => handleLanguageClick("ukr")} className="bg-contrast2 px-4 py-2 text-white hover:bg-white hover:text-black">Українська</button>
                    <button onClick={() => handleLanguageClick("fr")} className="bg-contrast2 px-4 py-2 text-white hover:bg-white hover:text-black">Français</button>
                    <button onClick={() => handleLanguageClick("es")} className="bg-contrast2 px-4 py-2 text-white hover:bg-white hover:text-black">Español</button>
                </div>
            </div>
            <div onClick={toggleOpen} className={`fixed top-0 left-0 bg-black w-screen h-screen z-10 ${isOpen ? "opacity-60" : "opacity-0 pointer-events-none"}`}></div>
        </div>
    )
};

export default LanguageSelector;

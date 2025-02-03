import { useContext } from "react";
import { appContext } from "../AppContext";
import ui from "../ui.json";

const useTranslation = () => {
    const { language } = useContext(appContext);
    const uiFile = ui[language];

    const t = (key: string) => {
        return uiFile[key] || key;
    }

    return { t };
}

export default useTranslation;
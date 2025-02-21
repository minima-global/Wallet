import { useContext } from "react";
import { appContext } from "../AppContext";
import ui from "../ui.json";

const useTranslation = () => {
    const { language, setLanguage } = useContext(appContext);
    const defaultFile = ui.en;
    const uiFile = ui[language];

    const languages = Object.keys(ui).map(key => ({
        label: ui[key].label,
        value: key
    }));

    const t = (key: string) => {
        if (!uiFile) {
            setLanguage("en");
            return defaultFile[key];
        }

        return uiFile[key] || key;
    }

    return { t, languages };
}

export default useTranslation;
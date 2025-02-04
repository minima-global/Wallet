import { useContext } from "react";
import { appContext } from "../AppContext";

const useFormatAmount = () => {
    const { currencyType } = useContext(appContext);

    const f = (amount: string) => {
        const [full, decimals] = amount.split(".");

        if (currencyType === "1") {
            const seperator = ".";
            const formattedAmount = new Intl.NumberFormat('en-US').format(Number(full));

            return formattedAmount + (decimals ? seperator + decimals : "");
        }

        if (currencyType === "2") {
            const seperator = ".";
            const formattedAmount = new Intl.NumberFormat('en-US', { useGrouping: false }).format(Number(full));

            return formattedAmount + (decimals ? seperator + decimals : "");
        }

        if (currencyType === "3") {
            const seperator = ".";
            const formattedAmount = new Intl.NumberFormat('fr-FR', { useGrouping: true }).format(Number(full));

            return formattedAmount + (decimals ? seperator + decimals : "");
        }

        if (currencyType === "4") {
            const seperator = ",";
            const formattedAmount = new Intl.NumberFormat('fr-FR', { useGrouping: true }).format(Number(full));

            return formattedAmount + (decimals ? seperator + decimals : "");
        }

        if (currencyType === "5") {
            const seperator = ",";
            const formattedAmount = new Intl.NumberFormat('fr-FR', { useGrouping: false }).format(Number(full));

            return formattedAmount + (decimals ? seperator + decimals : "");
        }


        if (currencyType === "6") {
            const seperator = ",";
            const formattedAmount = new Intl.NumberFormat('de-DE', { useGrouping: true }).format(Number(full));

            return formattedAmount + (decimals ? seperator + decimals : "");
        }

        if (currencyType === "7") {
            const seperator = ".";
            const formattedAmount = new Intl.NumberFormat('de-DE', { useGrouping: false }).format(Number(full));

            return formattedAmount + (decimals ? seperator + decimals : "");
        }  

        if (currencyType === "8") {
            const seperator = ",";
            const formattedAmount = new Intl.NumberFormat('en-US', { useGrouping: true }).format(Number(full));

            return formattedAmount + (decimals ? seperator + decimals : "");
        }
    }

    return { f };
};

export default useFormatAmount;

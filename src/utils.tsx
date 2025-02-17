export const renderTokenName = (token: any) => {
    if (token.tokenid === '0x00') {
        return "Minima";
    }

    return typeof token.token.name === 'string' ? token.token.name : token.token.name.name;
}

export const renderTicker = (balance: any) => {
    if (typeof balance.token === 'object' && balance.token.ticker) {
        if (balance.token.ticker.length >= 5) {
            return;
        }

        return (
            <>
                <span className="text-grey pl-2 pr-2 text-sm">|</span>
                <span className="text-grey80 text-sm">{balance.token.ticker}</span>
            </>
        );
    }

    return;
}

export function toHex(str: string) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        const hex = str.charCodeAt(i).toString(16);
        result += (hex.length === 2 ? hex : '0' + hex);
    }
    return result.toUpperCase();
}

export function escape(str: string) {
    let value = str;

    if (typeof value === "object") {
        value = JSON.stringify(value);
    }

    // Escape all double quotes and wrap the entire value in double quotes
    if (typeof value === "string") {
        value = `"${value.replace(/"/g, '""')}"`;
    }

    return value;
}

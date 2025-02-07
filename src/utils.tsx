export const renderTokenName = (token: any) => {
    if (token.tokenid === '0x00') {
        return "Minima";
    }

    return typeof token.token.name === 'string' ? token.token.name : token.token.name.name;
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

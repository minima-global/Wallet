export const renderTokenName = (token: any) => {
    if (token.tokenid === '0x00') {
        return "Minima";
    }

    return typeof token.token.name === 'string' ? token.token.name : token.token.name.name;
}

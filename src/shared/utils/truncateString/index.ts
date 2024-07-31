export const truncateString = (str: string, startLength: number, endLength: number): string => {
    if (str.length <= startLength + endLength) {
        return str;
    }
    return `${str.substring(0, startLength)}...${str.substring(str.length - endLength)}`;
};

export default truncateString;
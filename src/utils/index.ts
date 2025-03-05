export const spliceString = (name: string, maxLength: number) => {
    if (name.length > maxLength) {
        return name.slice(0, maxLength) + "...";
    }

    return name;
}

export const getCharacterCountAfterChar = (word: string, char: string) => {
    const index = word.indexOf(char);

    if (index === -1) {
        return 0;
    }

    const charactersAfter = word.substring(index + 1);
    const count = charactersAfter.length;

    return count;
};

export default getCharacterCountAfterChar;

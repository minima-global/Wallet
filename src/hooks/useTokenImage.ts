export const useTokenImage = () => {
    const render = (imageData: string) => {
        return `data:image/jpeg;base64,${imageData.replace(/<\/?artimage>/g, '')}`;
    }

    return { render };
}

export default useTokenImage;

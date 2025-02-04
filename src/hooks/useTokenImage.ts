export const useTokenImage = () => {
    const render = (imageData: string, tokenid: string) => {
        try {
            var parser = new DOMParser();
            const doc = parser.parseFromString(imageData, 'application/xml');
            const errorNode = doc.querySelector('parsererror');
            if (errorNode) {
                console.error('Token does not contain an image', tokenid);
            } else {
                var imageString = doc.getElementsByTagName('artimage')[0].innerHTML;
                return `data:image/jpeg;base64,${imageString}`;
            }
        } catch (err) {
            console.error(`Failed to create image data ${tokenid}`, err);
        }
    
        return undefined;
    }

    return { render };
}

export default useTokenImage;

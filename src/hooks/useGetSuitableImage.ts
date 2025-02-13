import { useCallback } from 'react';
import sanitizeHtml from 'sanitize-html';

function useGetSuitableImage() {
    const getImage = useCallback(async (file: File) => {
        const fileAsString = await getDataUrlFromBlob(file);
        const compressedImage = await createImage(fileAsString, 0.6);
        const pureCompressedImage = compressedImage.slice(compressedImage.indexOf(',') + 1);
        var xmlString = '<artimage></artimage>';
        var parser = new DOMParser();
        var xmlDoc: any = parser.parseFromString(xmlString, 'text/xml');
        xmlDoc.firstElementChild.innerHTML = pureCompressedImage;
        var serializer = new XMLSerializer();
        return serializer.serializeToString(xmlDoc);
    }, []);

    return { getImage };
}

function isBlob(blob: undefined | Blob): boolean {
    return blob !== undefined;
}

const getDataUrlFromBlob = (blob: Blob): Promise<string> => {
    const _isBlob = isBlob(blob);
    if (!_isBlob) {
        return Promise.reject('Image is not a Blob');
    }

    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = function () {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject('Error: could not get data url from image');
            }
        };
    });
};

function imageSize(url: string): Promise<{ width: number; height: number }> {
    const img = document.createElement('img');

    const promise = new Promise<{ width: number; height: number }>((resolve, reject) => {
        img.onload = () => {
            const width = img.naturalWidth;
            const height = img.naturalHeight;
            resolve({ width, height });
        };
        img.onerror = reject;
    });

    img.src = sanitizeHtml(url);

    return promise;
}

async function createImage(file: string, quality: number) {
    const image = await imageSize(file);
    let imageWidth = image.width;
    let imageHeight = image.height;

    const img = new Image();
    img.src = sanitizeHtml(file);
    const canvas = document.createElement('canvas');
    const ctx: any = canvas.getContext('2d');

    //Set a Maximum size..
    const MAX_IMAGE_SIZE = 80;

    //Do we need to resize
    if (imageWidth > MAX_IMAGE_SIZE || imageHeight > MAX_IMAGE_SIZE) {
        //Which is bigger - keep aspect ratio
        if (imageWidth > imageHeight) {
            let ratio = MAX_IMAGE_SIZE / imageWidth;

            imageWidth = MAX_IMAGE_SIZE;
            imageHeight *= ratio;
        } else {
            let ratio = MAX_IMAGE_SIZE / imageHeight;

            imageHeight = MAX_IMAGE_SIZE;
            imageWidth *= ratio;
        }
    }

    canvas.width = imageWidth;
    canvas.height = imageHeight;
    ctx.drawImage(img, 0, 0, imageWidth, imageHeight);

    return canvas.toDataURL('image/jpeg', quality);
}

export default useGetSuitableImage;

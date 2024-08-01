export const compressImage = async (fileAsUrl: string): Promise<string> => {
    // Extract the MIME type from the base64 string
    const mimeType = fileAsUrl.substring(fileAsUrl.indexOf(":") + 1, fileAsUrl.indexOf(";"));
    return new Promise((resolve) => {
        const img = new Image();
        img.src = fileAsUrl;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

            const MAX_IMAGE_SIZE = 50; // for dat 50K HD resolution

            let imageWidth = img.width;
            let imageHeight = img.height;

            if (imageWidth > MAX_IMAGE_SIZE || imageHeight > MAX_IMAGE_SIZE) {
                // Calculate the aspect ratio
                const aspectRatio = imageWidth / imageHeight;

                // Calculate the new width and height
                if (imageWidth > imageHeight) {
                    imageWidth = MAX_IMAGE_SIZE;
                    imageHeight = MAX_IMAGE_SIZE / aspectRatio;
                } else {
                    imageHeight = MAX_IMAGE_SIZE;
                    imageWidth = MAX_IMAGE_SIZE * aspectRatio;
                }
            }

            canvas.width = imageWidth;
            canvas.height = imageHeight;

            ctx.drawImage(img, 0, 0, imageWidth, imageHeight);

            const quality = 0.7; // Set quality for compression
            resolve(canvas.toDataURL(mimeType, quality));
        };

        img.onerror = () => {
            resolve(fileAsUrl); // In case of error, return the original image URL
        };
    });
};


export const base64ToBlob = (base64: string): Blob => {
    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];

    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
        intArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([intArray], { type: mimeString });
};

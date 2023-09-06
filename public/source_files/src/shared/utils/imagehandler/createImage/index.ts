import sanitizeHtml from 'sanitize-html';
import imageSize from '../getImageSize';

/**
 * creds to dynamitesushi & neil shah
 */

// async function createImage(file: any, resize = 0.5, quality = 0.8) {
//     // console.log("creating image...")
//     const image = await imageSize(file);
//     const imageWidth = image.width;
//     const imageHeight = image.height;

//     const img = new Image();
//     img.src = sanitizeHtml(file);
//     const canvas = document.createElement('canvas');
//     const ctx: any = canvas.getContext('2d');
//     canvas.width = imageWidth * resize;
//     canvas.height = imageHeight * resize;
//     ctx.drawImage(img, 0, 0, imageWidth * resize, imageHeight * resize);

//     return canvas.toDataURL('image/jpeg', quality);
// }
async function createImage(file: any, resize = 1, quality = 0.7) {
    // console.log("creating image...")
    const image = await imageSize(file);
    let imageWidth = image.width;
    let imageHeight = image.height;

    const img = new Image();
    img.src = sanitizeHtml(file);
    const canvas = document.createElement('canvas');
    const ctx: any = canvas.getContext('2d');

    //Set a Maximum size..
    const MAX_IMAGE_SIZE = 128;

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

export default createImage;

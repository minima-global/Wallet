/**
 * creds to dynamitesushi & neil shah
 */
import imageSize from "../getImageSize";

async function createImage(file: any, resize = 1, quality = 0.8) {
    // console.log("creating image...")
    const image = await imageSize(file);
    const imageWidth = image.width;
    const imageHeight = image.height;
    
    const img = new Image();
    img.src = file;
    const canvas = document.createElement("canvas");
    const ctx: any = canvas.getContext("2d");
    canvas.width = imageWidth * resize;
    canvas.height = imageHeight * resize;
    ctx.drawImage(img, 0, 0, imageWidth * resize, imageHeight * resize);

    
    return canvas.toDataURL("image/jpeg", quality);
}

export default createImage;
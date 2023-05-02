/**
 * creds to dynamitesushi & neil shah
 */
import config from "../config";
import createImage from "../createImage";
import getDataUrlFileSize from "../getDataUrlFileSize";

async function getSuitableImage(file: any) {
    let image = "";

    for (const imageConfig of config) {
        
        const compressedImage = await createImage(file, imageConfig.resize, imageConfig.quality);
        const size = getDataUrlFileSize(compressedImage);

        if (size.kilobytes < 10) {
            image = compressedImage;
            break;
        }
    }
    return image;
}

export default getSuitableImage;
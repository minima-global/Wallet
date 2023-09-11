/**
 * creds to dynamitesushi & neil shah
 */
import createImage from '../createImage';

async function getSuitableImage(file: any) {
    return await createImage(file, 0.6);
}

export default getSuitableImage;

// /**
//  *
//  * Handle NFT Image Compression + Building
//  *
//  */
import getSuitableImage from '../../shared/utils/imagehandler/getSuitableImage';
import { createCustomToken } from '../rpc-commands';
import { MiCustomToken, MiNFT } from '../../@types/nft';

const buildCustomTokenCreation = async (tokenData: MiNFT | MiCustomToken, amount: string, nft: boolean) => {
    try {
        // if this is a data uri then compress it..
        if (tokenData.url.startsWith('data:image/', 0)) {
            // console.log('it does start with data:image/');
            const compressedImage = await getSuitableImage(tokenData.url);
            const pureCompressedImage = compressedImage.slice(compressedImage.indexOf(',') + 1);
            var xmlString = '<artimage></artimage>';
            var parser = new DOMParser();
            var xmlDoc: any = parser.parseFromString(xmlString, 'text/xml');
            xmlDoc.firstElementChild.innerHTML = pureCompressedImage;
            var serializer = new XMLSerializer();
            tokenData.url = serializer.serializeToString(xmlDoc);
        }

        return await createCustomToken(
            JSON.stringify(tokenData),
            amount,
            nft ? '0' : undefined,
            tokenData.webvalidate
        ).catch((err) => {
            throw err;
        });
    } catch (error: any) {
        throw new Error(error);
    }
};

export { buildCustomTokenCreation };

import getSuitableImage from '../../../../shared/utils/imagehandler/getSuitableImage';

export const createToken = async (data: any, amount: string, decimals: number): Promise<2 | 3> => {
    return new Promise(async (resolve, reject) => {
        if (data.url.startsWith('data:image/', 0)) {
            // console.log('it does start with data:image/');
            const compressedImage = await getSuitableImage(data.url);
            const pureCompressedImage = compressedImage.slice(compressedImage.indexOf(',') + 1);
            var xmlString = '<artimage></artimage>';
            var parser = new DOMParser();
            var xmlDoc: any = parser.parseFromString(xmlString, 'text/xml');
            xmlDoc.firstElementChild.innerHTML = pureCompressedImage;
            var serializer = new XMLSerializer();
            data.url = serializer.serializeToString(xmlDoc);
        }

        window.MDS.cmd(
            `tokencreate name:"${JSON.stringify(data)}" amount:"${amount}" decimals:"${decimals}`,
            (resp: any) => {
                if (!resp.status && !resp.pending)
                    reject(
                        resp.error ? resp.error : resp.message ? resp.message : 'Sending failed, please try again later'
                    );

                if (!resp.status && resp.pending) resolve(3);

                if (resp.status) resolve(2);
            }
        );
    });
};

export default createToken;

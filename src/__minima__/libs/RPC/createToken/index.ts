import getSuitableImage from '../../../../shared/utils/imagehandler/getSuitableImage';

export const createToken = async (data: any, amount: string, decimals: number, burn: string): Promise<2 | 3> => {
    return new Promise(async (resolve, reject) => {
        if (data.url.startsWith('data:image/', 0)) {
            const compressedImage = await getSuitableImage(data.url);
            const pureCompressedImage = compressedImage.slice(compressedImage.indexOf(',') + 1);
            var xmlString = '<artimage></artimage>';
            var parser = new DOMParser();
            var xmlDoc: any = parser.parseFromString(xmlString, 'text/xml');
            xmlDoc.firstElementChild.innerHTML = pureCompressedImage;
            var serializer = new XMLSerializer();
            data.url = serializer.serializeToString(xmlDoc);
        }

        (window as any).MDS.cmd(
            `tokencreate name:"${JSON.stringify(data)}" amount:"${amount}" decimals:"${decimals}" ${burn.length ? "burn:"+burn : ""}`,
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

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

const FAVORITESTABLE = 'FAVORITES';
function createFavoritesTable() {
    const Q = `create table if not exists ${FAVORITESTABLE} (id bigint auto_increment, tokenid varchar(255))`;

    return new Promise((resolve) => {
        MDS.sql(Q, function (res) {
            // MDS.log(`MDS.SQL, ${Q}`);

            if (res.status) {
                resolve(true);
            }
        });
    });
}
function selectFavorites(): Promise<string[]> {
    const Q = `SELECT * FROM ${FAVORITESTABLE}`;
    return new Promise((resolve, reject) => {
        MDS.sql(Q, function (res) {
            if (res.status) {
                // console.log(res.rows);
                resolve(res.rows.map((r: any) => r.TOKENID));
            } else {
                reject('SQL error, please report logs to admin.');
            }
        });
    });
}

function showTablesCount() {
    const Q = `SHOW TABLES`;
    return new Promise((resolve, reject) => {
        MDS.sql(Q, function (res) {
            if (res.status) {
                resolve(res.count);
            }
        });
    });
}

function addTokenToFavoritesTable(tokenid: string) {
    const Q = `insert into ${FAVORITESTABLE}(tokenid) values('${tokenid}')`;

    return new Promise((resolve, reject) => {
        MDS.sql(Q, function (res) {
            // MDS.log(`MDS.SQL, ${Q}`);
            // console.log(res);
            if (res.status) {
                resolve(true);
            } else {
                reject(`${res.error}`);
            }
        });
    });
}

function removeTokenFromFavoritesTable(tokenid: string) {
    const Q = `DELETE FROM ${FAVORITESTABLE} WHERE TOKENID='${tokenid}'`;

    return new Promise((resolve, reject) => {
        MDS.sql(Q, function (res) {
            // MDS.log(`MDS.SQL, ${Q}`);
            // console.log(res);
            if (res.status) {
                resolve(true);
            } else {
                reject(`${res.error}`);
            }
        });
    });
}

export {
    buildCustomTokenCreation,
    createFavoritesTable,
    selectFavorites,
    addTokenToFavoritesTable,
    removeTokenFromFavoritesTable,
    showTablesCount,
};

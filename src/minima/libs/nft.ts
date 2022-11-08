// /**
//  * 
//  * Handle NFT Image Compression + Building
//  * 
//  */
import { isValidURLAll } from '../../shared/functions';
import getSuitableImage from '../../shared/utils/imagehandler/getSuitableImage';
import { createCustomToken } from '../rpc-commands';
import { MiCustomToken, MiNFT } from '../types/nft';


export {buildCustomTokenCreation, createFavoritesTable, selectFavorites, addTokenToFavoritesTable, removeTokenFromFavoritesTable}
const buildCustomTokenCreation = async (tokenData: MiNFT | MiCustomToken) => {
  
  // this is an url img
  if (isValidURLAll(tokenData.url)) {
    return createCustomToken(JSON.stringify(tokenData), tokenData.type === 'NFT' ? '1' : tokenData.amount, tokenData.type === 'NFT' ? '0' : undefined, tokenData.webvalidate || '')
  } 


  const compressedImage = await getSuitableImage(tokenData.url);
  const pureCompressedImage = compressedImage.slice(compressedImage.indexOf(",") + 1);
  var xmlString = '<artimage></artimage>'
  var parser = new DOMParser()
  var xmlDoc: any = parser.parseFromString(xmlString, 'text/xml')
  xmlDoc.firstElementChild.innerHTML = pureCompressedImage
  var serializer = new XMLSerializer()
  var imageXmlString = serializer.serializeToString(xmlDoc)

  tokenData.url = imageXmlString;
  return createCustomToken(JSON.stringify(tokenData), tokenData.type === 'NFT' ? '1' : tokenData.amount, tokenData.type === 'NFT' ? '0' : undefined, tokenData.webvalidate || '' )
}


const FAVORITESTABLE = 'FAVORITES';
 function createFavoritesTable() {
  const Q = `create table if not exists ${FAVORITESTABLE} (id int auto_increment primary key, tokenid varchar(255))`;

  return new Promise((resolve, reject) => {
    MDS.sql(Q, function(res) {
      // MDS.log(`MDS.SQL, ${Q}`);
      // console.log(res);
      if (res.status) {
        resolve(true)
      } else {
        reject(`${res.error}`);
      }
    })
  })
}
 function selectFavorites() {
  const Q = `SELECT * FROM ${FAVORITESTABLE}`;
  return new Promise((resolve, reject) => {
    MDS.sql(Q, function(res) {
      // MDS.log(`MDS.SQL, ${Q}`);
      // console.log(res);
      if (res.status) {
        if (res.count) {
          resolve(res.rows); // {ID, TOKENID}[]
        } else {
          resolve([])
        }
      } else {
        reject("SQL error, please report logs to admin.")
      }
    })
  })
}

 function addTokenToFavoritesTable(tokenid: string) {
  const Q = `insert into ${FAVORITESTABLE}(tokenid) values('${tokenid}')`;
  
  return new Promise((resolve, reject) => {
    MDS.sql(Q, function(res) {
      // MDS.log(`MDS.SQL, ${Q}`);
      // console.log(res);
      if (res.status) {
        resolve(true)
      } else {
        reject(`${res.error}`);
      }
    })
  })
  
}


 function removeTokenFromFavoritesTable(tokenid: string) {
  const Q = `DELETE FROM ${FAVORITESTABLE} WHERE TOKENID='${tokenid}'`;
  
  return new Promise((resolve, reject) => {
    MDS.sql(Q, function(res) {
      // MDS.log(`MDS.SQL, ${Q}`);
      // console.log(res);
      if (res.status) {
        resolve(true)
      } else {
        reject(`${res.error}`);
      }
    })
  })
  
}

// /**
//  * 
//  * Handle NFT Image Compression + Building
//  * 
//  */

import { callCreateNFT } from './../rpc-commands';
import { Token } from "../types/minima"

export const buildUserNFT = (imageDataUrl: string, compressionFactor: number, data: any): Promise<string | Token> => {
  return resizeImage(imageDataUrl, compressionFactor).then((resizedImageDataUrl) => {
      console.log('resizedImageDataUrl', resizedImageDataUrl)
      const onlyString = resizedImageDataUrl.slice(resizedImageDataUrl.indexOf(',') + 1)
      return createNFTWithImage(onlyString, data)
  })
}

export function resizeImage(imageDataUrl: string, compressionFactor: number): Promise<string> {
  return new Promise((resolve, reject) => {
      let imageNode = document.createElement('img')
      imageNode.src = imageDataUrl
      let canvas: any = document.createElement('canvas')

      var ctx = canvas.getContext('2d')

      imageNode.addEventListener(
          'load',
          function () {
              // execute drawImage statements here
              // ctx.drawImage(imageNode, 0, 0, imageNode.width, imageNode.height)

              canvas.width = 300
              canvas.height = 150
              ctx.drawImage(imageNode, 0, 0, imageNode.width, imageNode.height, 0, 0, canvas.width, canvas.height)

              let url = ''
              url = canvas.toDataURL('image/jpeg', compressionFactor) // get the data from canvas as 70% JPG (can be also PNG, etc.)
              canvas = null // or some way to destroy the element

              resolve(url)
          },
          false
      )
  })
}


function createNFTWithImage(encodedImage: string, data: any): Promise<string | Token> {
  return new Promise((resolve, reject) => {
      // handle image compression part..
      var xmlString = '<artimage></artimage>'
      var parser = new DOMParser()
      var xmlDoc: any = parser.parseFromString(xmlString, 'text/xml')
      xmlDoc.firstElementChild.innerHTML = encodedImage
      var serializer = new XMLSerializer()
      var imageXmlString = serializer.serializeToString(xmlDoc)

      data.image = imageXmlString;
      console.log(`CREANFT WITHIMAGE`)
      callCreateNFT(data).then((res: any) => {
        console.log(`callCreateNFT result`, res);
        resolve(res)
      }).catch((err) => {
        console.error(`callCreateNFT error`, err);
        reject(err);
      })
      
      
  })
}

const FAVORITESTABLE = 'FAVORITES';
export function createFavoritesTable() {
  const Q = `create table if not exists ${FAVORITESTABLE} (id int auto_increment primary key, tokenid varchar(255))`;

  MDS.sql(Q, function(res) {
    MDS.log(`MDS.SQL, ${Q}`);
    console.log(res);
  })

}
export function selectFavorites() {
  const Q = `SELECT * FROM ${FAVORITESTABLE}`;
  return new Promise((resolve, reject) => {
    
    MDS.sql(Q, function(res) {
      MDS.log(`MDS.SQL, ${Q}`);
      console.log(res);
      if (res.status) {
        if (res.count) {
          resolve(res.rows); // {ID, TOKENID}[]
        } else {
          resolve([])
        }
      } else {
        reject("SQL ERROR")
      }
    })
  })
}

export function addTokenToFavoritesTable(tokenid: string) {
  const Q = `insert into ${FAVORITESTABLE}(tokenid) values('${tokenid}')`;
  
  MDS.sql(Q, function(res) {
    MDS.log(`MDS.SQL, ${Q}`);
    console.log(res);
  })
  
}


export function removeTokenFromFavoritesTable(tokenid: string) {
  const Q = `DELETE FROM ${FAVORITESTABLE} WHERE TOKENID='${tokenid}'`;
  
  MDS.sql(Q, function(res) {
    MDS.log(`MDS.SQL, ${Q}`);
    console.log(res);
  })
  
}

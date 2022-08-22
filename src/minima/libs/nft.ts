// /**
//  * 
//  * Handle NFT Image Compression + Building
//  * 
//  */

import { callCreateNFTWithBlob } from './../rpc-commands';
import { Token } from '../types/minima2';

// expected interface

// "name":"testing",
// "description":"",
// "external_url":"",
// "image":"<artimage>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</artimage>",
// "owner":"",
// "nft":"true",
// "webvalidate":""

export const isTokenNFT = (candidate: any) => {
  // check whether this is a NFT token Wallet understands..

}

export const isToken = (candidate: any) => {

}

export const buildUserNFT = (imageDataUrl: string, compressionFactor: number, data: any): Promise<string | Token> => {
  return resizeImage(imageDataUrl, compressionFactor).then((resizedImageDataUrl) => {
      //console.log('resizedImageDataUrl', resizedImageDataUrl)
      const onlyString = resizedImageDataUrl.slice(resizedImageDataUrl.indexOf(',') + 1)
      return createNFTWithImage(onlyString, data)
  })
}

export function resizeImage(imageDataUrl: string, compressionFactor: number): Promise<any> {
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

              // var ctxWidth    = ctx.canvas.width;
              // var ctxHeight   = ctx.canvas.height;
              // var imgWidth    = imageNode.width;
              // var imgHeight   = imageNode.height;
              // var ratioWidth  = imgWidth  / ctxWidth;
              // var ratioHeight = imgHeight / ctxHeight;
              // var ratioAspect = ratioWidth > 1 ? ratioWidth : ratioHeight > 1 ? ratioHeight : 1;
              // var newWidth    = imgWidth / ratioAspect;
              // var newHeight   = imgHeight / ratioAspect;
              // var offsetX     = (ctxWidth  / 2) - (newWidth  / 2);
              // var offsetY     = (ctxHeight / 2) - (newHeight / 2);
              // console.log('CTXWIDTH', ctxWidth);
              // console.log('CTXHEIGHT', ctxHeight);
              // console.log('imgWIDTH', imgWidth);
              // console.log('imgHEIGHT', imgHeight);
              // console.log('ratioWidth', ratioWidth);
              // console.log('ratioHeight', ratioHeight);
              // console.log('newWidth', newWidth);
              // console.log('newHeight', newHeight);
              let ratioAspect = 300/imageNode.width;
              canvas.width = 300;
              canvas.height = imageNode.height * ratioAspect;


              // canvas.width = 300
              // canvas.height = 150
              // ctx.drawImage(imageNode, 0, 0, imageNode.width, imageNode.height, 0, 0, canvas.width, canvas.height)

              // ctx.clearRect(0, 0, ctxWidth, ctxHeight);
              ctx.drawImage(imageNode, 0, 0, canvas.width, canvas.height);
              

              let url = ''
              url = canvas.toDataURL('image/jpeg', compressionFactor) // get the data from canvas as 70% JPG (can be also PNG, etc.)
              canvas = null // or some way to destroy the element

              resolve(url)
          },
          false
      )
  })
}


function createNFTWithImage(encodedImage: string, data: any): Promise<any> {
  return new Promise((resolve, reject) => {
      // handle image compression part..
      var xmlString = '<artimage></artimage>'
      var parser = new DOMParser()
      var xmlDoc: any = parser.parseFromString(xmlString, 'text/xml')
      xmlDoc.firstElementChild.innerHTML = encodedImage
      var serializer = new XMLSerializer()
      var imageXmlString = serializer.serializeToString(xmlDoc)

      callCreateNFTWithBlob(data, imageXmlString).then((res: any) => {
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
export function selectFavorites() {
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

export function addTokenToFavoritesTable(tokenid: string) {
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


export function removeTokenFromFavoritesTable(tokenid: string) {
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

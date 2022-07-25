import { callCreateNFTWithBlob } from './../rpc-commands';
// /**
//  * 
//  * Handle NFT Image Compression + Building
//  * 
//  */

import { callCreateNFT } from './../rpc-commands';
import { Token } from "../types/minima"

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

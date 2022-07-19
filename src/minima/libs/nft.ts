import { callCreateNFT } from './../rpc-commands';
// /**
//  * 
//  * Handle NFT Image Compression + Building
//  * 
//  */

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

      callCreateNFT(data).then((res: any) => {
        console.log(`callCreateNFT result`, res);
        resolve(res)
      }).catch((err) => {
        console.error(`callCreateNFT error`, err);
        reject(err);
      })
      
      // const command = `tokencreate name:${nftName} amount:1.0 description:${imageXmlString}`

      // MDS.cmd(command, (res) => {
      //     if (
      //         res.status &&
      //         res.response &&
      //         res.response.txpow &&
      //         res.response.txpow.body &&
      //         res.response.txpow.body.txn &&
      //         res.response.txpow.body.txn.tokengen
      //     ) {
      //         resolve(res.response.txpow.body.txn.tokengen)
      //     } else {
      //         reject(res.message)
      //     }
      // })
  })
}
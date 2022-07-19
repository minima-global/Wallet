// /**
//  * 
//  * Handle NFT Image Compression + Building
//  * 
//  */

// buildUserNFT = (imageDataUrl: string, compressionFactor: number, nameStr?: string): Promise<string | Token> => {
//   return resizeImage(imageDataUrl, compressionFactor).then((resizedImageDataUrl) => {
//       console.log('resizedImageDataUrl', resizedImageDataUrl)
//       const onlyString = resizedImageDataUrl.slice(resizedImageDataUrl.indexOf(',') + 1)
//       return createNFTWithImage(onlyString, nameStr)
//   })
// }

// function resizeImage(imageDataUrl: string, compressionFactor: number): Promise<string> {
//   return new Promise((resolve, reject) => {
//       let imageNode = document.createElement('img')
//       imageNode.src = imageDataUrl
//       let canvas: any = document.createElement('canvas')

//       var ctx = canvas.getContext('2d')

//       imageNode.addEventListener(
//           'load',
//           function () {
//               // execute drawImage statements here
//               // ctx.drawImage(imageNode, 0, 0, imageNode.width, imageNode.height)

//               canvas.width = 300
//               canvas.height = 150
//               ctx.drawImage(imageNode, 0, 0, imageNode.width, imageNode.height, 0, 0, canvas.width, canvas.height)

//               let url = ''
//               url = canvas.toDataURL('image/jpeg', compressionFactor) // get the data from canvas as 70% JPG (can be also PNG, etc.)
//               canvas = null // or some way to destroy the element

//               resolve(url)
//           },
//           false
//       )
//   })
// }

// function buildNFT(nameStr?: string): Promise<string | Token> {
//   return getResizedImage(0.2).then(
//       (encoded) => {
//           // console.log('NFT image string', encoded)
//           const onlyString = encoded.slice(encoded.indexOf(',') + 1)
//           return createNFTWithImage(onlyString, nameStr)
//       },
//       (err: any) => JSON.stringify(err)
//   )
// }

// function getResizedImage(compressionFactor: number): Promise<string> {
//   // Read the files using the HTML5 FileReader API with .readAsArrayBuffer

//   // Create a Blob with the file data and get its url with window.URL.createObjectURL(blob)

//   // Create new Image element and set it's src to the file blob url

//   // Send the image to the canvas. The canvas size is set to desired output size

//   // Get the scaled-down data back from canvas via canvas.toDataURL("image/jpeg",0.7) (set your own output format and quality)

//   // Attach new hidden inputs to the original form and transfer the dataURI images basically as normal text

//   // On backend, read the dataURI, decode from Base64, and save it

//   return getArtDataUrl().then(
//       (imageUrl: string) => {
//           let imageNode = document.createElement('img')
//           imageNode.src = imageUrl
//           // let canvas: any = document.getElementById('canvas')
//           // const div = document.getElementById('imageDiv')
//           // div.appendChild(imageNode)
//           // console.log('load and display image with javascript')

//           let canvas: any = document.createElement('canvas')

//           let width = imageNode.width
//           let height = imageNode.height

//           var ctx = canvas.getContext('2d')
//           ctx.drawImage(imageNode, 0, 0, 300, 150)

//           // ctx.fillStyle = 'green';
//           // ctx.fillRect(10, 10, 150, 100);

//           let url = ''
//           url = canvas.toDataURL('image/jpeg', compressionFactor) // get the data from canvas as 70% JPG (can be also PNG, etc.)
//           canvas = null // or some way to destroy the element

//           return url
//       },
//       (err: any) => JSON.stringify(err)
//   )
// }


// function createNFTWithImage(encodedImage: string, nameStr?: string): Promise<string | Token> {
//   return new Promise((resolve, reject) => {
//       let nftName = (Math.random() + 1).toString(36).substring(7)
//       nftName = 'NFT-' + nftName
//       if (typeof nameStr !== 'undefined') {
//           nftName = nameStr
//       }
//       // const encodedImageJSON = JSON.stringify({ artImage: encodedImage })

//       var xmlString = '<artimage></artimage>'
//       var parser = new DOMParser()
//       var xmlDoc: any = parser.parseFromString(xmlString, 'text/xml')
//       xmlDoc.firstElementChild.innerHTML = encodedImage
//       var serializer = new XMLSerializer()
//       var imageXmlString = serializer.serializeToString(xmlDoc)

//       const command = `tokencreate name:${nftName} amount:1.0 description:${imageXmlString}`

//       Minima.cmd(command, (res) => {
//           if (
//               res.status &&
//               res.response &&
//               res.response.txpow &&
//               res.response.txpow.body &&
//               res.response.txpow.body.txn &&
//               res.response.txpow.body.txn.tokengen
//           ) {
//               resolve(res.response.txpow.body.txn.tokengen)
//           } else {
//               reject(res.message)
//           }
//       })
//   })
// }
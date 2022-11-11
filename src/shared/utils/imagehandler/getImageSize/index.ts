/**
 * creds to dynamitesushi & neil shah
 */

function imageSize(url: any): Promise<{ width: number; height: number }> {
  
  const img = document.createElement("img");

  const promise = new Promise<{ width: number; height: number }>((resolve, reject) => {
     
    img.onload = () => {
          const width = img.naturalWidth;
          const height = img.naturalHeight;
          resolve({ width, height });
      };
      // console.log(img.onerror)
      img.onerror = reject;
  });

  img.src = url;
  

  return promise;
}

export default imageSize;
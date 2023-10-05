export const saveFileAsBinary = (fileName: string, hexString: string) => {
  return new Promise((resolve) => {
    (window as any).MDS.file.savebinary(fileName, hexString, (res: any) => {
      resolve(res);
    });
  });
};

export default saveFileAsBinary;

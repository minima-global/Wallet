export const loadFile = (path: string) => {
  return new Promise((resolve, reject) => {
    (window as any).MDS.file.load(path, (res: any) => {
      if (!res.status) {
        reject("File not found");
      }
      resolve(res.response);
    });
  });
};

export default loadFile;

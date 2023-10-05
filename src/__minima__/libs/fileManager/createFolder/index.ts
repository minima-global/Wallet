export const createFolder = (folder: string) => {
  return new Promise((resolve) => {
    (window as any).MDS.file.makedir(folder, (res: any) => {
      resolve(res);
    });
  });
};

export default createFolder;

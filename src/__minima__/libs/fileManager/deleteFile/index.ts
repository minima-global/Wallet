export const deleteFile = (fileName: string) => {
  return new Promise((resolve, reject) => {
    (window as any).MDS.file.delete(fileName, (res: any) => {
      if (res.status) {
        return resolve(res);
      }

      return reject("Failed to delete backup.");
    });
  });
};

export default deleteFile;

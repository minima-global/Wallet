export const moveFileToBackups = (filePath: string) => {
  return new Promise((resolve) => {
    (window as any).MDS.file.move(filePath, "/backups", (res: any) => {
      // console.log(res);
      resolve(res);
    });
  });
};

export default moveFileToBackups;

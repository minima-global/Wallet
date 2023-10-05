export const getPath = (filename: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    (window as any).MDS.file.getpath(filename, (response: any) => {
      if (response.status) {
        resolve(response.response.getpath.path);
      }

      if (!response.status && !response.pending) {
        reject(response.error ? response.error : "RPC FAILED");
      }
    });
  });
};

export default getPath;

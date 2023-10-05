export const loadBinaryToHex = (filename: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    (window as any).MDS.file.loadbinary(filename, (res: any) => {
      if (!res.status) return reject(res.error ? res.error : "RPC FAILED");

      resolve(res.response.load.data.substring(2));
    });
  });
};

export default loadBinaryToHex;

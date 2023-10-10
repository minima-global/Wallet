export const isVaultLocked = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    (window as any).MDS.cmd(`status`, (response: any) => {
      if (!response.status)
        reject(response.error ? response.error : "Rpc failed");

      if (response.status) {
        const isLocked = response.response.locked;

        resolve(isLocked);
      }
    });
  });
};

export default isVaultLocked;

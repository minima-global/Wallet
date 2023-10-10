export function isWriteMode(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    (window as any).MDS.cmd(`checkmode`, function (response: any) {
      if (response.status) {
        return resolve(response.response.mode === "WRITE");
      }

      return reject();
    });
  });
}

export default isWriteMode;

export const toggleBackupStatus = (status: boolean) => {
  return new Promise((resolve) => {
    const backupStatus = {
      active: status,
    };
    (window as any).MDS.keypair.set(
      "backupStatus",
      JSON.stringify(backupStatus),
      (response: any) => {
        // console.log(response);
        resolve(response.status);
      }
    );
  });
};

export const getBackupStatus = () => {
  return new Promise((resolve) => {
    (window as any).MDS.keypair.get("backupStatus", (response: any) => {
      resolve(response);
    });
  });
};

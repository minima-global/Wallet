export const consolidate = (tokenid: string, burn: string, password: string): Promise<2 | 3> => {
    return new Promise((resolve, reject) => {
        const hasBurn = burn && burn.length ? burn : false;
        const hasPassword = password && password.length ? password : false;

        (window as any).MDS.cmd(
            `consolidate tokenid:${tokenid} ${hasBurn ? 'burn:' + burn : ''} ${
                hasPassword ? 'password:' + hasPassword : ''
            }`,
            (resp: any) => {
                if (!resp.status && !resp.pending)
                    reject(
                        resp.error
                            ? resp.error
                            : resp.message
                            ? resp.message
                            : 'Consolidating failed, please try again later'
                    );

                if (!resp.status && resp.pending) resolve(3);

                if (resp.status) resolve(2);
            }
        );
    });
};

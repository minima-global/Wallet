import { MinimaToken } from '../@types/minima';

const callSend = async (
    token: MinimaToken,
    amount: string,
    address: string,
    message: string,
    burn: string,
    password: string
): Promise<2 | 3> => {
    return new Promise((resolve, reject) => {
        const hasPassword = password && password.length ? password : false;
        const hasBurn = burn && parseInt(burn) > 0 ? burn : false;
        (window as any).MDS.cmd(
            `send amount:${amount} address:${address} tokenid:${token.tokenid} ${hasBurn ? 'burn:' + hasBurn : ''} ${
                hasPassword ? 'password:' + hasPassword : ''
            } ${message.length > 0 ? `state:{"44":"[${message}]"}` : ''}`,
            (resp: any) => {
                if (!resp.status && !resp.pending)
                    reject(
                        resp.error ? resp.error : resp.message ? resp.message : 'Sending failed, please try again later'
                    );

                if (!resp.status && resp.pending) resolve(3);

                if (resp.status) resolve(2);
            }
        );
    });
};
const callGetAddress = async () => {
    try {
        const getaddress = await rpc(`getaddress`);

        return getaddress.miniaddress;
    } catch (err: any) {
        throw new Error(err);
    }
};
const callStatus = async (): Promise<any> => {
    try {
        const nodeStatus = await rpc(`status`);

        return nodeStatus;
    } catch (err: any) {
        throw new Error(err);
    }
};

const createCustomToken = async (
    name: string,
    amount: string,
    decimals?: string,
    webvalidate?: string,
    burn?: string
) => {
    const hasBurn = burn && burn.length ? burn : false;
    return await rpc(
        `tokencreate name:${name} amount:${amount} ${decimals ? 'decimals:' + decimals : ''} ${
            webvalidate ? 'webvalidate:' + webvalidate : ''
        } ${hasBurn ? 'burn:' + hasBurn : ''}`
    ).catch((err) => {
        throw err;
    });
};

/** Get Balance */

const getWalletBalance = (): Promise<MinimaToken[]> => {
    return new Promise((resolve, reject) => {
        rpc(`balance`)
            .then((wallet) => {
                resolve(wallet);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

/** Rpc cmd v2 */

export const rpc = (command: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        (window as any).MDS.cmd(command, (resp: any) => {
            if (resp.length > 0) {
                let success = true;
                let error = '';
                resp.forEach((r: any) => {
                    if (!r.status) {
                        success = false;
                        error = r.error;
                        return;
                    }
                });

                if (success) {
                    resolve(resp[resp.length - 1].response);
                } else {
                    reject(error);
                }
            }

            if (resp.status && !resp.pending) {
                resolve(resp.response);
            }

            if (!resp.status && resp.pending) {
                reject('pending');
            }

            if (!resp.status && !resp.pending) {
                reject(
                    resp.message
                        ? resp.message
                        : resp.error
                        ? resp.error
                        : `RPC ${command} has failed to fire off, please try again later.`
                );
            }
        });
    });
};

export { callSend, callGetAddress, callStatus, createCustomToken, getWalletBalance };

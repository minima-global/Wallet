import { MinimaToken, Status as NodeStatus } from '../@types/minima2';

export { callSend, callGetAddress, callStatus, createCustomToken, getWalletBalance, callTokenValidate };

interface ISendPayload {
    token: MinimaToken;
    amount: string;
    address: string;
    burn?: string;
    password?: string;
}
const callSend = async (data: ISendPayload) => {
    try {
        const hasPassword = data.password && data.password.length ? data.password : false;
        const hasBurn = data.burn && data.burn.length ? data.burn : false;

        const response = await rpc(
            `send amount:${data.amount} address:${data.address} tokenid:${data.token.tokenid} ${
                hasBurn ? 'burn:' + hasBurn : ''
            } ${hasPassword ? 'password:' + hasPassword : ''}`
        );

        return {
            postedHeight: response.header.block,
            postedTxpowid: response.txpowid,
        };
    } catch (err: any) {
        throw new Error(err);
    }
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
    try {
        const hasBurn = burn && burn.length ? burn : false;
        return await rpc(
            `tokencreate name:${name} amount:${amount} ${decimals ? 'decimals:' + decimals : ''} ${
                webvalidate ? 'webvalidate:' + webvalidate : ''
            } ${hasBurn ? 'burn:' + hasBurn : ''}`
        );
    } catch (err: any) {
        throw new Error(err);
    }
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
/**
 *
 * @param tokenid
 * @returns resolves promise if tokenvalidate is valid
 */
const callTokenValidate = (tokenid: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        rpc(`tokenvalidate tokenid:${tokenid}`).then((r) => {
            if (r.web.valid) {
                resolve();
            }

            reject();
        });
    });
};

/** Rpc cmd v2 */

export const rpc = (command: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        MDS.cmd(command, (resp: any) => {
            if (resp.length > 0) {
                //console.log(`multi command activity.`);
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

import Decimal from 'decimal.js';

export const splitCoin = (tokenid: string, sendable: string, burn: string, password: string): Promise<2 | 3> => {
    return new Promise((resolve, reject) => {
        (window as any).MDS.cmd('getaddress', (resp: any) => {
            if (resp.status) {
                const mxAddress = resp.response.miniaddress;

                const hasBurn = burn && burn.length ? burn : false;
                const hasPassword = password && password.length ? password : false;
                const amountMinusBurn =
                    hasBurn && tokenid === '0x00' ? new Decimal(sendable).minus(burn).toString() : sendable;

                (window as any).MDS.cmd(
                    `send address:${mxAddress} tokenid:${tokenid} amount:${amountMinusBurn} split:${10} ${
                        hasBurn ? 'burn:' + burn : ''
                    } ${hasPassword ? 'password:' + hasPassword : ''}`,
                    (resp: any) => {
                        if (!resp.status && !resp.pending)
                            reject(
                                resp.error
                                    ? resp.error
                                    : resp.message
                                    ? resp.message
                                    : 'Sending failed, please try again later'
                            );

                        if (!resp.status && resp.pending) resolve(3);

                        if (resp.status) resolve(2);
                    }
                );
            }
        });
    });
};

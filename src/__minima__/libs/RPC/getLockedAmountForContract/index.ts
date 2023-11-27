/**
 *
 * @param tokenid
 * @param contract 0x address for contract
 */
const getLockedAmountForContract = (tokenid: string, contract: string) => {
    (window as any).MDS.cmd(`coins relevant:true address:${contract} tokenid:${tokenid};`, (res: any) => {
        if (!res.status) return 0;
        if (res.response.length === 0) return 0;

        const totalLocked = res.response.reduce((a: number, c: any) => parseInt(c.amount) + a, 0);

        return totalLocked;
    });
};

export default getLockedAmountForContract;

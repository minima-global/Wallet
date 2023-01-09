import { rpc } from '../../rpc-commands';

const validateMinimaAddress = async (minimaAddress: string) => {
    try {
        return await rpc(`checkaddress address:${minimaAddress}`);
    } catch (err: any) {
        console.error(err);

        throw new Error(err);
    }
};

export default validateMinimaAddress;

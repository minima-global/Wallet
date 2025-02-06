import { useContext, useMemo } from "react";
import { appContext } from "../../AppContext";
import { fromUnixTime, isAfter, subMinutes } from "date-fns";

const NodeStatus = () => {
    const { block, heavierChain, maxContacts } = useContext(appContext);

    const nodeStatus = useMemo(() => {
        if (block) {
            const now = new Date();
            const fiveMinutesAgo = subMinutes(now, 5);
            const blockTime = fromUnixTime(Number(block.timemilli) / 1000);

            return isAfter(blockTime, fiveMinutesAgo);
        }

        return null;
    }, [block]);

    const contactStatus = useMemo(() => {
        const now = new Date();
        const fiftyNineMinutesAgo = subMinutes(now, 59);
    
        if (maxContacts && maxContacts.contacts.length > 0) {
          const result = maxContacts.contacts.find((contact) => {
            return isAfter(new Date(Number(contact.lastseen)), fiftyNineMinutesAgo) && !contact.samechain;
          });
    
          return !result;
        }
    
        return true;
    }, [maxContacts]);

    const inactive = !block || !maxContacts;
    const red = heavierChain;
    const orange = nodeStatus === false && contactStatus && !heavierChain;
    const green = nodeStatus === true && contactStatus && !heavierChain;

    if (inactive) {
        return <span className="inline-block w-2 h-2 bg-grey60 rounded-full"></span>
    }

    if (red) {
        return <span className="inline-block w-2 h-2 bg-red rounded-full"></span>
    }

    if (orange) {
        return <span className="inline-block w-2 h-2 bg-orange rounded-full"></span>
    }

    if (green) {
        return <span className="inline-block w-2 h-2 bg-green rounded-full"></span>
    }

    return null;
}

export default NodeStatus;

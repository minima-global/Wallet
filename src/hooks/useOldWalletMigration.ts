import { useRef } from "react";
import { MDS } from "@minima-global/mds";
import { useEffect } from "react";

const useOldWalletMigration = ({
    loaded,
    setFavourites,
    setAddressNames,
}: {
    loaded: boolean;
    setFavourites: (favourites: string[]) => void;
    setAddressNames: (addressNames: Record<string, string>) => void;
}) => {
    const actioned = useRef(false);

    useEffect(() => {
        const migrate = async () => {
            const migrated = await MDS.keypair.get('MIGRATED');

            if (!!migrated.value) {
                return;
            }

            await MDS.sql('CREATE TABLE IF NOT EXISTS cache (name varchar(255), data longtext);');

            const nicknameAddresses = await MDS.sql("SELECT * FROM cache WHERE name = 'NICKNAME_ADDRESSES';");
            
            if (nicknameAddresses.rows[0]) {
                const addresses = JSON.parse(nicknameAddresses.rows[0].DATA);
                setAddressNames(addresses);
            }

            const favouriteTokens = await MDS.sql("SELECT * FROM cache WHERE name = 'FAVORITE_TOKENS';");

            if (favouriteTokens.rows[0]) {
                const favorites = JSON.parse(favouriteTokens.rows[0].DATA);
                setFavourites(favorites);
            }

            await MDS.keypair.set('MIGRATED', '1');
        }

        if (loaded && !actioned.current) {
            actioned.current = true;
            migrate();
        }
    }, [loaded]);

    return {};
};

export default useOldWalletMigration;
import React from 'react';
import * as RPC from '../../../minima/commands';

interface IProps {
    tokenid: string;
}
const NFTAuthenticity = ({ tokenid }: IProps) => {
    const [isTokenValidated, setIsTokenValidated] = React.useState<boolean | null>(false);

    React.useEffect(() => {
        RPC.tokenValidate(tokenid).then(() => {
            // resolves so it is validated
            setIsTokenValidated(true);
        });
    }, [tokenid]);

    return (
        <>
            {isTokenValidated && (
                <svg
                    className="fill-green-400 absolute right-1 bottom-2"
                    xmlns="http://www.w3.org/2000/svg"
                    height="16"
                    viewBox="0 -960 960 960"
                    width="16"
                >
                    <path d="m438-338 226-226-57-57-169 169-84-84-57 57 141 141Zm42 258q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q104-33 172-132t68-220v-189l-240-90-240 90v189q0 121 68 220t172 132Zm0-316Z" />
                </svg>
            )}
            {!isTokenValidated && (
                <svg
                    className="fill-red-700 absolute right-1 bottom-2"
                    xmlns="http://www.w3.org/2000/svg"
                    height="16"
                    viewBox="0 -960 960 960"
                    width="16"
                >
                    <path d="M200-120v-680h360l16 80h224v400H520l-16-80H280v280h-80Zm300-440Zm86 160h134v-240H510l-16-80H280v240h290l16 80Z" />
                </svg>
            )}
        </>
    );
};

export default NFTAuthenticity;

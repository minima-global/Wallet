import React from 'react';
import * as RPC from '../../../minima/commands';

interface IProps {
    tokenid: string;
    relative?: boolean;
}
const NFTAuthenticity = ({ tokenid, relative = false }: IProps) => {
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
                    xmlns="http://www.w3.org/2000/svg"
                    className={`fill-blue-500 ${relative ? 'relative' : 'absolute right-1 bottom-0'}`}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                    <path d="M21 21l-6 -6" />
                    <path d="M7 10l2 2l4 -4" />
                </svg>
            )}
            {!isTokenValidated && (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`fill-yellow-100 ${relative ? 'relative' : 'absolute right-1'}`}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                    <path d="M21 21l-6 -6" />
                    <path d="M10 13l0 .01" />
                    <path d="M10 10a1.5 1.5 0 1 0 -1.14 -2.474" />
                </svg>
            )}
        </>
    );
};

export default NFTAuthenticity;

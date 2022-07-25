import React from 'react';
import { styled, Tooltip, TooltipProps, tooltipClasses } from '@mui/material';

import VerifiedIcon from '@mui/icons-material/Verified';
import { callTokenValidate } from '../../../minima/rpc-commands';

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.black,
    },
}));

const NFTAuthenticity = ({ NFT }: any) => {
    const [isTokenValidated, setIsTokenValidated] = React.useState(false);

    React.useEffect(() => {
        // console.log(`run useFffect`);
        // IS NFT defined && does it have anything in webvalidate?
        if (NFT && NFT.token.webvalidate.length) {
            callTokenValidate(NFT.tokenid)
                .then((res: any) => {
                    console.log(`callTokenValidate`, res);
                    if (res.status) {
                        if (res.response.web.valid) {
                            // is valid token
                            setIsTokenValidated(true);
                        }
                    }
                })
                .catch((err) => {
                    console.error(`callTokenValidate with ${NFT.tokenid}`, err);
                });
        }
    }, [NFT]);
    return (
        <>
            {isTokenValidated && NFT.token.webvalidate.length ? (
                <BootstrapTooltip placement="top-end" title={'NFT has been validated, ' + NFT.token.webvalidate}>
                    <VerifiedIcon fontSize="inherit" color="primary" />
                </BootstrapTooltip>
            ) : null}
        </>
    );
};

export default NFTAuthenticity;

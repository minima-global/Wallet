import React from 'react';
import { styled, Tooltip, TooltipProps, tooltipClasses } from '@mui/material';

import VerifiedIcon from '@mui/icons-material/Verified';
import * as RPC from '../../../minima/commands';
import { MinimaToken } from '../../../@types/minima';

interface IProps {
    token: MinimaToken;
}
const NFTAuthenticity = ({ token }: IProps) => {
    const [isTokenValidated, setIsTokenValidated] = React.useState(false);

    React.useEffect(() => {
        RPC.tokenValidate(token.tokenid)
            .then(() => {
                // resolves so it is validated
                setIsTokenValidated(true);
            })
            .catch((err) => {});
    }, [token]);
    return isTokenValidated && token.token.webvalidate ? (
        <BootstrapTooltip placement="top-end" title={'NFT has been validated, ' + token.token.webvalidate}>
            <VerifiedIcon fontSize="inherit" color="primary" />
        </BootstrapTooltip>
    ) : null;
};

export default NFTAuthenticity;

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

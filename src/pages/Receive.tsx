import { FC, useEffect, useState } from 'react';
import {
    Typography,
    Card,
    CardContent,
    styled,
    Tooltip,
    TooltipProps,
    tooltipClasses,
    ListItemIcon,
    Skeleton,
    Stack,
} from '@mui/material';
import GridLayout from '../layout/GridLayout';
import { callGetAddress } from '../minima/rpc-commands';
import { copy } from '../shared/functions';
import QRCode from 'react-qr-code';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { useAppSelector } from '../minima/redux/hooks';
import { selectBalance } from '../minima/redux/slices/balanceSlice';
import CustomListItem from '../shared/components/CustomListItem';
// import { BalanceUpdates } from '../App';

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

const Receive: FC = () => {
    const [address, setAddress] = useState<string>('');
    const [isCopied, setIsCopied] = useState(false);
    const [loading, setLoading] = useState(true);

    // const balances = useContext(BalanceUpdates);

    const balances = useAppSelector(selectBalance);

    // const navigate = useNavigate();

    useEffect(() => {
        // console.log('Calling addr.');
        callGetAddress()
            .then((res: any) => {
                // console.log('getaddress', res);
                if (res.response && res.response.miniaddress) {
                    setAddress(res.response.miniaddress);
                }
                // setAddress(res.response.miniaddress);
                setLoading(false);
            })
            .catch((err: any) => {
                // navigate('/offline');
                // setLoading(false);

                console.error(`${err}`);
            });
    }, [balances]);

    const handleCopyClick = () => {
        copy(address);
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 1500);
    };

    return (
        <GridLayout
            // loading={loading}
            children={
                <Card variant="outlined">
                    <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                        {address && address.length > 0 ? (
                            <QRCode style={{ alignSelf: 'center' }} level="M" value={address} />
                        ) : (
                            <Skeleton sx={{ alignSelf: 'center' }} variant="rectangular" width={260} height={260} />
                        )}

                        <Stack spacing={2} sx={{ mt: 2 }}>
                            {address && address.length > 0 ? (
                                <CustomListItem title="Wallet Address" value={address} />
                            ) : (
                                <CustomListItem
                                    title={<Skeleton variant="text" width={100} />}
                                    value={<Skeleton variant="text" />}
                                />
                            )}

                            {address && address.length > 0 ? (
                                <>
                                    <BootstrapTooltip
                                        placement="top-end"
                                        title={!isCopied ? 'Copy Address' : 'Copied!'}
                                    >
                                        <ListItemIcon
                                            onClick={handleCopyClick}
                                            sx={[copyBtn, { backgroundColor: isCopied ? '#00B74A' : null }]}
                                        >
                                            {!isCopied ? (
                                                <ContentCopyIcon sx={{ color: '#fff' }} />
                                            ) : (
                                                <FileCopyIcon sx={{ color: '#fff' }} />
                                            )}
                                        </ListItemIcon>
                                    </BootstrapTooltip>
                                </>
                            ) : null}
                            <Typography variant="caption">
                                Receive any Minima & network tokens with this address.
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>
            }
        />
    );
};

export default Receive;

const copyBtn = {
    backgroundColor: '#317AFF',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'baseline',
    borderRadius: 8,
    padding: 0.5,
    cursor: 'pointer',
};

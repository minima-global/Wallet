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
    TextField,
    Button,
} from '@mui/material';
import GridLayout from '../layout/GridLayout';
import { copy } from '../shared/functions';
import QRCode from 'react-qr-code';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import SelectWrapper from '../shared/components/SelectWrapper';
import { getScripts } from '../minima/commands';
import { Scripts } from '../@types/minima';
import FormFieldWrapper from '../shared/components/FormFieldWrapper';
import checkAddress from '../minima/commands/checkAddress';
import MiError from '../shared/components/layout/MiError/MiError';
import CustomListItem from '../shared/components/CustomListItem';
import getCurrentNodeVersion from '../minima/commands/getCurrentVersion';
import { NoResults } from '../shared/components/layout/MiToken';
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
    const [defaultAddresses, setDefaultAddress] = useState<Scripts[]>([]);
    const [error, setError] = useState<boolean | string>(false);
    const [addressValidity, setAddressValid] = useState<false | any>(false);
    const [formAddress, setFormAddress] = useState('');

    const [validBuild, setValidBuild] = useState(false);

    useEffect(() => {
        getCurrentNodeVersion().then((v) => {
            const versionCheckAddressWasIntroduced = '1.0.21';
            const comparison = '1.0.20'.localeCompare(versionCheckAddressWasIntroduced);
            const isRunningSufficientVersion = comparison === 0 || comparison === 1;

            if (isRunningSufficientVersion) setValidBuild(true);
        });
    }, []);

    const checkMinimaAddress = (address: string) => {
        setError(false);
        setAddressValid(false);

        checkAddress(address)
            .then((data: any) => {
                setAddressValid(data);
            })
            .catch((err) => {
                const hasJavaLangError = err.startsWith('java.lang.IllegalArgumentException: ');

                setError(!hasJavaLangError ? err : err.split('java.lang.IllegalArgumentException: ')[1]);
                setFormAddress('');
            });
    };
    const clearForm = () => {
        setError(false);
        setAddressValid(false);
        setFormAddress('');
    };

    useEffect(() => {
        getScripts().then((scripts) => {
            const allSimpleAddresses = scripts.filter((s) => s.simple && s.default);
            setDefaultAddress(allSimpleAddresses);
            setAddress(allSimpleAddresses[Math.floor(Math.random() * allSimpleAddresses.length)].miniaddress);
        });
    }, []);

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
                <Stack spacing={1}>
                    <Card variant="outlined">
                        <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                            {address && address.length > 0 ? (
                                <QRCode style={{ alignSelf: 'center' }} level="M" value={address} />
                            ) : (
                                <Skeleton sx={{ alignSelf: 'center' }} variant="rectangular" width={260} height={260} />
                            )}

                            <Stack spacing={2} sx={{ mt: 2 }}>
                                <SelectWrapper>
                                    <label>Select Address</label>
                                    <select value={address} onChange={(e) => setAddress(e.target.value)}>
                                        {defaultAddresses.map((s) => (
                                            <option key={s.miniaddress} value={s.miniaddress}>
                                                {s.miniaddress}
                                            </option>
                                        ))}
                                    </select>
                                    <Typography variant="caption">
                                        This address was randomly chosen from your set of default addresses
                                    </Typography>
                                </SelectWrapper>

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
                    <Card variant="outlined">
                        <CardContent>
                            {validBuild && (
                                <FormFieldWrapper
                                    help="Check validity of a Minima address"
                                    children={
                                        <Stack spacing={2}>
                                            <TextField
                                                onChange={(e) => setFormAddress(e.target.value)}
                                                id="address"
                                                name="address"
                                                placeholder="minima address"
                                                value={formAddress}
                                            />
                                            <Stack spacing={0.5}>
                                                <Button
                                                    disabled={!formAddress.length}
                                                    onClick={() => checkMinimaAddress(formAddress)}
                                                    disableElevation
                                                    variant="contained"
                                                >
                                                    Check address
                                                </Button>
                                                <Button onClick={() => clearForm()} disableElevation variant="outlined">
                                                    Clear
                                                </Button>
                                            </Stack>

                                            {error && (
                                                <Stack spacing={1}>
                                                    <CustomListItem title="Valid Address" value="No" />

                                                    <CustomListItem title="Reason" value={error} />
                                                </Stack>
                                            )}
                                            {addressValidity && (
                                                <Stack spacing={1}>
                                                    <CustomListItem title="Valid Address" value="Yes" />

                                                    <CustomListItem
                                                        title="0x Address"
                                                        value={addressValidity.original}
                                                    />
                                                    <CustomListItem title="Mx Address" value={addressValidity.Mx} />
                                                    <CustomListItem
                                                        title="Address belongs to this node"
                                                        value={addressValidity.relevant ? 'Yes' : 'No'}
                                                    />
                                                    <CustomListItem
                                                        title="Simple Address"
                                                        value={addressValidity.simple ? 'Yes' : 'No'}
                                                    />
                                                </Stack>
                                            )}
                                        </Stack>
                                    }
                                />
                            )}
                            {!validBuild && (
                                <FormFieldWrapper
                                    help="Check validity of a Minima address"
                                    children={
                                        <Stack spacing={2}>
                                            <NoResults>
                                                <h6>Oops, looks like you are running an older version of Minima.</h6>
                                                <p>
                                                    Upgrade your node to version 1.0.21 or higher to access this
                                                    feature.
                                                </p>
                                            </NoResults>
                                            <TextField
                                                id="address"
                                                name="address"
                                                placeholder="minima address"
                                                value={formAddress}
                                                disabled={true}
                                            />
                                            <Stack spacing={0.5}>
                                                <Button disabled={true} disableElevation variant="contained">
                                                    Check address
                                                </Button>
                                            </Stack>
                                        </Stack>
                                    }
                                />
                            )}
                        </CardContent>
                    </Card>
                </Stack>
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

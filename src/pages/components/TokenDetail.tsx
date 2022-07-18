import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Card,
    CardHeader,
    CardContent,
    Avatar,
    Typography,
    Grid,
    List,
    ListItem,
    ListItemText,
    CardMedia,
    Fade,
    Tooltip,
    styled,
    TooltipProps,
    tooltipClasses,
    IconButton,
} from '@mui/material';

import MinimaIcon from '../../assets/images/minimaLogoSquare.png';
import { ReactComponent as MinimaSquareIcon } from '../../assets/images/minimaLogoSquare.svg';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FileCopyIcon from '@mui/icons-material/FileCopy';

import { copy as copyText, hexToString } from '../../shared/functions';
import GridLayout from './GridLayout';

import { useAppSelector } from '../../minima/redux/hooks';
import { selectTokenWithID } from '../../minima/redux/slices/balanceSlice';

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

const TokenDetail = () => {
    const { tokenid } = useParams();

    const [enlargenCover, setEnlargenCover] = useState(false);

    // Copy Feature
    const [copy, setCopy] = useState<boolean>(false);

    // const token = balances.find((b: MinimaToken) => b.tokenid === tokenid);
    const token = useAppSelector(selectTokenWithID(typeof tokenid !== 'undefined' ? tokenid : ''));

    if (typeof token === 'undefined') {
        console.error('can not find token ' + tokenid);
    }
    const loading = typeof token === 'undefined';

    const handleCopyBtn = (text: string) => {
        copyText(text);
        setCopy(true);
        setTimeout(() => setCopy(false), 1000);
    };

    return (
        <>
            <GridLayout
                spacing={2}
                loading={loading}
                children={
                    typeof token !== 'undefined' ? (
                        <Grid container spacing="8px">
                            <Grid item xs={12}>
                                <Fade in={true}>
                                    <Card variant="outlined" className="MiniCardToken">
                                        <CardHeader
                                            className="MiniCardTokenHeader"
                                            avatar={
                                                token.tokenid === '0x00' ? (
                                                    <MinimaSquareIcon className="minima-icon" />
                                                ) : (
                                                    <Avatar
                                                        variant="rounded"
                                                        src={
                                                            token?.tokenid === '0x00'
                                                                ? MinimaIcon
                                                                : !token?.token.url || token?.token.url.length === 0
                                                                ? `https://robohash.org/${token?.tokenid}`
                                                                : token?.token.url && token?.token.url.length > 0
                                                                ? hexToString(token.token.url)
                                                                : ''
                                                        }
                                                        alt={token?.token.name ? token?.token.name : token?.token}
                                                    />
                                                )
                                            }
                                            title={token?.token.name ? token.token.name : token.token}
                                            subheader={
                                                token?.token.description
                                                    ? hexToString(token.token.description)
                                                    : token.tokenid === '0x00'
                                                    ? 'Official Minima Token'
                                                    : null
                                            }
                                        />
                                        {token.tokenid !== '0x00' ? (
                                            <div
                                                onClick={() =>
                                                    !enlargenCover ? setEnlargenCover(true) : setEnlargenCover(false)
                                                }
                                                className={
                                                    !enlargenCover ? 'resize-wrapper' : 'resize-wrapper flex-right'
                                                }
                                            >
                                                <CardMedia
                                                    component="img"
                                                    height={enlargenCover ? '100%' : '194'}
                                                    src={
                                                        token?.tokenid === '0x00'
                                                            ? MinimaIcon
                                                            : !token?.token.url || token?.token.url.length === 0
                                                            ? `https://robohash.org/${token?.tokenid}`
                                                            : token?.token.url && token?.token.url.length > 0
                                                            ? hexToString(token.token.url)
                                                            : ''
                                                    }
                                                    alt="Paella dish"
                                                />
                                                <Typography className="click-to-resize" variant="subtitle2">
                                                    Click to resize
                                                </Typography>
                                            </div>
                                        ) : null}
                                        <CardContent>
                                            <List sx={{ borderBottom: '0.5px solid #EDEDED' }}>
                                                <ListItem>
                                                    <Typography variant="body1">Name</Typography>
                                                    <ListItemText
                                                        disableTypography
                                                        secondary={
                                                            <Typography variant="subtitle1" sx={valueStyle}>
                                                                {token?.token.name ? token?.token.name : token?.token}
                                                            </Typography>
                                                        }
                                                    ></ListItemText>
                                                </ListItem>
                                                <ListItem>
                                                    <Typography variant="body1">Total Minted</Typography>
                                                    <ListItemText
                                                        sx={{ width: '100%' }}
                                                        disableTypography
                                                        secondary={
                                                            <Typography variant="subtitle1" sx={valueStyle}>
                                                                {token?.total ? token?.total : '0'}
                                                            </Typography>
                                                        }
                                                    ></ListItemText>
                                                </ListItem>
                                                <ListItem>
                                                    <Typography variant="body1">Token ID</Typography>
                                                    <Box sx={[copyRow, { width: '100%' }]}>
                                                        <ListItemText
                                                            sx={{
                                                                display: 'flex',
                                                                flex: '0 0 100%',
                                                                flexDirection: 'row-reverse',
                                                                width: '100%',
                                                            }}
                                                            disableTypography
                                                            secondary={
                                                                <Typography
                                                                    variant="subtitle1"
                                                                    sx={[
                                                                        valueStyle,
                                                                        {
                                                                            borderTopRightRadius: 0,
                                                                            borderBottomRightRadius: 0,
                                                                        },
                                                                    ]}
                                                                >
                                                                    {token?.tokenid ? token?.tokenid : '0x00'}
                                                                </Typography>
                                                            }
                                                        >
                                                            <BootstrapTooltip
                                                                placement="top-end"
                                                                title={!copy ? 'Copy TokenID' : 'Copied!'}
                                                            >
                                                                <IconButton
                                                                    onClick={() => {
                                                                        handleCopyBtn(
                                                                            token?.tokenid ? token?.tokenid : ''
                                                                        );
                                                                    }}
                                                                    sx={[{ backgroundColor: copy ? '#00B74A' : null }]}
                                                                >
                                                                    {!copy ? (
                                                                        <ContentCopyIcon sx={{ color: '#fff' }} />
                                                                    ) : (
                                                                        <FileCopyIcon sx={{ color: '#fff' }} />
                                                                    )}
                                                                </IconButton>
                                                            </BootstrapTooltip>
                                                        </ListItemText>
                                                    </Box>
                                                </ListItem>

                                                <ListItem>
                                                    <Typography variant="body1">Coins</Typography>
                                                    <Box sx={[copyRow, { width: '100%' }]}>
                                                        <ListItemText
                                                            sx={{
                                                                display: 'flex',
                                                                flex: '0 0 100%',
                                                                flexDirection: 'row-reverse',
                                                                width: '100%',
                                                            }}
                                                            disableTypography
                                                            secondary={
                                                                <Typography
                                                                    variant="subtitle1"
                                                                    sx={[
                                                                        valueStyle,
                                                                        {
                                                                            borderTopRightRadius: 0,
                                                                            borderBottomRightRadius: 0,
                                                                        },
                                                                    ]}
                                                                >
                                                                    {token.coins}
                                                                </Typography>
                                                            }
                                                        ></ListItemText>
                                                    </Box>
                                                </ListItem>
                                            </List>

                                            <List>
                                                <ListItem>
                                                    <Typography variant="body1">Confirmed</Typography>
                                                    <ListItemText
                                                        disableTypography
                                                        secondary={
                                                            <Typography variant="subtitle1" sx={valueStyle}>
                                                                {token?.confirmed ? token?.confirmed : 0}
                                                            </Typography>
                                                        }
                                                    ></ListItemText>
                                                </ListItem>
                                                <ListItem>
                                                    <Typography variant="body1">Unconfirmed</Typography>
                                                    <ListItemText
                                                        disableTypography
                                                        secondary={
                                                            <Typography variant="subtitle1" sx={valueStyle}>
                                                                {token?.unconfirmed ? token?.unconfirmed : '0'}
                                                            </Typography>
                                                        }
                                                    ></ListItemText>
                                                </ListItem>
                                                <ListItem>
                                                    <Typography variant="body1">Sendable</Typography>
                                                    <ListItemText
                                                        disableTypography
                                                        secondary={
                                                            <Typography variant="subtitle1" sx={valueStyle}>
                                                                {token?.sendable ? token?.sendable : '0'}
                                                            </Typography>
                                                        }
                                                    ></ListItemText>
                                                </ListItem>
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Fade>
                            </Grid>
                        </Grid>
                    ) : (
                        <Grid
                            item
                            xs={12}
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                            }}
                        >
                            <Typography variant="subtitle2">Token not found</Typography>
                        </Grid>
                    )
                }
            />

            {/* <MiniModal
                open={open}
                handleClose={handleCloseSplitModal}
                customFnc={() => {
                    //return token ? handleSplit(token) : null;
                    // handleSplit(token);
                }}
                executeName="Split"
                status="Coin Split"
                header="You are about to split your coin/UTXO in half."
                subtitle="Splitting your coin means you do not have to wait for an unconfirmed coin to execute another transaction at the same time."
            /> */}
        </>
    );
};
export default TokenDetail;

const copyRow = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 0,
};

const valueStyle = {
    backgroundColor: '#fff',
    padding: 2,
    borderRadius: 1,
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
};

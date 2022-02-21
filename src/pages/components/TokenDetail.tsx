import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { callBalance } from '../../minima/rpc-commands';
import { MinimaToken } from '../../types/minima';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, Avatar, Typography } from '@mui/material';

import MinimaIcon from '../../assets/images/minimaLogoSquare200x200.png';

const TokenDetail = () => {
    const { tokenid } = useParams();
    const [balance, setBalance] = useState<MinimaToken[]>([]);
    const [token, setToken] = useState<MinimaToken>();
    const [dimensions, setDimensions] = useState(128);

    const handleAvatarDimensions = () => {
        if (dimensions === 128) {
            setDimensions(256);
        } else {
            setDimensions(128);
        }
    };

    console.log(`tokenid`, tokenid);

    useEffect(() => {
        console.log('DETAILS useEffect called', tokenid);
        console.log('TokenLoaded', token);
        callBalance()
            .then((data: any) => {
                setBalance(data.response);
                balance.forEach((b: MinimaToken) => {
                    if (b.tokenid === tokenid) {
                        console.log(b);
                        setToken(b);
                    }
                });
                // setLoading(false);
            })
            .catch((err: Error) => {
                console.error(err);
            });
        // setLoading(false);
        return () => {};
    }, [tokenid]);

    return (
        <Card variant="outlined">
            <CardContent
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}
            >
                <Avatar
                    sx={{ height: dimensions, width: dimensions }}
                    onClick={handleAvatarDimensions}
                    src={
                        token?.tokenid === '0x00'
                            ? MinimaIcon
                            : !token?.token.icon || token?.token.icon.length === 0
                            ? `https://robohash.org/${token?.tokenid}`
                            : token?.token.icon && token?.token.icon
                            ? token.token.icon
                            : ''
                    }
                    alt={token?.token.name ? token?.token.name : token?.token}
                />

                <Typography variant="h6"> {token?.token.name ? token?.token.name : token?.token}</Typography>
            </CardContent>
        </Card>
    );
};
export default TokenDetail;

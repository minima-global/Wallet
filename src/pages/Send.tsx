import { Stack, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { FC, useState } from 'react';

import GridLayout from '../layout/GridLayout';

import MiCard from '../shared/components/layout/MiCard';
import ValueTransfer from './components/forms/ValueTransfer';
import CoinSplit from './components/forms/CoinSplit';

const dataTestIds = {
    select: 'Send__select',
    valueTransfer: 'Send__valueTransfer',
    coinSplit: 'Send__coinSplit',
};

const Send: FC = () => {
    const [formUtility, setFormUtility] = useState('VALUETRANSFER');

    const handleUtilityChange = (event: SelectChangeEvent<string>) => {
        setFormUtility(event.target.value);
    };

    return (
        <>
            <GridLayout
                children={
                    <>
                        <MiCard>
                            <Stack spacing={2}>
                                <Select
                                    fullWidth
                                    id="formUtility"
                                    name="formUtility"
                                    value={formUtility}
                                    data-testid={dataTestIds.select}
                                    onChange={handleUtilityChange}
                                >
                                    <MenuItem data-testid={dataTestIds.valueTransfer} value="VALUETRANSFER">Value transfer</MenuItem>
                                    <MenuItem data-testid={dataTestIds.coinSplit} value="COINSPLIT">Coin split</MenuItem>
                                </Select>
                                {formUtility === 'VALUETRANSFER' && <ValueTransfer />}
                                {formUtility === 'COINSPLIT' && <CoinSplit />}
                            </Stack>
                        </MiCard>
                    </>
                }
            />
        </>
    );
};

export default Send;

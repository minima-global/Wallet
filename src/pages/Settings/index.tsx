import { useContext, useEffect, useState } from 'react';
import { appContext } from '../../AppContext';
import CardContent from '../../components/UI/CardContent';
import { createPortal } from 'react-dom';

import * as utilities from '../../utilities';
import formatNumber from 'format-number';
import Decimal from 'decimal.js';
import Button from '../../components/UI/Button';
import { CircularProgress } from '@mui/material';

const Settings = () => {
    const { setOpenDrawer, updateCurrencyFormat, _currencyFormat } = useContext(appContext);
    const [showCurrencyFormatter, setShowCurrencyFormatter] = useState(false);
    const [loading, setLoading] = useState(false);
    const [updated, setUpdate] = useState(false);

    useEffect(() => {
        setDecimalSeparator(_currencyFormat.decimal);
        setThousandSeparator(_currencyFormat.thousands);
    }, []);

    const [decimalSeparator, setDecimalSeparator] = useState('.');
    const [thousandSeparator, setThousandSeparator] = useState('');

    const handleDecimalChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
        const value = evt.target.value;

        if (value === ',' && thousandSeparator === ',') {
            setThousandSeparator('.');
        }

        if (value === '.' && thousandSeparator === '.') {
            setThousandSeparator(',');
        }

        setDecimalSeparator(value);
    };
    const handleThousandChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
        const value = evt.target.value;

        if (value === ',' && decimalSeparator === ',') {
            setDecimalSeparator('.');
        }

        if (value === '.' && thousandSeparator === '.') {
            setDecimalSeparator(',');
        }

        setThousandSeparator(value);
    };
    return null;

};

export default Settings;

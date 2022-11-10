import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import styles from '../../../theme/cssmodule/Components.module.css';

export const MiRequiredAsterisk = styled('span')`
    color: red;
    margin-right: 4px;
`;

const Required = () => {
    return (
        <Typography className={styles['required-form-helper']} variant="caption">
            <MiRequiredAsterisk>*</MiRequiredAsterisk> Required Fields
        </Typography>
    );
};

export default Required;

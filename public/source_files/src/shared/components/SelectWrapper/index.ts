import styled from '@emotion/styled';

const SelectWrapper = styled('div')`
    label {
        margin: 0;
        font-family: Manrope-regular;
        font-weight: 400;
        font-size: 1rem;
        line-height: 1.5;
        padding-left: 8px;
    }

    select {
        width: 100%;
        padding: 8px;
        border: none;
        border-radius: 8px;
        text-overflow: ellipsis;
        white-space: normal;
        font-family: Manrope-semibold;
        font-size: 1rem;
    }
    p {
        margin: 0;
    }
`;

export default SelectWrapper;

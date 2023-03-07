import styled from '@emotion/styled';

const NFTDescription = styled('div')`
    padding: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    * {
        text-overflow: ellipsis;
        overflow: hidden;
    }
    label {
        font-weight: 800;
        color: #000;
    }
    p {
        color: #16181c;
        margin-top: 4px;
        margin-bottom: 4px;
        font-size: 0.875rem;
    }
`;

export default NFTDescription;

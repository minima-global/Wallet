import styled from '@emotion/styled';

const NFTDescription = styled('div')`
    padding: 8px;
    * {
        text-overflow: ellipsis;
        overflow: hidden;
    }
    label {
        font-weight: 800;
        color: #ff6b4e;
    }
    p {
        color: #16181c;
        margin-top: 4px;
        margin-bottom: 4px;
        font-size: 0.875rem;
    }
`;

export default NFTDescription;

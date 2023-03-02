import styled from '@emotion/styled';

export {
    MiSearchBar,
    MiSearchBarWithIcon,
    MiTokenName,
    MiTokenNameTicker,
    MiTokenAmount,
    MiSkeleton,
    MiTokenListItem,
    MiTokenContainer,
    MiTokenError,
    MiNoTokenSelected,
    MiTestnet,
    MiTokenNameWrapper,
    NoResults,
};

const MiTestnet = styled('p')`
    margin: 0;
    font-family: Manrope-semibold;
    color: #fefefe;
    padding: 4px;
    border-radius: 12px;
    background: #317aff;
    height: fit-content;
    font-size: 0.675rem;
`;

const MiTokenContainer = styled('div')`
    margin-top: 16px;
    > :last-of-type {
        margin-bottom: 0;
    }
`;

const MiNoTokenSelected = styled('div')`
    position: absolute;
    top: 16px;
    left: 16px;
    font-family: Manrope-regular;
    font-size: 1rem;
    color: #000;
`;

const MiTokenError = styled('div')`
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
    color: rgb(211, 47, 47);
    padding: 0px 8px;
    text-overflow: ellipsis;
    overflow: hidden;
    background-color: #fcbebd;
    font-size: 0.8rem;
    font-family: Manrope-semibold;
`;

const MiTokenListItem = styled('li')`
    background: #fff;
    margin-bottom: 8px;
    min-height: 72px;
    border-radius: 8px;
    padding: 8px;
    display: flex;
    align-items: center;
    flex-direction: row;
    border: 1px solid #fefefe !important;
    overflow: hidden;
    gap: 2px;

    > .MuiAvatar-root {
        margin-right: 8px !important;
    }

    :hover {
        background: rgba(255, 255, 255, 0.8);
        cursor: pointer;
    }

    > p {
        padding: 0;
        text-overflow: ellipsis;
        display: block;
    }
`;
const MiSearchBar = styled('input')`
    border: 1px solid #bdbdc4;
    border-radius: 8px;
    min-height: 48px;
    padding: 0px 16px;
    padding-right: 44px;
    font-family: Manrope-regular;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0.01em;
    text-align: left;
    width: 100%;
`;
const MiSearchBarWithIcon = styled('div')`
    width: 100%;
    position: relative;
    border-bottom: 1px solid #bdbdc4;
    padding: 0 16px;
    padding-bottom: 16px;
    & > svg {
        position: absolute;
        right: 32px;
        top: 15px;
        transition: 0.3s;
    }
`;

const MiTokenNameWrapper = styled('div')`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 4px;
`;
const MiTokenName = styled('p')`
    padding: 0;
    margin: 0;
    font-family: Manrope-regular;
    font-size: 0.875rem;
    font-weight: 700;
    line-height: 19px;
    letter-spacing: 0.02em;
    text-align: left !important;
    color: #ff6b4e;
    max-width: 35vw;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;
const MiTokenNameTicker = styled('p')`
    padding: 0;
    margin: 0;
    font-size: 0.75rem;
    font-family: Manrope-regular;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0.02em;
    color: #363a3f;
    max-width: 35vw;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left !important;
`;
const MiTokenAmount = styled('p')`
    padding: 0;
    margin: 0;
    font-family: Manrope-regular;
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0.02em;
    font-variant: tabular-nums;
    color: #363a3f;
    max-width: 35vw;
    overflow: hidden;
    text-align: left;
    text-overflow: ellipsis;
`;

const NoResults = styled('div')`
    margin-top: 50px;
    padding-bottom: 50px;
    > h6 {
        font-weight: 700;
        font-size: 1.5rem;
        line-height: 33px;
        color: #363a3f;
        padding: 0;
        margin: 0;
    }
    > p {
        margin: 0;
        padding: 0;
        margin-top: 15px;
        font-size: 0.938rem;
    }
    * {
        font-family: Manrope-regular;
        text-align: center;
        letter-spacing: 0.02em;
    }
`;

const MiSkeleton = styled('span')`
    padding: 0;
    margin: 0;
    line-height: 16px;
    letter-spacing: 0.02em;
    height: 10px;
`;

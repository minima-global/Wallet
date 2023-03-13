import styled from '@emotion/styled';

export const MiTransactionList = styled('ul')`
    margin: 0;
    padding: 0;
    max-width: 100%;
    width: 100%;
    list-style-type: none;

    > li {
        border-radius: 8px;
        background-color: #fff;
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        grid-gap: 20px;
        padding: 8px;
        margin-bottom: 8px;
    }
    li:last-child {
        margin-bottom: 0;
    }
    > li:hover {
        cursor: pointer;
        transform: scale(0.999);
        background-color: rgba(255, 255, 255, 0.8);
    }

    > li p {
        text-overflow: ellipsis;
        overflow: hidden;
        text-align: center;
        font-family: Manrope-regular;
        font-size: 0.875rem;
        line-height: 30px;
    }
    > li p#time {
        text-align: right;
        line-height: 18px;
    }
    > li p#name {
        text-align: left;
    }
    > li p#txpowid {
        text-align: left;
    }

    > div.month {
        font-family: Manrope-regular;
        font-size: 0.8rem;
        text-align: right;
        padding-right: 8px;
        font-weight: 800;
        color: #ff6b4e;
        margin-bottom: 8px;
    }
`;

export const MiTransactionHeader = styled('div')`
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    grid-gap: 20px;
    border-bottom: 1px solid #d3d3d3;
    border-radius: 8px;
    margin-bottom: 22px;
    padding: 8px;

    > h6#name {
        text-align: left;
    }
    > h6#transactions {
        text-align: center;
    }
    > h6#time {
        text-align: right;
    }
    > h6 {
        font-family: Manrope-regular;
        font-size: 1rem;
        margin: 0;
    }
`;

export const MiTransactionSummary = styled('div')`
    h6#input {
        color: #317aff;
        background-color: #16181c;
        color: #fff;
        padding: 8px;
        border-radius: 4px;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        margin-bottom: 0;
        margin-top: 22px;
    }

    ul#iterator > li#list-subheader {
        font-family: Manrope-regular;
        font-size: 1rem;
        color: #16181c;
        border-bottom: 1px solid #317aff;
        padding-bottom: 8px;
        font-weight: 800;
    }
    ul#iterator {
        margin-bottom: 8px;
        border-bottom: 1px solid #317aff;
    }
    ul#iterator:last-of-type {
        margin-bottom: 0px;
        border-bottom: none;
    }

    ul#input {
        border: 1px solid #d3d3d3;
        border-top: none;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        padding: 8px;
    }

    h6 {
        margin: 0;
        font-family: Manrope-regular;
        font-size: 1rem;
        color: #16181c;
        border-bottom: 1px solid #d3d3d3;
        padding-bottom: 8px;
        margin-bottom: 22px;
    }
    ul {
        padding: 0;
        margin: 0;
        list-style-type: none;
    }
    * {
        font-size: 1rem;
        text-overflow: ellipsis;
        overflow: hidden;
        color: #363a3f;
    }
    li > p:last-child {
        font-weight: 800;
    }

    li {
        overflow: hidden;
        display: grid;
        grid-template-columns: 1fr 3fr;
        grid-gap: 20px;
        text-overflow: ellipsis;
        border-bottom: 1px solid #d3d3d3;
    }
    li:last-of-type {
        border-bottom: none;
    }

    @media only screen and (max-width: 733px) {
        li {
            grid-template-columns: 4fr;
            grid-gap: 8px;
        }
        li > p:first-of-type {
            margin-bottom: 0;
        }
        li > p:last-of-type {
            margin-top: 0;
        }
    }
`;

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
        grid-template-columns: 3fr 1fr;
        grid-gap: 6px;
        padding: 16px 16px;
        max-height: 78px;
        margin-bottom: 16px;
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
        font-family: Manrope-regular;
        font-size: 0.875rem;
        white-space: nowrap;
    }

    > div.month {
        color: #000;
        font-family: Manrope-regular;
        font-weight: 500;
        font-size: 1rem;
        text-align: left;
        font-weight: 800;
        margin-bottom: 8px;
    }
`;

export const MiTransactionHeader = styled('div')`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 20px;
    border-bottom: 1px solid #d3d3d3;
    border-radius: 8px;
    margin-bottom: 22px;
    padding: 8px;

    > h6#name {
        text-align: left;
    }
    > h6#amount {
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
        font-size: 1.25rem;
        color: #16181c;
        // border-bottom: 1px solid #d3d3d3;
        // margin-bottom: 16px;
    }
    svg {
        fill: #317aff;
        cursor: pointer;
        width: 20px;
        height: 20px;
    }
    ul {
        padding: 0;
        margin: 0;
        list-style-type: none;

        display: grid;
        grid-template-columns: 4fr;
        row-gap: 4px;
    }
    * {
        font-size: 1rem;
        text-overflow: ellipsis;
        overflow: hidden;
        color: #363a3f;
    }
    li > p:last-of-type {
        font-weight: 800;
        text-align: right;
    }

    li {
        background-color: #fff;
        padding: 16px;
        overflow: hidden;
        display: grid;
        grid-template-columns: 1fr 3fr;
        grid-gap: 8px;
        text-overflow: ellipsis;
    }
    li > p {
        margin: 0 !important;
    }

    @media only screen and (max-width: 733px) {
        li {
            grid-template-columns: 4fr;
            grid-gap: 8px;
        }
        li > p {
            margin: 0 !important;
        }
        li > p:first-of-type {
            margin-bottom: 0;
        }
        li > p:last-of-type {
            margin-top: 0;
        }
    }
`;

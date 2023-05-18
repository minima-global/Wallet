import styled from '@emotion/styled';

const OngoingTransaction = styled('div')`
    border-radius: 4px;
    background-color: #fff;
    margin: 16px;
    width: auto;
    max-width: 360px;
    padding: 16px;
    overflow: overlay;
    outline: none;
    display: flex;
    flex-direction: column;
    row-gap: 8px;
    position: relative;
    height: 45vh;
    @media only screen and (max-width: 600px) {
        max-height: 80vh;
    }
    @media only screen and (max-height: 600px) {
        max-height: 80vh;
    }
    * {
        font-family: Manrope-regular;
        font-size: 1rem;
    }
    > h5 {
        border-bottom: 1px solid #d3d3d3;
        padding-bottom: 8px;
        margin: 0;
        padding: 0;
        padding-bottom: 8px;
    }
    #pending {
        width: 16px;
        height: 16px;
        display: inline-block;
    }
    #list {
        padding: 0;
        margin: 0;
        list-style: none;
        row-gap: 8px;
        display: grid;
        // margin: 4px;
    }
    #list * {
        padding: 0;
        margin: 0;
    }
    #list h6 {
        font-size: 0.975rem;
    }
    #list p {
        font-size: 0.875rem;
        word-break: break-word;
    }

    #content {
        height: 100%;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        word-break: break-all;
    }

    button {
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    button:first-of-type {
        border: 1px solid #16181c;
        padding: 4px 16px;
        background: none;
        font-size: 0.975rem;
    }

    button:last-of-type {
        border: 1px solid #16181c;
        padding: 4px 16px;
        border: none;
        background-color: #16181c;
        color: #fff;
        font-family: Manrope-regular;
        font-size: 0.975rem;
    }
    button#cancel {
        border: 1px solid #16181c;
        padding: 3.5px 16px;
        border: none;
        background-color: #fff;
        color: #16181c;
        border: 0.5px solid #16181c;
        font-family: Manrope-regular;
        font-size: 0.975rem;
    }
    button:hover {
        cursor: pointer;
    }
    button:disabled {
        background-color: #d3d3d3;
    }

    #withdraw h5 {
        padding: 0;
        margin: 0;
        font-family: Manrope-regular;
        font-weight: 400;
    }
    #withdraw div:first-of-type {
        padding-right: 0 !important;
    }
    #withdraw button {
        padding: 0;
        min-width: 40px;
        height: 100%;
        font-size: 0.875rem;
    }

    #status {
        background-color: #ebfff0;
        padding: 4px;
        font-family: Manrope-regular;
        font-size: 0.875rem;
        word-break: break-word;
    }
    #help {
        font-family: Manrope-regular;
        font-size: 0.875rem;
        word-break: break-word;
    }
`;

export default OngoingTransaction;

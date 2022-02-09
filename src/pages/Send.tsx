import { callSend } from '../minima/rpc-commands';
import { useSnackbar } from 'notistack';
import { Button, TextField, Box } from '@mui/material';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useRef } from 'react';

const Send = () => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const readerDiv = useRef(null);

    const onSendClicked = () => {
        callSend({
            address: '',
            amount: '',
            tokenid: '',
        }).then(
            (res) => {
                console.log(res);
                enqueueSnackbar('success', { variant: 'success' });
            },
            () => {
                enqueueSnackbar('error', { variant: 'error' });
            }
        );
    };

    // if (!('BarcodeDetector' in window)) {
    //     alert('Barcode Detector is not supported by this browser.');
    // } else {
    //     alert('Barcode Detector supported!');

    //     // create new detector
    //     // @ts-ignore
    //     var barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] });
    // }

    // useEffect(() => {
    //     function onScanSuccess(decodedText: any, decodedResult: any) {
    //         // handle the scanned code as you like, for example:
    //         // console.log(`Code matched = ${decodedText}`, decodedResult);
    //         alert(`Code matched = ${decodedText}`);
    //     }

    //     function onScanFailure(error: any) {
    //         // handle scan failure, usually better to ignore and keep scanning.
    //         // for example:
    //         console.warn(`Code scan error = ${error}`);
    //     }

    //     let html5QrcodeScanner = new Html5QrcodeScanner(
    //         'reader',
    //         { fps: 10, qrbox: { width: 250, height: 250 } },
    //         /* verbose= */ false
    //     );
    //     html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    // }, []);

    return (
        <>
            <h1>Form</h1>
            {/* <Button variant="contained" onClick={onSendClicked}>
                Send
            </Button> */}
            <TextField fullWidth placeholder="Address" id="address" />
            <div id="reader" ref={readerDiv}></div>
        </>
    );
};

export default Send;

const MyCustomBadge = () => {
    return <div>My Custom Badge</div>;
};

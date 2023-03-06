import React from 'react';
import styled from '@emotion/styled';
import { Button, CircularProgress, Grid, Stack } from '@mui/material';
import { QrReader } from 'react-qr-reader';
import { DRAWERWIDTH } from '../../constants';
import useIsCameraEnabledPermissions from '../../../hooks/useIsCameraEnabledPermissions';
import { NoResults } from '../layout/MiToken';
import MiError from '../layout/MiError/MiError';

const BackDrop = styled('div')`
    position: fixed;
    background: rgba(0, 0, 0, 0.5);
    z-index: 100;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 8px;
    width: 100%;
    height: 100%;
    padding-top: 42px;

    @media (min-width: 600px) {
        margin-left: ${DRAWERWIDTH}px!important;
        width: calc(100% - ${DRAWERWIDTH}px);
    }
`;

const QrContainer = styled('div')`
    width: 100%;
    display: flex;
    row-gap: 8px;
    flex-direction: column;
    align-items: space-around;
    background-color: rgba(255, 255, 255, 1);
    border-radius: 12px;
    padding-bottom: 8px;
    overflow-y: scroll;
    padding: 16px;

    position: relative;
`;
const QrScanner = ({ setScannedResult, open, closeModal, error }: any) => {
    const videoTag = React.createRef<HTMLVideoElement>();
    const { cameraStatus } = useIsCameraEnabledPermissions();

    // React.useEffect(() => {
    //     if (cameraStatus && cameraStatus === 'granted' && open) {
    //         navigator.mediaDevices
    //             .getUserMedia({ audio: false, video: true })
    //             .then((stream) => {
    //                 if (videoTag && videoTag.current) {
    //                     console.log('setting streasm..');
    //                     videoTag.current.srcObject = stream;
    //                     videoTag.current.playsInline = true;
    //                 }
    //             })
    //             .catch((err) => {
    //                 console.log('Cannot access camera.. it is not accessible', err);
    //             });
    //     }
    // }, [cameraStatus]);
    return (
        open && (
            <BackDrop>
                <Grid container>
                    <Grid item xs={0} md={2}></Grid>
                    <Grid item xs={12} md={8}>
                        <QrContainer>
                            {cameraStatus === 'granted' && (
                                <Stack rowGap={2} flexDirection="column">
                                    <QrReader
                                        videoContainerStyle={{
                                            paddingTop: '75%',
                                            borderRadius: '12px',
                                            borderBottomLeftRadius: '0',
                                            borderBottomRightRadius: '0',
                                        }}
                                        videoStyle={{
                                            objectFit: 'content',
                                            height: 'auto',
                                            width: '100%',
                                        }}
                                        scanDelay={500}
                                        onResult={(data: any) => {
                                            if (data) {
                                                setScannedResult(data.text);
                                            }
                                        }}
                                        constraints={{ facingMode: 'environment' }}
                                    />
                                    {error && (
                                        <MiError>
                                            <h6>Invalid Minima Address</h6>
                                            <p>{error}</p>
                                        </MiError>
                                    )}
                                </Stack>
                            )}
                            {/* {cameraStatus === 'granted' && <video autoPlay ref={videoTag} />} */}
                            {cameraStatus === 'denied' && (
                                <Stack alignItems="center" justifyContent="center">
                                    <NoResults>
                                        <h6>Camera is unavailable!</h6>
                                        <p>
                                            You have denied camera permissions, please enable it and refresh this page.
                                        </p>
                                    </NoResults>
                                </Stack>
                            )}
                            {!cameraStatus && (
                                <Stack alignItems="center" justifyContent="center">
                                    <NoResults>
                                        <h6>Camera API is unavailable on this browser!</h6>
                                        <p>
                                            Please consider using compatible and up to date browser. Try a later version
                                            of google chrome, firefox, brave or safari.
                                        </p>
                                    </NoResults>
                                </Stack>
                            )}
                            {cameraStatus === 'prompt' && (
                                <Stack alignItems="center" justifyContent="center">
                                    <NoResults>
                                        <h6>Camera is unavailable</h6>
                                        <p>Accept the camera permissions prompt and proceed.</p>
                                    </NoResults>
                                </Stack>
                            )}
                            <Stack sx={{ p: 2 }}>
                                <Button
                                    onClick={closeModal}
                                    variant="outlined"
                                    fullWidth
                                    disableElevation
                                    color="inherit"
                                >
                                    Cancel
                                </Button>
                            </Stack>
                        </QrContainer>
                    </Grid>
                    <Grid item xs={0} md={2}></Grid>
                </Grid>
            </BackDrop>
        )
    );
};

export default QrScanner;

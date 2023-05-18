import { CircularProgress } from '@mui/material';
import OngoingTransaction from '../OngoingTransaction';
import styles from './FormDialog.module.css';
import useIsMobileScreenSize from '../../../../hooks/useIsMobileScreenSize';
import Backdrop from '../../Backdrop';

interface iProps {
    open: boolean;
    error: string;
    transactionCreationStatus: false | 'ongoing' | 'complete' | 'failed' | 'pending';
    hideSuccess: () => void;
    clearForm: () => void;
}
const SuccessDialog = ({ open, error, transactionCreationStatus, hideSuccess, clearForm }: iProps) => {
    const isMobile = useIsMobileScreenSize();
    return (
        <Backdrop open={open}>
            <OngoingTransaction>
                <h5>Transaction in progress</h5>
                <div id="content">
                    <ul id="list">
                        <li>
                            <h6>Transaction Status</h6>
                            {transactionCreationStatus === 'ongoing' && <CircularProgress size={8} />}
                            {transactionCreationStatus === 'complete' && <p>Completed!</p>}
                            {transactionCreationStatus === 'failed' && (
                                <p>{error.split('java.lang.IllegalArgumentException: ')}</p>
                            )}
                            {transactionCreationStatus === 'pending' && (
                                <>
                                    {!!isMobile && (
                                        <p>
                                            Your action is now pending, please accept the action by clicking the pending
                                            icon <img id="pending" alt="pending" src="assets/pendingTransaction.svg" />{' '}
                                            in the top-right of your apk.
                                        </p>
                                    )}
                                    {!isMobile && (
                                        <p>Click the Pending Actions button in the header of your MDS hub.</p>
                                    )}
                                </>
                            )}
                        </li>
                    </ul>
                    <div className={styles['button__wrapper']}>
                        <button
                            disabled={transactionCreationStatus === 'ongoing'}
                            onClick={() => {
                                hideSuccess();

                                if (
                                    transactionCreationStatus === 'pending' ||
                                    transactionCreationStatus === 'complete'
                                ) {
                                    clearForm();
                                }
                            }}
                        >
                            {transactionCreationStatus === 'ongoing' ? <CircularProgress size={8} /> : 'Ok'}
                        </button>
                    </div>
                </div>
            </OngoingTransaction>
        </Backdrop>
    );
};

export default SuccessDialog;

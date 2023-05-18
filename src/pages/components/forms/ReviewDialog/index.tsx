import { CircularProgress, Dialog } from '@mui/material';
import OngoingTransaction from '../OngoingTransaction';
import styles from './FormDialog.module.css';

interface iProps {
    open: boolean;
    error: string;
    transactionCreationStatus: false | 'ongoing' | 'complete' | 'failed' | 'pending';
    hideReview: () => void;
    submitForm: () => void;
    children: any;
}
const ReviewDialog = ({ open, transactionCreationStatus, hideReview, submitForm, children }: iProps) => {
    return (
        <Dialog open={open} className={styles['dialog__']}>
            <OngoingTransaction>
                <h5>Review Transaction</h5>
                <div id="content">
                    {!children && (
                        <ul id="list">
                            <li>
                                <h6>Status</h6>
                                <p>
                                    <CircularProgress size={8} />
                                </p>
                            </li>
                        </ul>
                    )}
                    {!!children && transactionCreationStatus === 'ongoing' && children}
                    {!!children && transactionCreationStatus === 'failed' && (
                        <ul id="list">
                            <li>
                                <h6>Transaction Status</h6>
                                <p>Failed! Please try again.</p>
                            </li>
                        </ul>
                    )}

                    <div className={styles['button__wrapper']}>
                        <button
                            disabled={transactionCreationStatus === 'pending'}
                            onClick={() => {
                                hideReview();
                            }}
                        >
                            Cancel
                        </button>

                        <button
                            disabled={transactionCreationStatus === 'pending'}
                            onClick={() => {
                                hideReview();
                                submitForm();
                            }}
                        >
                            Create
                        </button>
                    </div>
                </div>
            </OngoingTransaction>
        </Dialog>
    );
};

export default ReviewDialog;

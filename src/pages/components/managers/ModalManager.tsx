import Burn from '../forms/Burn';
import Confirmation from '../forms/Confirmation';

const ModalManager = ({ closeFn, modal, children, formik }: any) => {
    return <Confirmation formik={formik} children={children} open={modal === 'confirmation'} closeFn={closeFn} />;
};

export default ModalManager;

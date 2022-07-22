import Burn from '../forms/Burn';
import Confirmation from '../forms/Confirmation';

const ModalManager = ({ proceedFn, closeFn, modal, title, children, formik }: any) => {
    return (
        <>
            <Burn formik={formik} open={modal === 'burn'} closeFn={closeFn} proceedFn={proceedFn} />
            <Confirmation
                formik={formik}
                title={title}
                children={children}
                open={modal === 'confirmation'}
                closeFn={closeFn}
            />
        </>
    );
};

export default ModalManager;

import { createPortal } from 'react-dom';
import Grid from '../Grid';
import { ReactElement } from 'react';

interface IProps {
    open: boolean;
    children: ReactElement;
}
const Modal = ({ open, children }: IProps) => {
    return (
        open &&
        createPortal(
            <div className="ml-0 md:ml-[240px] absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 animate-fadeIn">
                <Grid variant="lg" title={<></>}>
                    <div className="mx-4 rounded bg-white bg-opacity-90 p-4">{children}</div>
                </Grid>
            </div>,

            document.body
        )
    );
};

export default Modal;

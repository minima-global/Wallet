import styles from './Backdrop.module.css';

interface iProps {
    children: any;
    open: boolean;
}
const Backdrop = ({ children, open }: iProps) => {
    return <div className={`${styles.backdrop} ${open ? styles.open : ''}`}>{children}</div>;
};

export default Backdrop;

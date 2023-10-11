import { createRef, useCallback, useContext, useEffect, useState } from 'react';
import { appContext } from '../../../AppContext';

import styles from './Logs.module.css';
const Logs = () => {
    const [hide, setHide] = useState(true);
    const ref = createRef<HTMLDivElement>();
    const { logs } = useContext(appContext);

    const scrollToBottomOfList = useCallback(() => {
        if (ref && ref.current) {
            ref.current.scrollIntoView!({
                behavior: 'smooth',
                block: 'end',
            });
        }
    }, [ref]);

    useEffect(() => {
        scrollToBottomOfList();
    }, [logs]);

    return (
        <div className={styles['logs']}>
            <div
                className={`${styles.toggle} ${hide ? styles.borderAll : styles.borderTwo}`}
                onClick={() => setHide((prevState) => !prevState)}
            >
                <p>{hide ? 'Show' : 'Hide'} logs</p>
                <svg
                    className={`${!hide ? styles.active : styles.passive}`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <path
                        d="M11.6502 15.2747L6 9.5999L6.9 8.7251L11.6502 13.4747L16.4004 8.7251L17.3004 9.6251L11.6502 15.2747Z"
                        fill="#F4F4F5"
                    />
                </svg>
            </div>
            {!hide && (
                <div className={styles['stream']}>
                    {logs.length ? (
                        logs.map((l: any, i: number) => (
                            <code className="text-white" key={i}>
                                {l}
                            </code>
                        ))
                    ) : (
                        <code className="text-white">Loading logs...</code>
                    )}

                    <div ref={ref} className="pt-2" />
                </div>
            )}
        </div>
    );
};

export default Logs;

import { ReactElement, useContext } from 'react';
import useIsMinimaBrowser from '../../../hooks/useIsMinimaBrowser';
import { appContext } from '../../../AppContext';

import styles from "./Grid.module.css";

interface IProps {
    title?: string;
    children: ReactElement;
}
const Grid = ({ title, children }: IProps) => {
    const openTitleBar = useIsMinimaBrowser();
    const { promptMenu } = useContext(appContext);

    return (
        <div className={styles['grid']}>
            <header onClick={openTitleBar}>
                <div className="flex items-center">
                    <svg
                       className="block md:hidden mr-1"
                       xmlns="http://www.w3.org/2000/svg"
                       onClick={(e: any) => {
                           e.stopPropagation();
                           promptMenu();
                       }}
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        strokeWidth="2.5"
                        stroke="#FFFFFF"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M4 6l16 0" />
                        <path d="M4 12l16 0" />
                        <path d="M4 18l16 0" />
                    </svg>
                    
                    <h3 className="font-bold text-white text-xl">{title}</h3>
                </div>
            </header>

            <main>
                <div />
                {children}
                <div />
            </main>
        </div>
    );
};

export default Grid;

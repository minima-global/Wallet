import { ReactElement } from 'react';
import useIsMinimaBrowser from '../../../hooks/useIsMinimaBrowser';

interface IProps {
    title: ReactElement;
    children: ReactElement;
    variant: 'sm' | 'lg';
}
const Grid = ({ title, children }: IProps) => {
    const openTitleBar = useIsMinimaBrowser();
    return (
        <div className={`grid grid-cols-1 grid-rows-[56px,1fr]`}>
            <header onClick={openTitleBar} className="p-4 bg-black text-white text-md flex items-center gap-2">
                {title}
            </header>

            <main className='m-4'>
                <div />
                {children}
                <div />
            </main>
        </div>
    );
};

export default Grid;

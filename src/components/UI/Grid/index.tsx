import { ReactElement } from 'react';
import useIsMinimaBrowser from '../../../hooks/useIsMinimaBrowser';

interface IProps {
    title: ReactElement;
    children: ReactElement;
    variant: 'sm' | 'lg';
}
const Grid = ({ title, children, variant }: IProps) => {
    const openTitleBar = useIsMinimaBrowser();
    let base = `grid grid-cols-[1fr_minmax(0,760px)_1fr] grid-rows-1 pt-4 h-[calc(100vh_-_56px)]`;
    if (variant === 'sm') {
        base = 'grid grid-cols-[1fr_minmax(0,560px)_1fr] grid-rows-1 pt-4';
    }

    return (
        <div className="grid grid-cols-1 grid-rows-[56px,1fr] pb-4">
            <header onClick={openTitleBar} className="p-4 bg-black text-white text-md flex items-center gap-2">
                {title}
            </header>

            <main className={base}>
                <div />
                {children}
                <div />
            </main>
        </div>
    );
};

export default Grid;

import { ReactElement } from 'react';
import useIsMinimaBrowser from '../../../hooks/useIsMinimaBrowser';
import useGetInnerHeight from '../../../hooks/useGetInnerHeight';

interface IProps {
    title: ReactElement;
    children: ReactElement;
    variant: 'sm' | 'lg';
}
const Grid = ({ title, children, variant }: IProps) => {
    const openTitleBar = useIsMinimaBrowser();
    const innerHeight = useGetInnerHeight();
    let base = `grid grid-cols-[1fr_minmax(0,760px)_1fr] grid-rows-1 pt-4`;
    if (variant === 'sm') {
        base = 'grid grid-cols-[1fr_minmax(0,560px)_1fr] grid-rows-1 pt-4';
    }

    return (
        <div className={`grid grid-cols-1 grid-rows-[56px,1fr] pb-4 `}>
            <header onClick={openTitleBar} className="p-4 bg-black text-white text-md flex items-center gap-2">
                {title}
            </header>

            <main style={{ height: `${innerHeight - 56}px` }} className={`${base} overflow-y-scroll`}>
                <div />
                {children}
                <div />
            </main>
        </div>
    );
};

export default Grid;

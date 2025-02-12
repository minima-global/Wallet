import { MutableRefObject, useEffect, useRef } from "react";
import { useDraggable } from "react-use-draggable-scroll";

const Timeline = ({ months, activeMonth, setActiveMonth }: { months: string[], activeMonth: string, setActiveMonth: (month: string) => void }) => {
    const ref = useRef<HTMLDivElement>(null);
    const { events } = useDraggable(ref as MutableRefObject<HTMLElement>, {
        applyRubberBandEffect: true,
    });

    useEffect(() => {
        if (months) {
            if (ref.current) {
                ref.current.scrollLeft = ref.current.scrollWidth;
            }
        }
    }, [months, ref]);

    const goToPrevious = () => {
        const index = months.findIndex((month) => month === activeMonth);

        if (index !== -1) {
            setActiveMonth(months[index - 1]);
        }
    }

    const goToNext = () => {
        const index = months.findIndex((month) => month === activeMonth);

        if (index + 1 >= months.length) {
            setActiveMonth('all');
            return;
        }

        if (index !== -1) {
            setActiveMonth(months[index + 1]);
        }
    }

    return (
        <>
            <button onClick={goToPrevious} disabled={months && activeMonth === months[0]} className="disabled:opacity-90 disabled:cursor-not-allowed bg-contrast1 enabled:hover:bg-contrast2 enabled:active:text-black enabled:active:bg-white cursor-pointer p-4">
                <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.96875 5L5.96875 -4.64434e-08L7.03125 1.0625L3.09375 5L7.03125 8.9375L5.96875 10L0.96875 5Z" fill="currentColor" />
                </svg>
            </button>
            <div className="grow bg-contrast1 overflow-hidden relative cursor-grab active:cursor-grabbing">
                <div
                    className="absolute max-w-full h-full flex space-x-3 overflow-x-scroll overflow-x-hidden scrollbar-hide"
                    ref={ref}
                    {...events}
                >
                    <div className="flex">
                        {months && months.map((month) => (
                            <div
                                key={month}
                                className={`w-[300px] h-full bg-blue-500 flex items-center justify-center text-white border-b-2 border-transparent ${activeMonth === month ? '!border-orange' : ''}`}
                                onClick={() => setActiveMonth(month)}
                            >
                                {month}
                            </div>
                        ))}
                        <div onClick={() => setActiveMonth('all')} className={`w-[300px] h-full bg-blue-500 flex items-center justify-center text-white border-b-2 border-transparent ${activeMonth === 'all' ? '!border-orange' : ''}`}>
                            All
                        </div>
                    </div>
                </div>
            </div>
            <button onClick={goToNext} disabled={activeMonth === 'all'} className="disabled:opacity-90 disabled:cursor-not-allowed bg-contrast1 enabled:hover:bg-contrast2 enabled:active:text-black enabled:active:bg-white cursor-pointer p-4">
                <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.03125 5L2.03125 10L0.96875 8.9375L4.90625 5L0.96875 1.0625L2.03125 1.26702e-08L7.03125 5Z" fill="currentColor" />
                </svg>
            </button>
        </>
    );
}

export default Timeline;

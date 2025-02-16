import { format } from "date-fns";
import useEmblaCarousel from "embla-carousel-react";
import useTranslation from "../../hooks/useTranslation";
const Timeline = ({ containScroll = false, months, activeMonth, setActiveMonth }: { containScroll: boolean, months: string[], activeMonth: string, setActiveMonth: (month: string) => void }) => {
    const { t } = useTranslation();
    const [emblaRef, emblaApi] = useEmblaCarousel({
        slidesToScroll: 1,
        dragFree: false,
        watchDrag: true,
        align: 'center',
        containScroll: containScroll ? 'trimSnaps' : undefined,
        startIndex: months ? months.length - 1 : 0
    });

    const goToPrevious = () => {

        const index = months.findIndex((month) => month === activeMonth);

        if (index !== -1) {
            setActiveMonth(months[index - 1]);
            emblaApi?.scrollTo(index - 1);
        }
    }

    const goToNext = () => {
        const index = months.findIndex((month) => month === activeMonth);
        emblaApi?.scrollTo(index + 1);

        if (index + 1 === months.length) {
            setActiveMonth('all');
            return;
        }

        if (index !== -1) {
            setActiveMonth(months[index + 1]);
        }
    }

    if (!months) {
        return <div />;
    }

    return (
        <>
            <button onClick={goToPrevious} disabled={activeMonth === months[0]} className="hidden md:block disabled:text-grey disabled:cursor-not-allowed bg-contrast1 border border-contrast2 enabled:hover:bg-contrast2 enabled:active:text-black enabled:active:bg-white cursor-pointer py-4 px-5">
                <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.96875 5L5.96875 -4.64434e-08L7.03125 1.0625L3.09375 5L7.03125 8.9375L5.96875 10L0.96875 5Z" fill="currentColor" />
                </svg>
            </button>
            <div className="grow border border-contrast2 min-h-[52px] md:h-full md:min-h-[54px] flex -mx-4 md:mx-0 bg-contrast1 relative md:overflow-hidden">
                <div className="bg-contrast1">
                    <div className="absolute h-full slide w-full mx-4 md:mx-0 overflow-x-hidden bg-contrast1">
                        <div
                            className="slider-container__viewport"
                            ref={emblaRef}
                        >
                            <div className="slider-container__container">
                                {months && months.map((month) => (
                                    <div
                                        key={month}
                                        className={`slider-container__slide mt-[1px] font-bold text-[15px] capitalize cursor-pointer flex items-center justify-center border-b-2 border-transparent transition-all duration-100 ${activeMonth === month ? '!border-orange' : 'hover:text-grey80'}`}
                                        onClick={() => {
                                            setActiveMonth(month);
                                            emblaApi?.scrollTo(months.findIndex((m) => m === month));
                                        }}
                                    >
                                        {month === 'all' ? t('all') : t(format(new Date(month), 'MMM').toLowerCase()) + ' ' + format(new Date(month), 'yyyy')}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button onClick={goToNext} disabled={activeMonth === 'all'} className="hidden md:block disabled:text-grey disabled:cursor-not-allowed border border-contrast2 bg-contrast1 enabled:hover:bg-contrast2 enabled:active:text-black enabled:active:bg-white cursor-pointer py-4 px-5">
                <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.03125 5L2.03125 10L0.96875 8.9375L4.90625 5L0.96875 1.0625L2.03125 1.26702e-08L7.03125 5Z" fill="currentColor" />
                </svg>
            </button>
        </>
    );
}

export default Timeline;

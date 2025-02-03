import { createFileRoute } from '@tanstack/react-router'
import Header from '../../components/Header'
import Navigation from '../../components/Navigation'
import InfoBox from '../../components/InfoBox'

export const Route = createFileRoute('/history/summary')({
    component: RouteComponent,
})

const PAGE_TITLE = "Transaction summary"

function RouteComponent() {
    return (
        <>
            <Header />
            <div className="mt-10 container mx-auto flex">
                <div className="flex w-full gap-10">
                    <div className="flex flex-col gap-5">
                        <Navigation />
                    </div>
                    <div className="grow flex flex-col">
                        <div className="text-sm flex bg-contrast2 rounded-full flex items-center gap-3 w-fit px-3 py-1 text-white mb-5">
                            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.00052 9.711L0.289062 4.99955L5.00052 0.288086L5.77448 1.06204L1.83698 4.99955L5.77448 8.93705L5.00052 9.711Z" fill="#E9E9EB" />
                            </svg>
                            Back
                        </div>
                        <div className="grid grid-cols-2 mb-6">
                            <div className="col-span-1">
                                <h1 className="text-white text-2xl">{PAGE_TITLE}</h1>
                            </div>
                            <div className="col-span-1 flex justify-end">
                                <div className="flex items-center gap-5">
                                    <div>
                                        <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 10L0 5L5 0L6.0625 1.0625L2.125 5L6.0625 8.9375L5 10ZM11 10L9.9375 8.9375L13.875 5L9.9375 1.0625L11 0L16 5L11 10Z" fill="#A7A7B0" />
                                        </svg>
                                    </div>
                                    <div>
                                        <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 10L2 6L3.0625 4.9375L5.25 7.125V0H6.75V7.125L8.9375 4.9375L10 6L6 10ZM1.49417 13C1.08139 13 0.729167 12.8531 0.4375 12.5594C0.145833 12.2656 0 11.9125 0 11.5V10H1.5V11.5H10.5V10H12V11.5C12 11.9125 11.8531 12.2656 11.5592 12.5594C11.2653 12.8531 10.9119 13 10.4992 13H1.49417Z" fill="#A7A7B0" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="select-none flex flex-col gap-2">
                            <InfoBox title="Transaction type" value="Value transfer" />
                            <InfoBox title="Inputs" href="#" />
                            <InfoBox title="Outputs" href="#" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RouteComponent;
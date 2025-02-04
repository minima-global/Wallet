import { createFileRoute } from '@tanstack/react-router'
import Header from '../../components/Header'
import Send from '../../components/Send'
import Navigation from '../../components/Navigation'
import InfoBox from '../../components/InfoBox'

export const Route = createFileRoute('/send/confirmation')({
    component: Index,
})

const PAGE_TITLE = "Confirmation";

function Index() {
    return (
        <>
            <Header />
            <div className="mt-10 container mx-auto flex">
                <div className="flex w-full gap-10">
                    <div className="flex flex-col gap-5">
                        <Navigation />
                    </div>
                    <div className="grow flex flex-col">
                        <h1 className="text-white text-2xl mb-6">{PAGE_TITLE}</h1>

                        <div className="flex flex-col gap-2 mb-8">

                            <div className="cursor-pointer bg-grey10 dark:bg-darkContrast relative w-full flex items-center p-5 rounded">
                                <div className="grow flex">
                                    <div className="w-[48px] h-[48px] border border-darkConstrast dark:border-grey80 rounded overflow-hidden">
                                        <svg
                                            width="48"
                                            height="48"
                                            viewBox="0 0 48 48"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <rect width="48" height="48" fill="white"></rect>
                                            <path
                                                d="M32.4428 16.759L31.2053 22.2329L29.6226 15.6286L24.0773 13.3795L22.578 19.9957L21.2571 12.2371L15.7119 10L10 35.2512H16.0569L17.8062 27.4926L19.1271 35.2512H25.1959L26.6834 28.6349L28.266 35.2512H34.323L38 18.9962L32.4428 16.759Z"
                                                fill="black"
                                            ></path>
                                        </svg>
                                    </div>
                                    <div className="grow flex items-center overflow-hidden px-4">
                                        <div className="grow items-center w-full">
                                            <div className="flex items-center grow">
                                                <h6 className="text-lg font-bold truncate text-black dark:text-neutral-400">
                                                    Minima
                                                </h6>
                                                <div className="!text-blue-500 my-auto ml-1">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="stroke-white"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="2.5"
                                                        stroke="currentColor"
                                                        fill="none"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path
                                                            stroke="none"
                                                            d="M0 0h24v24H0z"
                                                            fill="none"
                                                        ></path>
                                                        <path d="M5 7.2a2.2 2.2 0 0 1 2.2 -2.2h1a2.2 2.2 0 0 0 1.55 -.64l.7 -.7a2.2 2.2 0 0 1 3.12 0l.7 .7c.412 .41 .97 .64 1.55 .64h1a2.2 2.2 0 0 1 2.2 2.2v1c0 .58 .23 1.138 .64 1.55l.7 .7a2.2 2.2 0 0 1 0 3.12l-.7 .7a2.2 2.2 0 0 0 -.64 1.55v1a2.2 2.2 0 0 1 -2.2 2.2h-1a2.2 2.2 0 0 0 -1.55 .64l-.7 .7a2.2 2.2 0 0 1 -3.12 0l-.7 -.7a2.2 2.2 0 0 0 -1.55 -.64h-1a2.2 2.2 0 0 1 -2.2 -2.2v-1a2.2 2.2 0 0 0 -.64 -1.55l-.7 -.7a2.2 2.2 0 0 1 0 -3.12l.7 -.7a2.2 2.2 0 0 0 .64 -1.55v-1"></path>
                                                        <path d="M9 12l2 2l4 -4"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <InfoBox title="Amount" value="100" />
                            <InfoBox title="Recipient address" value="MxG085SFV3DP3SQ6M248ASE5BJPH8Z796BADZJ0QD5CMBFGK66ZFU1DAN3YJHZ9" />
                            <InfoBox title="Message" value="Hello world" />
                            <InfoBox title="Burn" value="10" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Send>Review</Send>
                            <Send secondary>Cancel</Send>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

import { createFileRoute } from '@tanstack/react-router'
import Header from '../../components/Header'
import Navigation from '../../components/Navigation'
import InfoBox from '../../components/InfoBox'
import BackButton from '../../components/BackButton'

export const Route = createFileRoute('/balance/$id')({
    component: RouteComponent,
})

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
                        <BackButton />
                        <div className="grid grid-cols-2 mb-6">
                            <div className="col-span-1">
                                <h1 className="text-white text-2xl">Token details</h1>
                            </div>
                            <div className="col-span-1 flex justify-end">
                                <div className="flex gap-2">
                                    <div className="flex justify-end cursor-pointer select-none">
                                        <div className="flex items-center gap-2 text-sm text-grey60 text-xs font-bold bg-contrast1 w-fit rounded-full px-3.5 py-1.5 border dark:border-contrast2 origin-center active:scale-[0.95] transition-all duration-100">
                                            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path className="fill-grey40" d="M9.00234 9.14783C9.8772 9.14783 10.6202 8.84165 11.2313 8.22928C11.8424 7.61692 12.148 6.87331 12.148 5.99845C12.148 5.12359 11.8418 4.3806 11.2294 3.76949C10.6171 3.15838 9.87346 2.85283 8.99859 2.85283C8.12373 2.85283 7.38075 3.15901 6.76964 3.77137C6.15852 4.38373 5.85297 5.12734 5.85297 6.0022C5.85297 6.87706 6.15915 7.62005 6.77151 8.23116C7.38387 8.84227 8.12748 9.14783 9.00234 9.14783ZM9.00047 8.00033C8.44491 8.00033 7.97269 7.80588 7.5838 7.41699C7.19491 7.0281 7.00047 6.55588 7.00047 6.00033C7.00047 5.44477 7.19491 4.97255 7.5838 4.58366C7.97269 4.19477 8.44491 4.00033 9.00047 4.00033C9.55602 4.00033 10.0282 4.19477 10.4171 4.58366C10.806 4.97255 11.0005 5.44477 11.0005 6.00033C11.0005 6.55588 10.806 7.0281 10.4171 7.41699C10.0282 7.80588 9.55602 8.00033 9.00047 8.00033ZM9.00151 11.5837C7.13248 11.5837 5.4295 11.0759 3.89255 10.0603C2.35561 9.04491 1.20783 7.69158 0.449219 6.00033C1.20783 4.30908 2.35519 2.95574 3.8913 1.94033C5.42755 0.92477 7.13026 0.416992 8.99943 0.416992C10.8685 0.416992 12.5714 0.92477 14.1084 1.94033C15.6453 2.95574 16.7931 4.30908 17.5517 6.00033C16.7931 7.69158 15.6457 9.04491 14.1096 10.0603C12.5734 11.0759 10.8707 11.5837 9.00151 11.5837ZM9.00047 10.5003C10.556 10.5003 11.9935 10.0975 13.313 9.29199C14.6324 8.48644 15.6463 7.38921 16.3546 6.00033C15.6463 4.61144 14.6324 3.51421 13.313 2.70866C11.9935 1.9031 10.556 1.50033 9.00047 1.50033C7.44491 1.50033 6.00741 1.9031 4.68797 2.70866C3.36852 3.51421 2.35464 4.61144 1.6463 6.00033C2.35464 7.38921 3.36852 8.48644 4.68797 9.29199C6.00741 10.0975 7.44491 10.5003 9.00047 10.5003Z" fill="currentColor" />
                                            </svg>
                                            Hide tokens
                                        </div>
                                    </div>
                                    <div className="flex justify-end cursor-pointer select-none">
                                        <div className="flex items-center gap-2 text-sm text-grey60 text-xs font-bold bg-contrast1 w-fit rounded-full px-3.5 py-1.5 border dark:border-contrast2 origin-center active:scale-[0.95] transition-all duration-100">
                                            <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1.49935 8.99991C1.49935 9.7563 1.68956 10.4614 2.06997 11.1153C2.45025 11.7692 2.96358 12.297 3.60997 12.6987C3.54803 12.5812 3.50018 12.4569 3.46643 12.326C3.43282 12.1951 3.41602 12.0656 3.41602 11.9374C3.41602 11.6212 3.47615 11.3239 3.59643 11.0455C3.71657 10.7672 3.87331 10.5175 4.06664 10.2964L5.99935 8.08491L7.93997 10.2964C8.13345 10.5314 8.28893 10.788 8.40643 11.0664C8.52393 11.3447 8.58268 11.635 8.58268 11.9374C8.58268 12.0656 8.56588 12.1986 8.53227 12.3364C8.49852 12.4743 8.45067 12.602 8.38872 12.7195C9.03511 12.3595 9.54845 11.8456 9.92872 11.1778C10.3091 10.51 10.4993 9.78407 10.4993 8.99991C10.4993 8.29157 10.3778 7.59366 10.1348 6.90616C9.89171 6.21866 9.54102 5.58324 9.08268 4.99991C8.84657 5.15269 8.60004 5.27074 8.3431 5.35408C8.08615 5.43741 7.8049 5.47908 7.49935 5.47908C6.77185 5.47908 6.13379 5.25685 5.58518 4.81241C5.03657 4.36796 4.69546 3.78623 4.56185 3.0672C4.06185 3.52026 3.62435 3.98637 3.24935 4.46553C2.87435 4.9447 2.5549 5.43692 2.29102 5.9422C2.02713 6.44762 1.82921 6.95727 1.69727 7.47116C1.56532 7.98505 1.49935 8.49463 1.49935 8.99991ZM5.99935 9.74991L4.89518 10.9999C4.77018 11.1527 4.67296 11.3089 4.60352 11.4687C4.53407 11.6284 4.49935 11.8055 4.49935 11.9999C4.49935 12.4166 4.64518 12.7707 4.93685 13.0624C5.22852 13.3541 5.58268 13.4999 5.99935 13.4999C6.41602 13.4999 6.77018 13.3541 7.06185 13.0624C7.35352 12.7707 7.49935 12.4166 7.49935 11.9999C7.49935 11.8055 7.46463 11.6249 7.39518 11.4582C7.32574 11.2916 7.22852 11.1388 7.10352 10.9999L5.99935 9.74991ZM5.58268 0.745117V2.47908C5.58268 3.01324 5.76858 3.46623 6.14039 3.83803C6.5122 4.20984 6.96518 4.39574 7.49935 4.39574C7.74074 4.39574 7.97018 4.35116 8.18768 4.26199C8.40504 4.17283 8.59657 4.04859 8.76227 3.88928L9.08747 3.56095C9.82678 4.06734 10.4275 4.82748 10.8896 5.84137C11.3516 6.85526 11.5827 7.9081 11.5827 8.99991C11.5827 10.5491 11.0394 11.8669 9.95289 12.9535C8.86636 14.04 7.54852 14.5832 5.99935 14.5832C4.45018 14.5832 3.13234 14.04 2.04581 12.9535C0.95928 11.8669 0.416016 10.5491 0.416016 8.99991C0.416016 7.62602 0.867683 6.20533 1.77102 4.73782C2.67435 3.27046 3.9449 1.93956 5.58268 0.745117Z" fill="white" />
                                            </svg>
                                            Burn token
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <ul className="select-none flex flex-col gap-2">
                            <li className="cursor-pointer bg-grey10 dark:bg-darkContrast relative w-full flex items-center p-5 rounded">
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
                                                        stroke-width="2.5"
                                                        stroke="currentColor"
                                                        fill="none"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
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
                            </li>

                            <InfoBox title="Description" value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco" />
                            <InfoBox title="Token ID" value="0x00" copy />
                            <InfoBox title="Outputs" href="#" />

                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

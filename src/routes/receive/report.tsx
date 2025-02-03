import { createFileRoute } from '@tanstack/react-router'
import Header from '../../components/Header'
import Navigation from '../../components/Navigation'
import BackButton from '../../components/BackButton'
import InfoBox from '../../components/InfoBox'

export const Route = createFileRoute('/receive/report')({
    component: Index,
})

const PAGE_TITLE = "Validation report";

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
                        <BackButton />
                        <h1 className="text-white text-2xl mb-6">{PAGE_TITLE}</h1>
                        <div className="text-white text-sm mb-6 bg-contrast1 p-3 px-4 border-l-4 border-l-green rounded">
                            This address is safe for use
                        </div>
                        <div className="grid grid-cols-12 text-grey60 mb-6 gap-4">
                            <div className="col-span-4 bg-contrast1 pt-3 pb-4 px-4 rounded text-center">
                                <div className="text-lg mb-2">Belongs to this node</div>
                                <svg className="mx-auto w-[28px] h-[28px]" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.70858 13.2541L14.3316 7.65614L13.4028 6.72739L8.70858 11.3966L6.58358 9.29664L5.65483 10.2254L8.70858 13.2541ZM10.0046 19.1004C8.75725 19.1004 7.5805 18.8636 6.47433 18.3899C5.36817 17.9162 4.4 17.2645 3.56983 16.4346C2.73967 15.6048 2.08758 14.6371 1.61358 13.5314C1.13975 12.4257 0.902832 11.2493 0.902832 10.0021C0.902832 8.73814 1.13967 7.55722 1.61333 6.45939C2.087 5.36156 2.73875 4.39756 3.56858 3.56739C4.39842 2.73722 5.36617 2.08514 6.47183 1.61114C7.5775 1.13731 8.75392 0.900391 10.0011 0.900391C11.2651 0.900391 12.446 1.13722 13.5438 1.61089C14.6417 2.08456 15.6057 2.73631 16.4358 3.56614C17.266 4.39597 17.9181 5.35956 18.3921 6.45689C18.8659 7.55422 19.1028 8.73481 19.1028 9.99864C19.1028 11.246 18.866 12.4227 18.3923 13.5289C17.9187 14.6351 17.2669 15.6032 16.4371 16.4334C15.6072 17.2636 14.6437 17.9156 13.5463 18.3896C12.449 18.8635 11.2684 19.1004 10.0046 19.1004Z" fill="#4FE3C1" />
                                </svg>
                            </div>
                            <div className="col-span-4 bg-contrast1 pt-3 pb-4 px-4 rounded text-center">
                                <div className="text-lg mb-2">Simple address</div>
                                <svg className="mx-auto w-[28px] h-[28px]" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.70858 13.2541L14.3316 7.65614L13.4028 6.72739L8.70858 11.3966L6.58358 9.29664L5.65483 10.2254L8.70858 13.2541ZM10.0046 19.1004C8.75725 19.1004 7.5805 18.8636 6.47433 18.3899C5.36817 17.9162 4.4 17.2645 3.56983 16.4346C2.73967 15.6048 2.08758 14.6371 1.61358 13.5314C1.13975 12.4257 0.902832 11.2493 0.902832 10.0021C0.902832 8.73814 1.13967 7.55722 1.61333 6.45939C2.087 5.36156 2.73875 4.39756 3.56858 3.56739C4.39842 2.73722 5.36617 2.08514 6.47183 1.61114C7.5775 1.13731 8.75392 0.900391 10.0011 0.900391C11.2651 0.900391 12.446 1.13722 13.5438 1.61089C14.6417 2.08456 15.6057 2.73631 16.4358 3.56614C17.266 4.39597 17.9181 5.35956 18.3921 6.45689C18.8659 7.55422 19.1028 8.73481 19.1028 9.99864C19.1028 11.246 18.866 12.4227 18.3923 13.5289C17.9187 14.6351 17.2669 15.6032 16.4371 16.4334C15.6072 17.2636 14.6437 17.9156 13.5463 18.3896C12.449 18.8635 11.2684 19.1004 10.0046 19.1004Z" fill="#4FE3C1" />
                                </svg>
                            </div>
                            <div className="col-span-4 bg-contrast1 pt-3 pb-4 px-4 rounded text-center">
                                <div className="text-lg mb-2">Validation report</div>
                                <svg className="mx-auto w-[28px] h-[28px]" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.70858 13.2541L14.3316 7.65614L13.4028 6.72739L8.70858 11.3966L6.58358 9.29664L5.65483 10.2254L8.70858 13.2541ZM10.0046 19.1004C8.75725 19.1004 7.5805 18.8636 6.47433 18.3899C5.36817 17.9162 4.4 17.2645 3.56983 16.4346C2.73967 15.6048 2.08758 14.6371 1.61358 13.5314C1.13975 12.4257 0.902832 11.2493 0.902832 10.0021C0.902832 8.73814 1.13967 7.55722 1.61333 6.45939C2.087 5.36156 2.73875 4.39756 3.56858 3.56739C4.39842 2.73722 5.36617 2.08514 6.47183 1.61114C7.5775 1.13731 8.75392 0.900391 10.0011 0.900391C11.2651 0.900391 12.446 1.13722 13.5438 1.61089C14.6417 2.08456 15.6057 2.73631 16.4358 3.56614C17.266 4.39597 17.9181 5.35956 18.3921 6.45689C18.8659 7.55422 19.1028 8.73481 19.1028 9.99864C19.1028 11.246 18.866 12.4227 18.3923 13.5289C17.9187 14.6351 17.2669 15.6032 16.4371 16.4334C15.6072 17.2636 14.6437 17.9156 13.5463 18.3896C12.449 18.8635 11.2684 19.1004 10.0046 19.1004Z" fill="#4FE3C1" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <InfoBox title="Validating" value="MxG085SFV3DP3SQ6M248ASE5BJPH8Z796BADZJ0QD5CMBFGK66ZFU1DAN3YJHZ9" />
                            <InfoBox title="0x address" value="0x00" copy />
                            <InfoBox title="Mx address" value="Mx00" copy />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

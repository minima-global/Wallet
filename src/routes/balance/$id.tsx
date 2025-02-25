import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import InfoBox from '../../components/InfoBox'
import BackButton from '../../components/BackButton'
import { appContext } from '../../AppContext'
import { Fragment, useContext, useState } from 'react'
import TokenIcon from '../../components/TokenIcon'
import TokenAuthenticity from '../../components/TokenAuthenticity'
import { renderTokenName } from '../../utils'
import { MDS } from '@minima-global/mds'
import useTranslation from '../../hooks/useTranslation'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Decimal from 'decimal.js'
import useFormatAmount from '../../hooks/useFormatAmount'

export const Route = createFileRoute('/balance/$id')({
    component: RouteComponent,
    parseParams: (params) => ({
        id: params.id,
    }),
})

function RouteComponent() {
    const { f } = useFormatAmount();
    const { t } = useTranslation();
    const { id } = useParams({ from: '/balance/$id' });
    const navigate = useNavigate();
    const { balance, setIsPending, setIsSuccess, hiddenTokens, setHiddenTokens, setIsError } = useContext(appContext);
    const isHidden = hiddenTokens.includes(id);

    const [burnAmount, setBurnAmount] = useState<string>('');
    const [showBurnModal, setShowBurnModal] = useState(false);
    const [showHideTokenModal, setShowHideTokenModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const token = balance.find((b) => b.tokenid === id);

    const toggleBurnModal = () => {
        setShowBurnModal(!showBurnModal);
    }

    const toggleHideTokenModal = () => {
        setShowHideTokenModal(!showHideTokenModal);
    }

    const confirmBurn = async () => {
        try {
            setIsLoading(true);

            const response = await MDS.cmd.send({
                params: {
                    tokenid: token?.tokenid,
                    amount: burnAmount,
                    address: '0xFF',
                    mine: 'true',
                }
            });

            setTimeout(() => {
                setIsLoading(false);
                setShowBurnModal(false);
            }, 250);

            if (response.pending) {
                return setIsPending({
                    uid: response.pendinguid as string,
                    callback: () => {
                        navigate({ to: '/' });
                    }
                });
            }

            if (response.status) {
                return setIsSuccess(true);
            }

            return setIsError({
                display: true,
                message: response.error
            });
        } catch {
            // do nothing
        }
    }

    const toggleHideToken = async () => {
        setShowHideTokenModal(false);

        setTimeout(() => {
            if (token?.tokenid) {
                if (isHidden) {
                    setHiddenTokens(hiddenTokens.filter((tokenId) => tokenId !== token.tokenid));
                } else {
                    setHiddenTokens([...hiddenTokens, token.tokenid]);
                }
            }
        }, 100);
    }

    const goToSendWithToken = () => {
        navigate({ to: `/send?tokenid=${token?.tokenid}` });
    }

    const normalFields = ['name', 'url', 'description', 'external_url', 'webvalidate', 'ticker', 'owner'];
    const hasMetadata = typeof token?.token === 'object' && token.token && Object.keys(token.token).some(key => !normalFields.includes(key));
    const metadata = hasMetadata
        ? Object.entries(token.token)
            .filter(([key]) => !normalFields.includes(key))
            .map(([key, value]) => ({ key, value }))
        : [];

    const isBurnAmountValid = (value: string) => {
        if (!token?.sendable) {
            return false;
        }

        if ((token as any)?.details?.decimals === 0) {
            return value.length > 0 && Number.isInteger(Number(value)) && new Decimal(value).lte(token?.sendable);
        }

        try {
            return value.length > 0 && new Decimal(value).lte(token?.sendable);
        } catch {
            return false;
        }
    }

    const canBurn = isBurnAmountValid(burnAmount);
    const isCustomToken = token && typeof token.token === 'object';

    const isNFT = token && (token as any).details && (token as any).details.decimals === 0;

    const renderArray = (key: string, item: string[]) => {
        return (
            <Fragment key={key}>
                {item.map((value, index) => {
                    if (typeof value !== 'string') {
                        return;
                    }

                    return <InfoBox key={key} title={`${key} #${index + 1}`} value={value || "N/A"} className="capitalize" />
                })}
            </Fragment>
        )
    }

    const renderObject = (key: string, item: Record<string, any>) => {
        return (
            <Fragment key={key}>
                {Object.entries(item).map(([key, value]) => {
                    if (typeof value === 'object' && value !== null) {  
                        return;
                    }

                    return <InfoBox key={key} title={key} value={value || "N/A"} className="capitalize" />
                })}
            </Fragment>
        )
    }

    return (
        <div>
            <div className={`${showBurnModal ? 'opacity-100' : 'pointer-events-none opacity-0'} transition-opacity duration-100 flex absolute z-50 inset-0 top-0 left-0 justify-center items-center w-screen h-screen`}>
                <div className={`bg-contrast1 mb-8 fixed z-[60] rounded-lg w-full max-w-[90%] md:max-w-[440px] text-center text-white p-5 transform transition-all duration-200 ${showBurnModal ? 'translate-y-[0%] opacity-100' : 'translate-y-[4px] opacity-0'}`}>
                    <h1 className="text-white text-2xl mt-1.5 mb-5 font-bold">{t('burn_token')}</h1>
                    <p className="text-grey80 text-base text-sm mb-3 max-w-[80%] mx-auto">{t('please_enter_an_amount_to_burn')}</p>
                    <div className="text-left">
                        <Input
                            label={t('burn')}
                            placeholder={t('enter_a_burn_amount')}
                            value={burnAmount}
                            inverse
                            onChange={(value) => setBurnAmount(value)}
                            validation={isBurnAmountValid}
                            validationMessage={t('please_enter_a_valid_amount')}
                            max={token?.sendable || ""}
                        />
                    </div>
                    <div className="mt-6 space-y-2">
                        <Button isLoading={isLoading} disabled={!canBurn} onClick={confirmBurn}>
                            {t('confirm')}
                        </Button>
                        <Button variant="tertiary" onClick={toggleBurnModal}>
                            {t('close')}
                        </Button>
                    </div>
                </div>
                <div className="z-50 fixed bg-black opacity-90 w-screen h-screen top-0 left-0"></div>
            </div>

            <div className={`${showHideTokenModal ? 'opacity-100' : 'pointer-events-none opacity-0'} transition-opacity duration-100 flex absolute z-50 inset-0 top-0 left-0 justify-center items-center w-screen h-screen`}>
                <div className={`bg-contrast1 mb-8 fixed z-[60] rounded-lg w-full max-w-[90%] md:max-w-[440px] text-center text-white p-5 transform transition-all duration-200 ${showHideTokenModal ? 'translate-y-[0%] opacity-100' : 'translate-y-[4px] opacity-0'}`}>
                    {isHidden ? (
                        <>
                            <h1 className="text-white text-2xl mt-1.5 mb-5 font-bold">{t('show_token')}</h1>
                            <p className="text-grey80 text-base text-sm mb-2 max-w-[80%] mx-auto">{t('are_you_sure_you_want_to_show_this_token')}</p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-white text-2xl mt-1.5 mb-5 font-bold">{t('hide_token')}</h1>
                            <p className="text-grey80 text-base text-sm mb-2 max-w-[80%] mx-auto">{t('are_you_sure_you_want_to_hide_this_token')}</p>
                        </>
                    )}
                    <div className="mt-6 space-y-2">
                        <Button onClick={toggleHideToken}>
                            {t('confirm')}
                        </Button>
                        <Button variant="tertiary" onClick={toggleHideTokenModal}>
                            {t('close')}
                        </Button>
                    </div>
                </div>
                <div className="z-50 fixed bg-black opacity-90 w-screen h-screen top-0 left-0"></div>
            </div>

            <div className="mt-2 mb-6">
                <BackButton />
            </div>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-0 mb-6">
                <div className="flex items-center">
                    <h1 className="text-white text-2xl">
                        {isNFT ? t('nft_details') : t('token_details')}
                    </h1>
                </div>
                {token && token.tokenid !== '0x00' && <div className="grow flex lg:justify-end">
                    <div className="flex gap-2">
                        <div className="flex justify-end cursor-pointer select-none">
                            <div onClick={toggleHideTokenModal} className="flex items-center gap-2 text-sm text-grey60 text-xs font-bold bg-contrast1 hover:bg-contrast2 w-fit rounded-full px-3.5 py-1.5 border border-contrast2 origin-center active:scale-[0.95] transition-all duration-100">
                                {isHidden ? t('show_token') : t('hide_token')}
                            </div>
                        </div>
                        <div className="flex justify-end cursor-pointer select-none">
                            <div onClick={toggleBurnModal} className="flex items-center gap-2 text-sm text-grey60 text-xs font-bold bg-contrast1 hover:bg-contrast2 w-fit rounded-full px-3.5 py-1.5 border border-contrast2 origin-center active:scale-[0.95] transition-all duration-100">
                                <svg
                                    width="12"
                                    height="15"
                                    viewBox="0 0 12 15"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M1.49935 8.99991C1.49935 9.7563 1.68956 10.4614 2.06997 11.1153C2.45025 11.7692 2.96358 12.297 3.60997 12.6987C3.54803 12.5812 3.50018 12.4569 3.46643 12.326C3.43282 12.1951 3.41602 12.0656 3.41602 11.9374C3.41602 11.6212 3.47615 11.3239 3.59643 11.0455C3.71657 10.7672 3.87331 10.5175 4.06664 10.2964L5.99935 8.08491L7.93997 10.2964C8.13345 10.5314 8.28893 10.788 8.40643 11.0664C8.52393 11.3447 8.58268 11.635 8.58268 11.9374C8.58268 12.0656 8.56588 12.1986 8.53227 12.3364C8.49852 12.4743 8.45067 12.602 8.38872 12.7195C9.03511 12.3595 9.54845 11.8456 9.92872 11.1778C10.3091 10.51 10.4993 9.78407 10.4993 8.99991C10.4993 8.29157 10.3778 7.59366 10.1348 6.90616C9.89171 6.21866 9.54102 5.58324 9.08268 4.99991C8.84657 5.15269 8.60004 5.27074 8.3431 5.35408C8.08615 5.43741 7.8049 5.47908 7.49935 5.47908C6.77185 5.47908 6.13379 5.25685 5.58518 4.81241C5.03657 4.36796 4.69546 3.78623 4.56185 3.0672C4.06185 3.52026 3.62435 3.98637 3.24935 4.46553C2.87435 4.9447 2.5549 5.43692 2.29102 5.9422C2.02713 6.44762 1.82921 6.95727 1.69727 7.47116C1.56532 7.98505 1.49935 8.49463 1.49935 8.99991ZM5.99935 9.74991L4.89518 10.9999C4.77018 11.1527 4.67296 11.3089 4.60352 11.4687C4.53407 11.6284 4.49935 11.8055 4.49935 11.9999C4.49935 12.4166 4.64518 12.7707 4.93685 13.0624C5.22852 13.3541 5.58268 13.4999 5.99935 13.4999C6.41602 13.4999 6.77018 13.3541 7.06185 13.0624C7.35352 12.7707 7.49935 12.4166 7.49935 11.9999C7.49935 11.8055 7.46463 11.6249 7.39518 11.4582C7.32574 11.2916 7.22852 11.1388 7.10352 10.9999L5.99935 9.74991ZM5.58268 0.745117V2.47908C5.58268 3.01324 5.76858 3.46623 6.14039 3.83803C6.5122 4.20984 6.96518 4.39574 7.49935 4.39574C7.74074 4.39574 7.97018 4.35116 8.18768 4.26199C8.40504 4.17283 8.59657 4.04859 8.76227 3.88928L9.08747 3.56095C9.82678 4.06734 10.4275 4.82748 10.8896 5.84137C11.3516 6.85526 11.5827 7.9081 11.5827 8.99991C11.5827 10.5491 11.0394 11.8669 9.95289 12.9535C8.86636 14.04 7.54852 14.5832 5.99935 14.5832C4.45018 14.5832 3.13234 14.04 2.04581 12.9535C0.95928 11.8669 0.416016 10.5491 0.416016 8.99991C0.416016 7.62602 0.867683 6.20533 1.77102 4.73782C2.67435 3.27046 3.9449 1.93956 5.58268 0.745117Z"
                                        fill="white"
                                    />
                                </svg>
                                {t('burn_token')}
                            </div>
                        </div>
                    </div>
                </div>}
            </div>

            {!token && (
                <div className="mb-10">
                    <InfoBox title={t('token_could_not_be_found')} />
                </div>
            )}

            {token && (
                <div className="mb-14">
                    <ul className="select-none flex flex-col gap-2">
                        <li className="bg-contrast1 relative w-full flex items-center p-5 rounded mb-6">
                            <div className="grow flex">
                                <TokenIcon token={token.token} tokenId={token.tokenid} />
                                <div className="grow flex items-center overflow-hidden px-5">
                                    <div className="grow items-center w-full">
                                        <div className="flex items-center grow gap-1">
                                            <h6 className="text-lg font-bold truncate">
                                                {renderTokenName(token)}
                                            </h6>
                                            <TokenAuthenticity token={token} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div onClick={goToSendWithToken} className="pr-2 transition-all duration-200 text-white hover:text-grey80 cursor-pointer">
                                <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.01953 15.2308C4.29253 14.7423 2.94411 13.8153 1.97428 12.45C1.00445 11.0847 0.519531 9.60133 0.519531 8C0.519531 6.39867 1.00445 4.91533 1.97428 3.55C2.94411 2.18467 4.29253 1.25775 6.01953 0.76925V2.35C4.8362 2.75 3.8737 3.46667 3.13203 4.5C2.39036 5.53333 2.01953 6.7 2.01953 8C2.01953 9.3 2.39036 10.4667 3.13203 11.5C3.8737 12.5333 4.8362 13.25 6.01953 13.65V15.2308ZM14.0195 15.5C11.9375 15.5 10.167 14.7705 8.70803 13.3115C7.24903 11.8525 6.51953 10.082 6.51953 8C6.51953 5.918 7.24903 4.1475 8.70803 2.6885C10.167 1.2295 11.9375 0.5 14.0195 0.5C15.0234 0.5 15.9718 0.685917 16.8648 1.05775C17.7576 1.42958 18.5483 1.94692 19.2368 2.60975L18.183 3.6635C17.6394 3.13917 17.0147 2.73083 16.309 2.4385C15.6032 2.14617 14.84 2 14.0195 2C12.3529 2 10.9362 2.58333 9.76953 3.75C8.60286 4.91667 8.01953 6.33333 8.01953 8C8.01953 9.66667 8.60286 11.0833 9.76953 12.25C10.9362 13.4167 12.3529 14 14.0195 14C14.84 14 15.6032 13.8538 16.309 13.5615C17.0147 13.2692 17.6394 12.8608 18.183 12.3365L19.2368 13.3903C18.5483 14.0531 17.7576 14.5704 16.8648 14.9423C15.9718 15.3141 15.0234 15.5 14.0195 15.5ZM19.8273 11.6538L18.7733 10.6L20.6233 8.75H13.0773V7.25H20.6233L18.7733 5.4L19.8273 4.34625L23.481 8L19.8273 11.6538Z" fill="currentColor" />
                                </svg>
                            </div>
                        </li>
                        {isCustomToken && (
                            <>
                                {
                                    typeof token.token === 'object' && (token.token as any).url && (token.token as any).url.includes("http") && (
                                        <InfoBox
                                            title={t('url')}
                                            copy={!!(typeof token.token === 'object' && (token.token as any).url)}
                                            linkValue={!!(typeof token.token === 'object' && (token.token as any).url)}
                                            value={typeof token.token === 'object' && (token.token as any).url || t('n_a')}
                                        />
                                    )
                                }
                            </>
                        )}
                        <InfoBox title={t('token_id')} value={token.tokenid} copy />
                        {token && token.tokenid !== '0x00' && (
                            <InfoBox
                                title={t('description')}
                                value={typeof token.token === 'object' && token.token.description || t('no_description')}
                            />
                        )}
                        {token && token.tokenid === '0x00' && (
                            <InfoBox
                                title={t('description')}
                                value={t('this_is_the_official_minima_token')}
                            />
                        )}
                        <InfoBox title={t('sendable')} value={f(token.sendable)} />
                        <InfoBox title={t('confirmed')} value={f(token.confirmed)} />
                        <InfoBox title={t('unconfirmed')} value={f(token.unconfirmed)} />
                        <InfoBox title={t('total_minted')} value={f(token.total)} />
                        <InfoBox title={t('total_coins')} value={f(token.coins)} />
                        {isCustomToken && (
                            <>
                                <InfoBox
                                    copy={!!(typeof token.token === 'object' && token.token.webvalidate)}
                                    title={t('web_validation_url')}
                                    linkValue={!!(typeof token.token === 'object' && token.token.webvalidate)}
                                    value={typeof token.token === 'object' && token.token.webvalidate || t('n_a')}
                                />
                                <InfoBox
                                    copy={!!(typeof token.token === 'object' && (token.token as any).external_url)}
                                    title={t('external_url')}
                                    linkValue={!!(typeof token.token === 'object' && (token.token as any).external_url)}
                                    value={typeof token.token === 'object' && (token.token as any).external_url || t('n_a')}
                                />
                                <InfoBox
                                    title={t('owner')}
                                    value={typeof token.token === 'object' && (token.token as any).owner || t('n_a')}
                                />
                                {metadata.length > 0 && metadata.map((item) => {
                                    if (item.value && typeof item.value === 'object' && Array.isArray(item.value)) {
                                        return renderArray(item.key, item.value);
                                    }

                                    if (item.value && typeof item.value === 'object') {
                                        return renderObject(item.key, item.value);
                                    }

                                    return (
                                        <InfoBox key={item.key} title={item.key} value={item.value || "N/A"} className="capitalize" />
                                    )
                                })}
                            </>
                        )}
                    </ul>
                </div>
            )}
        </div>
    )
}

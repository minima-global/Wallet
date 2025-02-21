import { useContext, useEffect, useState } from 'react'
import { createFileRoute, useLocation, useNavigate } from '@tanstack/react-router'
import Input from '../../components/Input'
import useTranslation from '../../hooks/useTranslation'
import { appContext } from '../../AppContext'
import { renderTokenName } from '../../utils'
import TokenAuthenticity from '../../components/TokenAuthenticity'
import TokenIcon from '../../components/TokenIcon'
import InfoBox from '../../components/InfoBox'
import Button from '../../components/Button'
import { MDS } from '@minima-global/mds'
import Decimal from 'decimal.js'
import OverlayMenu from '../../components/OverlayModal'
import useFormatAmount from '../../hooks/useFormatAmount'
import useSlice from '../../components/Truncate/useSlice'
import { z } from 'zod'
export const Route = createFileRoute('/send/')({
    component: Index,
    validateSearch: z.object({
        tokenid: z.string().optional()
    })
})

function Index() {
    const { t } = useTranslation()
    const location = useLocation();
    const { s, m } = useSlice();
    const { f } = useFormatAmount();
    const navigate = useNavigate();

    const { balance, setIsPending, setIsSuccess, setIsError } = useContext(appContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [step, setStep] = useState<number>(1);
    const [selectedTokenId, setSelectedTokenId] = useState<string>('0x00')
    const selectedToken = balance.find(
        (token) => token.tokenid === selectedTokenId,
    );
    const sendableMinima = balance.find(
        (token) => token.tokenid === '0x00',
    );

    useEffect(() => {
        if (location.search.tokenid) {
            setSelectedTokenId(location.search.tokenid);
        }
    }, [location.search]);

    const [amount, setAmount] = useState<string>('')
    const [recipient, setRecipient] = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const [burn, setBurn] = useState<string>('')

    const goToStep1 = () => {
        setStep(1)
    }

    const goToStep2 = () => {
        setStep(2)
    }

    const send = async () => {
        setIsLoading(true);

        const response = await MDS.cmd.send({
            params: {
                tokenid: selectedTokenId,
                amount: amount,
                address: recipient,
                burn: burn || undefined,
                state: message
                    ? `{"44":"[${message}]"}`
                    : undefined
            }
        });

        setTimeout(() => {
            setIsLoading(false);
        }, 750);

        if (response.pending) {
            return setIsPending({
                uid: response.pendinguid as string,
                callback: () => {
                    navigate({ to: '/' })
                }
            })
        }

        if (response.status) {
            return setIsSuccess(true)
        }

        return setIsError({ display: true, message: response.error || "An unknown error occurred, please try again later." });
    }

    const isMaxAmount = (value: string) => {
        try {
            if (value === '0') {
                return false;
            }

            if (!/^[0-9.]*$/.test(value)) {
                return false;
            }

            return new Decimal(value).lte(new Decimal(selectedToken?.sendable || '0'));
        } catch (error) {
            return false;
        }
    }

    const hasSendableMinima = () => {
        try {
            return new Decimal(burn).lte(new Decimal(sendableMinima?.sendable || '0'));
        } catch (error) {
            return false;
        }
    }

    const selectToken = (tokenId: string) => {
        setSelectedTokenId(tokenId);
        setAmount('');
    }

    const isDisabled = () => {
        if (!recipient.match(/^(0x|Mx)[0-9a-zA-Z]*$/gmi)) {
            return true;
        }

        if (!isMaxAmount(amount)) {
            return true;
        }

        if (burn && !hasSendableMinima()) {
            return true;
        }

        return false;
    };

    return (
        <div className="mb-20">
            {step === 1 && (
                <div className="grow flex flex-col">
                    <h1 className="text-white text-2xl mb-6">{t('send')}</h1>

                    <TokenDropdown value={selectedTokenId} onChange={selectToken} />

                    <div className="mt-5 mb-8 flex flex-col gap-6">
                        <Input
                            label={t('amount')}
                            placeholder={t('enter_amount')}
                            value={amount}
                            onChange={(value) => setAmount(value)}
                            validation={isMaxAmount}
                            validationMessage={t('please_enter_a_valid_amount')}
                            max={selectedToken?.sendable}
                        />
                        <Input
                            label={t('recipient_address')}
                            placeholder={t('enter_recipient_address')}
                            value={recipient}
                            onChange={(value) => setRecipient(value)}
                            validation="^(0x|Mx|0X|MX)[0-9a-zA-Z]*$"
                            validationMessage={t('please_enter_a_valid_address')}
                        />
                        <Input
                            label={t('message')}
                            optionalLabel={t('optional')}
                            placeholder={t('enter_message')}
                            value={message}
                            onChange={(value) => setMessage(value)}
                        />
                        <Input
                            label={t('add_a_burn')}
                            optionalLabel={t('optional')}
                            placeholder={t('optional')}
                            value={burn}
                            onChange={(value) => setBurn(value)}
                            validation={hasSendableMinima}
                            validationMessage={t('please_enter_a_valid_amount')}
                        />
                    </div>

                    <Button disabled={isDisabled()} onClick={goToStep2}>{t('review')}</Button>
                </div>
            )}
            {step === 2 && selectedToken && (
                <div className="grow flex flex-col">
                    <h1 className="text-white text-2xl mb-6">{t('confirmation')}</h1>

                    <div className="flex flex-col gap-2 mb-8">

                        <div className="bg-contrast1 relative w-full flex items-center p-5 rounded">
                            <div className="grow flex">
                                <TokenIcon token={selectedToken.token} tokenId={selectedToken.tokenid} />
                                <div className="grow flex items-center overflow-hidden px-4">
                                    <div className="grow items-center w-full">
                                        <div className="flex items-center grow gap-1.5">
                                            <h6 className="text-lg font-bold truncate text-neutral-400">
                                                {renderTokenName(selectedToken)}
                                            </h6>
                                            <TokenAuthenticity token={selectedToken} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <InfoBox title={t('amount')} value={(<><span className="block sm:hidden">{m(f(amount), 34)}</span><span className="hidden sm:block">{f(amount)}</span></>)} />
                        <InfoBox title={t('recipient_address')} value={<><span className="block sm:hidden">{s(recipient, { start: 16, end: 8 })}</span><span className="hidden sm:block">{recipient}</span></>} />
                        <InfoBox title={t('message')} value={message || 'N/A'} />
                        <InfoBox title={t('burn')} value={burn || 'N/A'} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Button isLoading={isLoading} disabled={isDisabled()} onClick={send}>{t('send')}</Button>
                        <Button onClick={goToStep1} variant="secondary">{t('cancel')}</Button>
                    </div>
                </div>
            )}
        </div>
    )
}

type TokenDropdownProps = {
    value: any
    onChange: (value: string) => void
}

const TokenDropdown = ({ value, onChange }: TokenDropdownProps) => {
    const { t } = useTranslation();
    const { balance } = useContext(appContext);
    const { f } = useFormatAmount();
    const { m } = useSlice();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const selectedToken = balance.find(
        (token) => token.tokenid === value,
    );

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    }

    const selectToken = (tokenId: string) => {
        onChange(tokenId)
        toggleDropdown()
    }

    return (
        <div>
            <OverlayMenu display={isOpen} dismiss={toggleDropdown}>
                <div>
                    <h5 className="mb-5 text-lg text-grey80 text-left">
                        {t('select_token')}
                    </h5>
                    <div className="bg-contrast1.5 rounded-lg p-3 mb-5">
                        <div className="custom-scrollbar custom-scrollbar-modal pr-3 overflow-x-hidden max-h-[300px] overflow-y-auto pr-3">
                            {balance.map((token, index) => (
                                <div key={token.tokenid}>
                                    <div onClick={() => selectToken(token.tokenid)} className="p-2.5 rounded cursor-pointer hover:bg-contrast flex">
                                        <TokenIcon token={token.token} tokenId={token.tokenid} />
                                        <div className="my-auto px-4 text-[14px]">
                                            <div className="font-bold text-neutral-100 -mt-1 mb-0.5 flex items-center gap-1">
                                                {renderTokenName(token)}
                                                <TokenAuthenticity token={token} />
                                            </div>
                                            <div className="truncate text-grey80 font-bold text-left">
                                               <span className="block sm:hidden">{m(f(token.sendable), 18)}</span>
                                               <span className="hidden sm:block">{f(token.sendable)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {index !== balance.length - 1 && <div className="h-[1px] bg-contrast3 w-full"></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-3 mb-4">
                    <Button variant="secondary" onClick={toggleDropdown}>{t('close')}</Button>
                </div>
            </OverlayMenu>
            {selectedToken && (
                <div onClick={toggleDropdown} className="relative z-[20] bg-darkContrast relative w-full flex p-3 border-lightDarkContrast rounded cursor-pointer select-none">
                    <div className="relative z-[20] flex w-full">
                        <TokenIcon token={selectedToken.token} tokenId={selectedToken.tokenid} />
                        <div className="w-full my-auto px-4">
                            <div className="font-bold text-neutral-100 -mt-0.5 mb-0.5 flex items-center gap-1">
                                {renderTokenName(selectedToken)}
                                <TokenAuthenticity token={selectedToken} />
                            </div>
                            <div className="text-sm truncate text-grey80 font-bold">
                                <span className="block sm:hidden">{m(f(selectedToken.sendable), 24)}</span>
                                <span className="hidden sm:block">{f(selectedToken.sendable)}</span>
                            </div>
                        </div>
                        <span className="flex absolute top-0 right-2 h-full items-center">
                            <div className={`px-2 py-2 transition-all duration-300 ${isOpen ? 'text-orange -rotate-180' : 'text-grey hover:text-white'}`}>
                                <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 6.0625L0 1.0625L1.0625 0L5 3.9375L8.9375 0L10 1.0625L5 6.0625Z" fill="currentColor" />
                                </svg>
                            </div>
                        </span>
                    </div>
                    <div className={`hidden lg:block absolute left-0 top-[100%] border border-contrast2 bg-contrast1.5 p-2 z-[20] w-full custom-scrollbar ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <div className="custom-scrollbar max-h-[300px] overflow-y-auto pr-3">
                            {balance.map((token, index) => (
                                <div key={token.tokenid}>
                                    <div onClick={() => onChange(token.tokenid)} className="p-2.5 rounded cursor-pointer hover:bg-contrast2 flex">
                                        <TokenIcon token={token.token} tokenId={token.tokenid} />
                                        <div className="my-auto px-4 text-[14px]">
                                            <div className="font-bold text-neutral-100 -mt-1 mb-0.5 flex items-center gap-1">
                                                {renderTokenName(token)}
                                                <TokenAuthenticity token={token} />
                                            </div>
                                            <div className="truncate text-grey80 font-bold">
                                                {token.sendable}
                                            </div>
                                        </div>
                                    </div>
                                    {index !== balance.length - 1 && <div className="h-[1px] bg-contrast3 w-full"></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className={`absolute top-0 left-0 w-full h-full bg-black z-[20] lg:z-[10] ${isOpen ? 'opacity-80' : 'opacity-0 pointer-events-none'}`}></div>
        </div>
    )
}

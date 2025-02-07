import { useContext, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import Header from '../../components/Header'
import Navigation from '../../components/Navigation'
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

export const Route = createFileRoute('/send/')({
    component: Index,
})

function Index() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { balance, setIsPending, setIsSuccess } = useContext(appContext);
    const [step, setStep] = useState<number>(1);
    const [selectedTokenId, setSelectedTokenId] = useState<string>('0x00')
    const selectedToken = balance.find(
        (token) => token.tokenid === selectedTokenId,
    );
    const sendableMinima = balance.find(
        (token) => token.tokenid === '0x00',
    );

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
        const response = await MDS.cmd.send({
            params: {
                tokenid: selectedTokenId,
                amount: amount,
                address: recipient,
                burn: burn || undefined,
                state: message
                    ? JSON.stringify({
                        44: message,
                    })
                    : undefined
            }
        })

        if (response.pending) {
            setIsPending({
                uid: response.pendinguid as string,
                callback: () => {
                    navigate({ to: '/' })
                }
            })
        }

        if (response.status) {
            setIsSuccess(true)
        }
    }

    const isMaxAmount = (value: string) => {
        try {
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

    const isDisabled = () => {
        if (!recipient.match(/^(0x|Mx)[0-9a-zA-Z]*$/)) {
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
        <>
            <Header />
            <div className="mt-10 container mx-auto flex">
                <div className="flex w-full gap-10">
                    <div className="flex flex-col gap-5">
                        <Navigation />
                    </div>
                    {step === 1 && (
                        <div className="grow flex flex-col">
                            <h1 className="text-white text-2xl mb-6">{t('send')}</h1>

                            <TokenDropdown value={selectedTokenId} onChange={setSelectedTokenId} />

                            <div className="mt-5 mb-8 flex flex-col gap-6">
                                <Input
                                    label={t('amount')}
                                    placeholder={t('enter_amount')}
                                    value={amount}
                                    onChange={(value) => setAmount(value)}
                                    validation={isMaxAmount}
                                    validationMessage={t('please_enter_a_valid_amount')}
                                />
                                <Input
                                    label={t('recipient_address')}
                                    placeholder={t('enter_recipient_address')}
                                    value={recipient}
                                    onChange={(value) => setRecipient(value)}
                                    validation="^(0x|Mx)[0-9a-zA-Z]*$"
                                    validationMessage={t('please_enter_a_valid_address')}
                                />
                                <Input
                                    label={t('message')}
                                    placeholder={t('enter_message')}
                                    value={message}
                                    onChange={(value) => setMessage(value)}
                                />
                                <Input
                                    label={t('add_a_burn') + ` (${t('optional')})`}
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
                            <div className="grow flex flex-col">
                                <h1 className="text-white text-2xl mb-8">{t('confirmation')}</h1>

                                <div className="flex flex-col gap-2 mb-8">

                                    <div className="cursor-pointer bg-grey10 dark:bg-darkContrast relative w-full flex items-center p-5 rounded">
                                        <div className="grow flex">
                                            <TokenIcon token={selectedToken.token} tokenId={selectedToken.tokenid} />
                                            <div className="grow flex items-center overflow-hidden px-4">
                                                <div className="grow items-center w-full">
                                                    <div className="flex items-center grow">
                                                        <h6 className="text-lg font-bold truncate text-black dark:text-neutral-400">
                                                            {renderTokenName(selectedToken)}
                                                        </h6>
                                                        <TokenAuthenticity token={selectedToken} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <InfoBox title={t('amount')} value={`${amount}`} />
                                    <InfoBox title={t('recipient_address')} value={recipient} />
                                    <InfoBox title={t('message')} value={message || 'N/A'} />
                                    <InfoBox title={t('burn')} value={burn || 'N/A'} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Button disabled={isDisabled()} onClick={send}>{t('send')}</Button>
                                    <Button onClick={goToStep1} secondary>{t('cancel')}</Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

type TokenDropdownProps = {
    value: any
    onChange: (value: string) => void
}

const TokenDropdown = ({ value, onChange }: TokenDropdownProps) => {
    const { balance } = useContext(appContext);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const selectedToken = balance.find(
        (token) => token.tokenid === value,
    );

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div>
            {selectedToken && (
                <div onClick={toggleDropdown} className="relative z-[20] bg-grey10 dark:bg-darkContrast relative w-full flex p-3 dark:border-lightDarkContrast rounded cursor-pointer select-none">
                    <TokenIcon token={selectedToken.token} tokenId={selectedToken.tokenid} />
                    <div className="my-auto px-4">
                        <div className="font-bold dark:text-neutral-100 -mt-0.5 mb-0.5 flex items-center gap-1">
                            {renderTokenName(selectedToken)}
                            <TokenAuthenticity token={selectedToken} />
                        </div>
                        <div className="text-sm truncate text-grey80 font-bold">
                            {selectedToken?.sendable}
                        </div>
                    </div>
                    <span className="absolute top-0 right-4 h-full flex items-center">
                        <div className={`px-2 py-2 transition-all duration-300 ${isOpen ? 'text-orange' : 'text-grey hover:text-white -rotate-90'}`}>
                            <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 6.0625L0 1.0625L1.0625 0L5 3.9375L8.9375 0L10 1.0625L5 6.0625Z" fill="currentColor" />
                            </svg>
                        </div>
                    </span>
                    <div className={`absolute left-0 top-[100%] border border-contrast2 bg-contrast1.5 p-2 z-[20] w-full custom-scrollbar ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
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

            <div className={`absolute top-0 left-0 w-full h-full bg-black z-[10] ${isOpen ? 'opacity-80' : 'opacity-0 pointer-events-none'}`}></div>
        </div>
    )
}

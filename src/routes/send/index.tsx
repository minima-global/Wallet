import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import Header from '../../components/Header'
import Send from '../../components/Button'
import Navigation from '../../components/Navigation'
import Input from '../../components/Input'
import useTranslation from '../../hooks/useTranslation';
export const Route = createFileRoute('/send/')({
    component: Index,
})

function Index() {
    const { t } = useTranslation();
    const [step, setStep] = useState<number>(1);

    const [amount, setAmount] = useState<string>('');
    const [recipient, setRecipient] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [burn, setBurn] = useState<string>('');

    return (
        <>
            <Header />
            <div className="mt-10 container mx-auto flex">
                <div className="flex w-full gap-10">
                    <div className="flex flex-col gap-5">
                        <Navigation />
                    </div>
                    <div className="grow flex flex-col">
                        <h1 className="text-white text-2xl mb-6">
                            {t("send")}
                        </h1>
                        <div className="bg-grey10 dark:bg-darkContrast relative w-full flex p-3 border border-grey40 dark:border-lightDarkContrast rounded"><div className="w-[48px] h-[48px] border border-grey80 rounded overflow-hidden"><svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" fill="white"></rect><path d="M32.4428 16.759L31.2053 22.2329L29.6226 15.6286L24.0773 13.3795L22.578 19.9957L21.2571 12.2371L15.7119 10L10 35.2512H16.0569L17.8062 27.4926L19.1271 35.2512H25.1959L26.6834 28.6349L28.266 35.2512H34.323L38 18.9962L32.4428 16.759Z" fill="black"></path></svg></div><div className="my-auto px-4"><p className="font-bold dark:text-neutral-100 -mt-0.5">Minima</p><p className="text-sm truncate dark:text-neutral-200">0.000187</p></div><span className="absolute top-0 right-6 h-full flex items-center"><svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-black dark:text-grey"><path d="M4.00001 3.71113L0.496887 0.208008H7.50314L4.00001 3.71113Z" fill="currentColor"></path></svg></span></div>

                        <div className="mt-5 mb-8 flex flex-col gap-6">
                            <Input 
                                label={t("amount")} 
                                placeholder={t("enter_amount")} 
                                value={amount} 
                                onChange={(value) => setAmount(value)} 
                            />
                            <Input 
                                label={t("recipient_address")} 
                                placeholder={t("enter_recipient_address")} 
                                value={recipient} 
                                onChange={(value) => setRecipient(value)} 
                            />
                            <Input 
                                label={t("message")} 
                                placeholder={t("enter_message")} 
                                value={message} 
                                onChange={(value) => setMessage(value)} 
                            />
                            <Input 
                                label={t("add_a_burn_address") + ` (${t("optional")})`} 
                                placeholder={t("optional")} 
                                value={burn} 
                                onChange={(value) => setBurn(value)} 
                            />
                        </div>

                        <Send>{t("review")}</Send>
                    </div>
                </div>
            </div>
        </>
    )
}

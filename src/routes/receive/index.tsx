import { createFileRoute } from '@tanstack/react-router'
import Tabs from '../../components/Tabs'
import { useContext, useState } from 'react';
import QRCode from 'react-qr-code';
import { CheckAddress, MDS } from '@minima-global/mds';
import Button from '../../components/Button';
import BackButton from '../../components/BackButton';
import InfoBox from '../../components/InfoBox';
import Input from '../../components/Input';
import useTranslation from '../../hooks/useTranslation';
import { appContext } from '../../AppContext';
import SearchBar from '../../components/SearchBar';
import useSlice from '../../components/Truncate/useSlice';

export const Route = createFileRoute('/receive/')({
  component: Index,
});

const YOUR_ADDRESS = 'YOUR_ADDRESS';
const VALIDATE_ADDRESS = 'VALIDATE_ADDRESS';

function Index() {
  const { t } = useTranslation();
  const { s } = useSlice();
  const { address, addresses } = useContext(appContext);
  const [activeTab, setActiveTab] = useState(YOUR_ADDRESS);
  const [error, setError] = useState<boolean>(false);
  const [result, setResult] = useState<CheckAddress | null>(null);
  const [query, setQuery] = useState('');
  const [filterAddressQuery, setFilterAddressQuery] = useState('');
  const [showAltAddresses, setShowAltAddresses] = useState(false);

  const TABS = [
    {
      key: YOUR_ADDRESS,
      title: t("your_address"),
      href: '/receive',
    },
    {
      key: VALIDATE_ADDRESS,
      title: t("validate"),
      href: '/receive/validate',
    },
  ]

  const validateFetchedAddress = () => {
    validateAddress(address);
  }

  const validateAddress = async (address: string) => {
    try {
      const results = await MDS.cmd.checkaddress({
        params: {
          address: address,
        },
      });
      if (results.error) {
        return setError(true);
      }

      setError(false);
      setResult(results.response);
    } catch (error) {
      setError(true);
    }
  }

  const dismissResults = () => {
    setResult(null);
    setQuery('');
  }

  const toggleAltAddresses = () => {
    setShowAltAddresses(!showAltAddresses);
  }

  if (result) {
    return (
      <div className="mb-12">
        <div className="mb-6">
          <BackButton onClick={dismissResults} />
        </div>
        <h1 className="text-white text-2xl mb-6">{t("validation_report")}</h1>
        <div className="text-white text-sm mb-6 bg-contrast1 p-3 px-4 border-l-4 border-l-green rounded">
          {t("this_address_is_safe_for_use")}
        </div>
        <div className="grid grid-cols-12 text-grey60 mb-6 gap-2 md:gap-4">
          <div className="col-span-12 md:col-span-4 bg-contrast1 pt-3 pb-4 px-4 rounded text-center">
            <div className="text-base md:text-lg mb-2">
              Valid address
            </div>
            <svg className="mx-auto w-[32px] h-[32px]" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="mask0_7856_39219" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                <rect width="24" height="24" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_7856_39219)">
                <path d="M9.4501 17.8496L3.8501 12.2496L4.9251 11.1746L9.4501 15.6996L19.0501 6.09961L20.1251 7.17461L9.4501 17.8496Z" fill="#00CBB6" />
              </g>
            </svg>
          </div>
          <div className="col-span-12 md:col-span-4 bg-contrast1 pt-3 pb-4 px-4 rounded text-center">
            <div className="text-base md:text-lg mb-2">
              {t("belongs_to_this_node")}
            </div>
            {result.relevant && (
              <svg className="mx-auto w-[32px] h-[32px]" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_7856_39219" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                  <rect width="24" height="24" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_7856_39219)">
                  <path d="M9.4501 17.8496L3.8501 12.2496L4.9251 11.1746L9.4501 15.6996L19.0501 6.09961L20.1251 7.17461L9.4501 17.8496Z" fill="#00CBB6" />
                </g>
              </svg>
            )}
            {!result.relevant && (
              <svg className="mx-auto w-[32px] h-[32px]" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_7856_39243" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                  <rect width="24" height="24" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_7856_39243)">
                  <path d="M6.2248 18.8248L5.1748 17.7748L10.9498 11.9998L5.1748 6.2248L6.2248 5.1748L11.9998 10.9498L17.7748 5.1748L18.8248 6.2248L13.0498 11.9998L18.8248 17.7748L17.7748 18.8248L11.9998 13.0498L6.2248 18.8248Z" fill="#F5455C" />
                </g>
              </svg>
            )}
          </div>
          <div className="col-span-12 md:col-span-4 bg-contrast1 pt-3 pb-4 px-4 rounded text-center">
            <div className="text-base md:text-lg mb-2">
              {t("simple_address")}
            </div>
            {result.simple && (
              <svg className="mx-auto w-[32px] h-[32px]" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_7856_39219" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                  <rect width="24" height="24" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_7856_39219)">
                  <path d="M9.4501 17.8496L3.8501 12.2496L4.9251 11.1746L9.4501 15.6996L19.0501 6.09961L20.1251 7.17461L9.4501 17.8496Z" fill="#00CBB6" />
                </g>
              </svg>
            )}
            {!result.simple && (
              <svg className="mx-auto w-[32px] h-[32px]" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_7856_39243" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                  <rect width="24" height="24" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_7856_39243)">
                  <path d="M6.2248 18.8248L5.1748 17.7748L10.9498 11.9998L5.1748 6.2248L6.2248 5.1748L11.9998 10.9498L17.7748 5.1748L18.8248 6.2248L13.0498 11.9998L18.8248 17.7748L17.7748 18.8248L11.9998 13.0498L6.2248 18.8248Z" fill="#F5455C" />
                </g>
              </svg>
            )}
          </div>
        </div>
        <div className="flex-col gap-2 flex lg:hidden">
          <InfoBox title={t("validated")} value={s(address)} />
          <InfoBox title={t("0x_address")} value={s(result['0x'])} copy />
          <InfoBox title={t("mx_address")} value={s(result['Mx'])} copy />
        </div>
        <div className="flex-col gap-2 hidden md:flex-row">
          <InfoBox title={t("validating")} value={address} />
          <InfoBox title={t("0x_address")} value={result['0x']} copy />
          <InfoBox title={t("mx_address")} value={result['Mx']} copy />
        </div>
      </div>
    )
  }

  return (
    <div className="grow flex flex-col mb-12">
      <h1 className="text-white text-2xl mb-6">{t("receive")}</h1>
      <div className="mb-6">
        <Tabs activeKey={activeTab} onClick={setActiveTab} tabs={TABS} />
      </div>
      {activeTab === YOUR_ADDRESS && (
        <div className="mt-2 mb-6 flex flex-col gap-4">
          <div className="bg-contrast1 p-6 lg:p-8 rounded-lg">
            <div className="block bg-white w-full h-full md:w-[240px] md:h-[240px] mb-4 md:my-0 mx-auto">
              <QRCode value={address} className="p-4 w-full h-full" />
            </div>

            <div className="mb-4">
              <div className="block md:hidden">
                <Input
                  value={s(address)}
                  label={t("address_name")}
                  inverse
                  readOnly
                  copy
                  copyValueOverride={address}
                />
              </div>
              <div className="hidden md:block">
                <Input
                  value={address}
                  label={t("address_name")}
                  inverse
                  readOnly
                  copy
                />
              </div>
            </div>

            <Button onClick={validateFetchedAddress}>
              {t("validate")}
            </Button>
          </div>
          <div className="bg-contrast1 rounded-lg">
            <div onClick={toggleAltAddresses} className="pt-6 lg:pt-8 px-8 cursor-pointer grid grid-cols-12">
              <div className="col-span-10 flex items-center">
                <div className="text-grey20">
                  {t("your_alternative_addresses")}
                </div>
              </div>
              <div className="col-span-2 flex items-center justify-end">
                <svg className={`-ml-2 fill-[#91919D] hover:fill-white transition-all transition-100 ${showAltAddresses ? 'rotate-90' : ''}`} width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.875 5L0.9375 1.0625L2 0L7 5L2 10L0.9375 8.9375L4.875 5Z" fill="#currentColor"></path></svg>                </div>
            </div>
            <div className={`flex flex-col gap-2 p-6 md:p-8 pt-0 ${showAltAddresses ? 'mt-4 md:mt-6 opacity-100' : 'h-0 opacity-0'}`}>
              <div className="md:mt-1 mb-4">
                <SearchBar placeholder="Enter an address" value={filterAddressQuery} onChange={(value) => setFilterAddressQuery(value)} className="!bg-black" />
              </div>
              <div className="custom-scrollbar overflow-y-auto max-h-[300px] pr-4 flex flex-col gap-2">
                {addresses
                  .filter((address) => address.toLowerCase().includes(filterAddressQuery.toLowerCase()))
                  .length === 0 && (
                    <div className="bg-contrast2/50 rounded-lg text-white text-sm px-4 py-4">
                      <div>No matching addresses could be found</div>
                    </div>
                  )}
                {addresses
                  .filter((address) => address.toLowerCase().includes(filterAddressQuery.toLowerCase()))
                  .map((address) => <AddressRow key={address} address={address} />)}
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === VALIDATE_ADDRESS && (
        <div className="mt-2 mb-6 flex flex-col gap-4">
          {error && (
            <div className="text-white text-sm mb-2 bg-contrast1 p-3 px-4 border-l-4 border-l-red rounded">
              {t("this_address_is_not_safe")}.
            </div>
          )}
          <div className="bg-contrast1 p-6 lg:p-8 rounded-lg flex flex-col gap-4">
            <Input
              value={query}
              label={t("validate_an_address")}
              onChange={(value) => setQuery(value)}
              placeholder={t("enter_an_0x_or_mx_address")}
              validation="^(0x|Mx)[0-9a-zA-Z]*$"
              validationMessage="The address should start with 0x or Mx."
              inverse
              clearable
            />
            <Button disabled={!/^(0x|Mx)[0-9a-zA-Z]*$/.test(query)} onClick={() => validateAddress(query)}>{t("validate")}</Button>
          </div>
        </div>
      )}
    </div>
  )
}

export const AddressRow = ({ address }: { address: string }) => {
  const { s } = useSlice();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    setCopied(true);

    navigator.clipboard.writeText(address);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <div key={address} className="rounded-lg bg-contrast2/50 p-3 relative">
      <div key={address}>
        <div className="text-sm block md:hidden">{s(address)}</div>
        <div className="hidden md:block">{address}</div>
        <div onClick={copyToClipboard} className="text-sm text-grey60 absolute top-0 right-3 flex h-full items-center z-10">
          <div>
            {!copied && (
              <svg className="h-4 w-4 cursor-pointer stroke-grey hover:stroke-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            )}
            {copied && (
              <svg className="w-4 h-4" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.58075 14.2538L15.3038 7.53075L14.25 6.47693L8.58075 12.1462L5.73075 9.29615L4.67693 10.35L8.58075 14.2538ZM10.0016 19.5C8.68772 19.5 7.45268 19.2506 6.29655 18.752C5.1404 18.2533 4.13472 17.5765 3.2795 16.7217C2.42427 15.8669 1.74721 14.8616 1.24833 13.706C0.749442 12.5504 0.5 11.3156 0.5 10.0017C0.5 8.68772 0.749334 7.45268 1.248 6.29655C1.74667 5.1404 2.42342 4.13472 3.27825 3.2795C4.1331 2.42427 5.13834 1.74721 6.29398 1.24833C7.44959 0.749442 8.68437 0.5 9.9983 0.5C11.3122 0.5 12.5473 0.749333 13.7034 1.248C14.8596 1.74667 15.8652 2.42342 16.7205 3.27825C17.5757 4.1331 18.2527 5.13834 18.7516 6.29398C19.2505 7.44959 19.5 8.68437 19.5 9.9983C19.5 11.3122 19.2506 12.5473 18.752 13.7034C18.2533 14.8596 17.5765 15.8652 16.7217 16.7205C15.8669 17.5757 14.8616 18.2527 13.706 18.7516C12.5504 19.2505 11.3156 19.5 10.0016 19.5Z" fill="#4FE3C1"></path></svg>
            )}
          </div>
        </div>
      </div>
    </div>
  )
};


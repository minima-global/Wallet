import { createFileRoute } from '@tanstack/react-router'
import Tabs from '../../components/Tabs'
import { useContext, useState, useEffect } from 'react';
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
  const { address, addresses, setAddress, addressNames, fullAddresses } = useContext(appContext);
  const [activeTab, setActiveTab] = useState(YOUR_ADDRESS);
  const [error, setError] = useState<boolean>(false);
  const [result, setResult] = useState<CheckAddress | null>(null);
  const [query, setQuery] = useState('');
  const [filterAddressQuery, setFilterAddressQuery] = useState('');
  const [showAltAddresses, setShowAltAddresses] = useState(false);
  const [editingAddressName, setEditingAddressName] = useState<string | false>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fullAddress = fullAddresses.find((script) => script.miniaddress === address);
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);

  useEffect(() => {
    if (copiedAddress) {
      const timeout = setTimeout(() => {
        setCopiedAddress(false);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [copiedAddress]);

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

  const validateFetchedAddress = async () => {
    setIsLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    await validateAddress(address);
    setTimeout(() => {
      setIsLoading(false);
    }, 750);
  }

  const validateAddress = async (address: string) => {
    try {
      setIsLoading(true);

      const results = await MDS.cmd.checkaddress({
        params: {
          address: address,
        },
      });

      setTimeout(() => {
        setIsLoading(false);
      }, 750);

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

  const selectAddress = (address: string) => {
    setAddress(address);
  }

  const dismissEditAddressName = () => {
    setEditingAddressName(false);
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
              {t("valid_address")}
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
        <div className="flex-col gap-2 flex md:hidden">
          <InfoBox title={t("validated")} value={s(address, { start: 16, end: 8 })} />
          <InfoBox title={t("0x_address")} value={s(result['0x'], { start: 16, end: 8 })} copy />
          <InfoBox title={t("mx_address")} value={s(result['Mx'], { start: 16, end: 8 })} copy />
        </div>
        <div className="flex-col gap-2 hidden md:flex">
          <InfoBox title={t("validating")} value={address} />
          <InfoBox title={t("0x_address")} value={result['0x']} copy />
          <InfoBox title={t("mx_address")} value={result['Mx']} copy />
        </div>
      </div>
    )
  }

  const handleValidateAddress = () => {
    setAddress(query);
    validateAddress(query);
  }

  const copyAddress = () => {
    setCopiedAddress(true);
    navigator.clipboard.writeText(address);
  }

  return (
    <div className="grow flex flex-col mb-12">
      <div>
        <EditAddressName
          address={address}
          display={!!editingAddressName}
          dismiss={dismissEditAddressName}
        />
      </div>

      <h1 className="text-white text-2xl mb-6">{t("receive")}</h1>
      <div className="mb-6">
        <Tabs activeKey={activeTab} onClick={setActiveTab} tabs={TABS} />
      </div>
      {activeTab === YOUR_ADDRESS && (
        <div className="mt-2 mb-6 flex flex-col gap-4">

          <div className="text-white text-sm mb-2 bg-contrast1.5 p-3 px-4 border-l-4 border-l-yellow-500 rounded">
            {t("mx_and_0x_description")}
          </div>

          <div className="bg-contrast1 p-6 lg:p-8 rounded-lg">
            <div className={`block cursor-pointer bg-white w-full h-full md:w-[240px] md:h-[240px] mb-4 md:mt-0 md:mb-4 mx-auto relative transition-all duration-200 border-8 ${copiedAddress ? 'border-green' : 'border-transparent'}`}>
              <QRCode value={address} className="p-4 w-full h-full" onClick={copyAddress} />
              <div className={`text-sm text-grey60 absolute bottom-0 right-0 absolute transition-opacity duration-[150ms] ${copiedAddress ? 'opacity-100' : 'opacity-0'}`} />
            </div>

            <div className="mb-4 space-y-4">

              <div>
                <Input
                  value={addressNames[address] || t("untitled_address")}
                  label={t("address_name")}
                  inverse
                  readOnly
                  info={"A custom name for this address."}
                  action={() => setEditingAddressName(address)}
                />
              </div>
              <div className="flex md:hidden flex-col gap-4">
                {fullAddress && fullAddress.address && (
                  <Input
                    value={s(fullAddress.address, { start: 8, end: 12 })}
                    copyValueOverride={fullAddress.address}
                    inverse
                    readOnly
                    copy
                  />
                )}
                <Input
                  value={s(address, { start: 8, end: 12 })}
                  copyValueOverride={address}
                  inverse
                  copy
                />
              </div>
              <div className="hidden md:flex flex-col gap-4">
                {fullAddress && fullAddress.address && (
                  <Input
                    value={fullAddress.address}
                    copyValueOverride={fullAddress.address}
                    inverse
                    readOnly
                    copy
                  />
                )}
                <Input
                  value={address}
                  inverse
                  readOnly
                  copy
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button isLoading={isLoading} onClick={validateFetchedAddress}>
                {t("validate")}
              </Button>
            </div>
          </div>
          <div className="bg-contrast1 rounded-lg">
            <div onClick={toggleAltAddresses} className="pt-6 lg:pt-8 px-8 cursor-pointer grid grid-cols-12">
              <div className="col-span-10 flex items-center">
                <div className="text-grey20">
                  {t("your_alternative_addresses")}
                </div>
              </div>
              <div className="col-span-2 flex items-center justify-end">
                <svg className={`-ml-2 fill-[#91919D] hover:fill-white transition-all transition-100 ${showAltAddresses ? '!fill-orange -rotate-90' : 'rotate-90'}`} width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.875 5L0.9375 1.0625L2 0L7 5L2 10L0.9375 8.9375L4.875 5Z" fill="#currentColor"></path></svg>                </div>
            </div>
            <div className={`flex flex-col gap-2 px-4 pb-6 md:px-6 md:pb-8 ${showAltAddresses ? ' mt-4 md:mt-4 opacity-100' : 'h-0 opacity-0'}`}>
              <div className="md:mt-1 mb-5">
                <SearchBar placeholder={t("enter_an_address")} value={filterAddressQuery} onChange={(value) => setFilterAddressQuery(value)} className="!bg-black" />
              </div>
              <div className="custom-scrollbar max-h-[300px] pr-4 overflow-y-scroll flex flex-col gap-2">
                {addresses
                  .filter((address) => address.toLowerCase().includes(filterAddressQuery.toLowerCase()) || addressNames[address]?.toLowerCase().includes(filterAddressQuery.toLowerCase()))
                  .length === 0 && (
                    <div className="bg-contrast2/50 rounded-lg text-white text-sm px-4 py-4">
                      <div className="text-grey80">{t("no_matching_addresses_could_be_found")}</div>
                    </div>
                  )}
                {addresses
                  .filter((address) => address.toLowerCase().includes(filterAddressQuery.toLowerCase()) || addressNames[address]?.toLowerCase().includes(filterAddressQuery.toLowerCase()))
                  .map((address) => <AddressRow key={address} address={address} selectAddress={selectAddress} />)}
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
            <Button isLoading={isLoading} disabled={!/^(0x|Mx)[0-9a-zA-Z]*$/gmi.test(query)} onClick={handleValidateAddress}>{t("validate")}</Button>
          </div>
        </div>
      )}
    </div>
  )
}

export const AddressRow = ({ address, selectAddress }: { address: string, selectAddress: (address: string) => void }) => {
  const { s } = useSlice();
  const { t } = useTranslation();
  const { addressNames } = useContext(appContext);

  const handleOnClick = () => {
    selectAddress(address);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const addressName = addressNames[address] || t("untitled_address");

  return (
    <div key={address} onClick={handleOnClick} className="text-sm rounded-lg bg-contrast2/50 hover:bg-contrast2 transition-all transition-100 cursor-pointer py-4 px-5 relative">
      <div>
        <div className="mb-0.5">{addressName}</div>
        <div className="block md:hidden">{s(address, { start: 14, end: 8 })}</div>
        <div className="hidden md:block">{address}</div>
      </div>
    </div>
  )
};

const EditAddressName = ({ display, address, dismiss }: { display: boolean, address: string, dismiss: () => void }) => {
  const { t } = useTranslation();
  const { addressNames, setAddressNames } = useContext(appContext);
  const [addressName, setAddressName] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (display) {
      setAddressName(addressNames[address] || '');
    }
  }, [display]);

  const handleOnChange = (value: string) => {
    setAddressName(value);
  }

  const handleSave = () => {
    setIsLoading(true);
    setAddressNames({ ...addressNames, [address]: addressName });
    handleDismiss();
    setTimeout(() => {
      setIsLoading(false);
    }, 750);
  }

  const handleDismiss = () => {
    dismiss();
    setAddressName('');
  }

  return (
    <div className={`${display ? 'opacity-100' : 'pointer-events-none opacity-0'} delay-100 transition-opacity duration-100 flex absolute z-50 inset-0 top-0 left-0 justify-center items-center w-screen h-screen`}>
      <div className={`bg-contrast1 mb-4 fixed z-[60] rounded-lg max-w-[90%] md:max-w-[440px] w-full text-center text-white p-6 transform transition-all duration-200 ${display ? 'translate-y-[0%] opacity-100' : 'translate-y-[4px] opacity-0'}`}>
        <h1 className="text-white text-xl md:text-2xl mt-1 mb-6 font-bold">
          {t("set_address_name")}
        </h1>
        <div className="mb-6">
          <Input
            value={addressName}
            label={t("address_name")}
            onChange={handleOnChange}
            inverse
          />
        </div>
        <div className="flex flex-col gap-2">
          <Button isLoading={isLoading} onClick={handleSave} disabled={!addressName}>
            {t('save')}
          </Button>
          <Button onClick={handleDismiss} className="text-grey80 !bg-contrast2 !hover:opacity-90">
            {t('close')}
          </Button>
        </div>
      </div>
      <div className="z-50 fixed bg-black opacity-90 w-screen h-screen top-0 left-0"></div>
    </div>
  )
}
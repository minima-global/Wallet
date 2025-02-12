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

export const Route = createFileRoute('/receive/')({
  component: Index,
});

const YOUR_ADDRESS = 'YOUR_ADDRESS';
const VALIDATE_ADDRESS = 'VALIDATE_ADDRESS';

function Index() {
  const { t } = useTranslation();
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
  }

  const toggleAltAddresses = () => {
    setShowAltAddresses(!showAltAddresses);
  }

  if (result) {
    return (
      <div>
        <BackButton onClick={dismissResults} />
        <h1 className="text-white text-2xl mb-6">{t("validation_report")}</h1>
        <div className="text-white text-sm mb-6 bg-contrast1 p-3 px-4 border-l-4 border-l-green rounded">
          {t("this_address_is_safe_for_use")}
        </div>
        <div className="grid grid-cols-12 text-grey60 mb-6 gap-4">
          <div className="col-span-4 bg-contrast1 pt-3 pb-4 px-4 rounded text-center">
            <div className="text-lg mb-2.5">
              {t("belongs_to_this_node")}
            </div>
            {result.relevant && (
              <svg className="mx-auto w-[28px] h-[28px]" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.70858 13.2541L14.3316 7.65614L13.4028 6.72739L8.70858 11.3966L6.58358 9.29664L5.65483 10.2254L8.70858 13.2541ZM10.0046 19.1004C8.75725 19.1004 7.5805 18.8636 6.47433 18.3899C5.36817 17.9162 4.4 17.2645 3.56983 16.4346C2.73967 15.6048 2.08758 14.6371 1.61358 13.5314C1.13975 12.4257 0.902832 11.2493 0.902832 10.0021C0.902832 8.73814 1.13967 7.55722 1.61333 6.45939C2.087 5.36156 2.73875 4.39756 3.56858 3.56739C4.39842 2.73722 5.36617 2.08514 6.47183 1.61114C7.5775 1.13731 8.75392 0.900391 10.0011 0.900391C11.2651 0.900391 12.446 1.13722 13.5438 1.61089C14.6417 2.08456 15.6057 2.73631 16.4358 3.56614C17.266 4.39597 17.9181 5.35956 18.3921 6.45689C18.8659 7.55422 19.1028 8.73481 19.1028 9.99864C19.1028 11.246 18.866 12.4227 18.3923 13.5289C17.9187 14.6351 17.2669 15.6032 16.4371 16.4334C15.6072 17.2636 14.6437 17.9156 13.5463 18.3896C12.449 18.8635 11.2684 19.1004 10.0046 19.1004Z" fill="#4FE3C1" />
              </svg>
            )}
            {!result.relevant && (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.4749 14.4537L9.9999 10.9287L13.5249 14.4537L14.4537 13.5249L10.9287 9.9999L14.4537 6.4749L13.5249 5.54615L9.9999 9.07115L6.4749 5.54615L5.54615 6.4749L9.07115 9.9999L5.54615 13.5249L6.4749 14.4537ZM10.0017 19.0999C8.75432 19.0999 7.57757 18.8631 6.4714 18.3894C5.36524 17.9157 4.39707 17.264 3.5669 16.4342C2.73674 15.6043 2.08465 14.6366 1.61065 13.5309C1.13682 12.4252 0.899902 11.2488 0.899902 10.0017C0.899902 8.73765 1.13674 7.55674 1.6104 6.4589C2.08407 5.36107 2.73582 4.39707 3.56565 3.5669C4.39549 2.73674 5.36324 2.08465 6.4689 1.61065C7.57457 1.13682 8.75099 0.899902 9.99815 0.899902C11.2622 0.899902 12.4431 1.13674 13.5409 1.6104C14.6387 2.08407 15.6027 2.73582 16.4329 3.56565C17.2631 4.39549 17.9152 5.35907 18.3892 6.4564C18.863 7.55374 19.0999 8.73432 19.0999 9.99815C19.0999 11.2455 18.8631 12.4222 18.3894 13.5284C17.9157 14.6346 17.264 15.6027 16.4342 16.4329C15.6043 17.2631 14.6407 17.9152 13.5434 18.3892C12.4461 18.863 11.2655 19.0999 10.0017 19.0999Z" fill="#FF627E" />
              </svg>
            )}
          </div>
          <div className="col-span-4 bg-contrast1 pt-3 pb-4 px-4 rounded text-center">
            <div className="text-lg mb-2">
              {t("simple_address")}
            </div>
            {result.simple && (
              <svg className="mx-auto w-[28px] h-[28px]" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.70858 13.2541L14.3316 7.65614L13.4028 6.72739L8.70858 11.3966L6.58358 9.29664L5.65483 10.2254L8.70858 13.2541ZM10.0046 19.1004C8.75725 19.1004 7.5805 18.8636 6.47433 18.3899C5.36817 17.9162 4.4 17.2645 3.56983 16.4346C2.73967 15.6048 2.08758 14.6371 1.61358 13.5314C1.13975 12.4257 0.902832 11.2493 0.902832 10.0021C0.902832 8.73814 1.13967 7.55722 1.61333 6.45939C2.087 5.36156 2.73875 4.39756 3.56858 3.56739C4.39842 2.73722 5.36617 2.08514 6.47183 1.61114C7.5775 1.13731 8.75392 0.900391 10.0011 0.900391C11.2651 0.900391 12.446 1.13722 13.5438 1.61089C14.6417 2.08456 15.6057 2.73631 16.4358 3.56614C17.266 4.39597 17.9181 5.35956 18.3921 6.45689C18.8659 7.55422 19.1028 8.73481 19.1028 9.99864C19.1028 11.246 18.866 12.4227 18.3923 13.5289C17.9187 14.6351 17.2669 15.6032 16.4371 16.4334C15.6072 17.2636 14.6437 17.9156 13.5463 18.3896C12.449 18.8635 11.2684 19.1004 10.0046 19.1004Z" fill="#4FE3C1" />
              </svg>
            )}
            {!result.simple && (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.4749 14.4537L9.9999 10.9287L13.5249 14.4537L14.4537 13.5249L10.9287 9.9999L14.4537 6.4749L13.5249 5.54615L9.9999 9.07115L6.4749 5.54615L5.54615 6.4749L9.07115 9.9999L5.54615 13.5249L6.4749 14.4537ZM10.0017 19.0999C8.75432 19.0999 7.57757 18.8631 6.4714 18.3894C5.36524 17.9157 4.39707 17.264 3.5669 16.4342C2.73674 15.6043 2.08465 14.6366 1.61065 13.5309C1.13682 12.4252 0.899902 11.2488 0.899902 10.0017C0.899902 8.73765 1.13674 7.55674 1.6104 6.4589C2.08407 5.36107 2.73582 4.39707 3.56565 3.5669C4.39549 2.73674 5.36324 2.08465 6.4689 1.61065C7.57457 1.13682 8.75099 0.899902 9.99815 0.899902C11.2622 0.899902 12.4431 1.13674 13.5409 1.6104C14.6387 2.08407 15.6027 2.73582 16.4329 3.56565C17.2631 4.39549 17.9152 5.35907 18.3892 6.4564C18.863 7.55374 19.0999 8.73432 19.0999 9.99815C19.0999 11.2455 18.8631 12.4222 18.3894 13.5284C17.9157 14.6346 17.264 15.6027 16.4342 16.4329C15.6043 17.2631 14.6407 17.9152 13.5434 18.3892C12.4461 18.863 11.2655 19.0999 10.0017 19.0999Z" fill="#FF627E" />
              </svg>
            )}
          </div>
          <div className="col-span-4 bg-contrast1 pt-3 pb-4 px-4 rounded text-center">
            <div className="text-lg mb-2">
              {t("validation_report")}
            </div>
            <svg className="mx-auto w-[28px] h-[28px]" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.70858 13.2541L14.3316 7.65614L13.4028 6.72739L8.70858 11.3966L6.58358 9.29664L5.65483 10.2254L8.70858 13.2541ZM10.0046 19.1004C8.75725 19.1004 7.5805 18.8636 6.47433 18.3899C5.36817 17.9162 4.4 17.2645 3.56983 16.4346C2.73967 15.6048 2.08758 14.6371 1.61358 13.5314C1.13975 12.4257 0.902832 11.2493 0.902832 10.0021C0.902832 8.73814 1.13967 7.55722 1.61333 6.45939C2.087 5.36156 2.73875 4.39756 3.56858 3.56739C4.39842 2.73722 5.36617 2.08514 6.47183 1.61114C7.5775 1.13731 8.75392 0.900391 10.0011 0.900391C11.2651 0.900391 12.446 1.13722 13.5438 1.61089C14.6417 2.08456 15.6057 2.73631 16.4358 3.56614C17.266 4.39597 17.9181 5.35956 18.3921 6.45689C18.8659 7.55422 19.1028 8.73481 19.1028 9.99864C19.1028 11.246 18.866 12.4227 18.3923 13.5289C17.9187 14.6351 17.2669 15.6032 16.4371 16.4334C15.6072 17.2636 14.6437 17.9156 13.5463 18.3896C12.449 18.8635 11.2684 19.1004 10.0046 19.1004Z" fill="#4FE3C1" />
            </svg>
          </div>
        </div>
        <div className="flex flex-col gap-2">
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
          <div className="bg-contrast1 p-8 rounded-lg">
            <div className="block bg-white w-[240px] h-[240px] mx-auto mb-4">
              <QRCode value={address} className="p-4 w-full h-full" />
            </div>

            <div className="mb-4">
              <Input
                value={address}
                label={t("address_name")}
                inverse
                copy
              />
            </div>

            <Button onClick={validateFetchedAddress}>
              {t("validate")}
            </Button>
          </div>
          <div className="bg-contrast1 rounded-lg">
            <div onClick={toggleAltAddresses} className="pt-8 px-8 cursor-pointer grid grid-cols-12">
              <div className="col-span-6 flex items-center">
                <div className="text-grey20">{t("your_alternative_addresses")}</div>
              </div>
              <div className="col-span-6 flex items-center justify-end">
                <svg className={`-ml-2 fill-[#91919D] hover:fill-white transition-all transition-100 ${showAltAddresses ? 'rotate-90' : ''}`} width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.875 5L0.9375 1.0625L2 0L7 5L2 10L0.9375 8.9375L4.875 5Z" fill="#currentColor"></path></svg>                </div>
            </div>
            <div className={`flex flex-col gap-2 p-8 pt-0 ${showAltAddresses ? 'mt-6 opacity-100' : 'h-0 opacity-0'}`}>
              <div className="mt-1 mb-4">
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
                  .map((address) => (
                    <div key={address} className="rounded-lg bg-contrast2/50 p-3">
                      <div key={address}>
                        <div>{address}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === VALIDATE_ADDRESS && (
        <div className="mt-2 mb-6 flex flex-col gap-4">
          {error && (
            <div className="text-white text-sm mb-2 bg-contrast1 p-3 px-4 border-l-4 border-l-red rounded">
              {t("this_address_is_not_safe")}
            </div>
          )}
          <div className="bg-contrast1 p-8 rounded-lg flex flex-col gap-4">
            <Input
              value={query}
              label={t("validate_an_address")}
              onChange={(value) => setQuery(value)}
              placeholder={t("enter_an_0x_or_mx_address")}
              inverse
            />
            <Button disabled={query.length === 0} onClick={() => validateAddress(query)}>{t("validate")}</Button>
          </div>
        </div>
      )}
    </div>
  )
}

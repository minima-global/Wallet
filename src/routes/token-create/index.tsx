import { MDS } from '@minima-global/mds';
import { ChangeEvent, useContext, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import Input from '../../components/Input'
import Button from '../../components/Button';
import { appContext } from '../../AppContext';
import useGetSuitableImage from '../../hooks/useGetSuitableImage';
import useTranslation from '../../hooks/useTranslation';

export const Route = createFileRoute('/token-create/')({
  component: Index,
})

function Index() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setIsPending, setIsSuccess, setIsError } = useContext(appContext);
  const { getImage } = useGetSuitableImage();

  const [step, setStep] = useState(1);
  const [type, setType] = useState("SIMPLE");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [webUrl, setWebUrl] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [description, setDescription] = useState("");
  const [decimals, setDecimals] = useState("8");
  const [ticker, setTicker] = useState("");
  const [webValidationUrl, setWebValidationUrl] = useState("");
  const [burn, setBurn] = useState("");
  const [metadata, setMetadata] = useState<{ key: string, value: string }[]>([]);
  const [metadataKey, setMetadataKey] = useState("");
  const [metadataValue, setMetadataValue] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const OPTIONS = [
    {
      label: t("upload_image"),
      value: "UPLOAD_IMAGE",
    },
    {
      label: t("web_url"),
      value: "WEB_URL",
    },
  ];

  const addMetadata = () => {
    setMetadata([...metadata, { key: metadataKey, value: metadataValue }]);
    setMetadataKey("");
    setMetadataValue("");
  }

  const removeMetadata = (index: number) => {
    setMetadata(metadata.filter((_, i) => i !== index));
  }

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (file) {
      const image = await getImage(file);
      setImage(image);
    }
  }

  const renderImage = (dataUrl: string) => {
    return `data:image/jpeg;base64,${dataUrl.replace(/<\/?artimage>/g, '')}`;
  }

  const removeImage = (evt: React.MouseEvent<HTMLDivElement>) => {
    evt.preventDefault();
    setImage(null);
  }

  const REVIEW_FIELDS: {
    label: string;
    value: string;
    className?: string;
  }[] = [
      {
        label: t('token_name'),
        value: tokenName,
      },
      {
        label: t('total_supply'),
        value: totalSupply,
      },
      {
        label: t('description'),
        value: description || 'N/A',
        className: type === 'SIMPLE' ? 'hidden' : ''
      },
      {
        label: t('decimals'),
        value: decimals || '8',
      },
      {
        label: t('ticker'),
        value: ticker || "N/A",
        className: type === 'SIMPLE' ? 'hidden' : ''
      },
      {
        label: t('web_validation_url'),
        value: webValidationUrl || 'N/A',
        className: type === 'SIMPLE' ? 'hidden' : ''
      },
      {
        label: t('burn'),
        value: burn || 'N/A',
      },
      ...metadata.map((item) => ({
        label: item.key,
        value: item.value,
        className: `capitalize ${type === 'SIMPLE' ? 'hidden' : ''}`
      })),
    ];

  const goToCreate = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(1);
  }

  const goToReview = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(2);
  }

  const createToken = async () => {
    let response;

    setIsLoading(true);

    const token = {
      name: tokenName,
    };

    if (metadata.length > 0) {
      metadata.forEach((item) => {
        token[item.key] = item.value;
      });
    }

    if (type === "UPLOAD_IMAGE") {
      response = await MDS.cmd.tokencreate({
        params: {
          name: JSON.stringify({
            url: image,
            ticker: ticker,
            description: description,
            webvalidate: webValidationUrl,
            ...token,
            ...metadata,
          }),
          amount: totalSupply,
          decimals,
          burn: burn || undefined,
        }
      });
    } else if (type === "WEB_URL") {
      response = await MDS.cmd.tokencreate({
        params: {
          name: JSON.stringify({
            url: webUrl,
            ticker: ticker,
            description: description,
            webvalidate: webValidationUrl,
            ...token,
          }),
          amount: totalSupply,
          decimals,
          burn: burn || undefined,
        }
      });
    } else if (type === "SIMPLE") {
      response = await MDS.cmd.tokencreate({
        params: {
          name: tokenName,
          amount: totalSupply,
          decimals,
          burn: burn || undefined,
        }
      });
    }

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

  const createSimpleToken = async () => {
    setType("SIMPLE");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const createCustomToken = async () => {
    setType("UPLOAD_IMAGE");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const isDisabled = () => {
    if (type === "UPLOAD_IMAGE") {
      return !image
        || !(tokenName.length > 0)
        || !(/^\d+$/.test(totalSupply))
        || !(/^\d+$/.test(decimals) && parseInt(decimals) >= 1 && parseInt(decimals) <= 16);
    } else if (type === "WEB_URL") {
      return !webUrl
        || !(tokenName.length > 0)
        || !(/^\d+$/.test(totalSupply))
        || !(/^\d+$/.test(decimals) && parseInt(decimals) >= 1 && parseInt(decimals) <= 16);
    } else if (type === "SIMPLE") {
      return !(tokenName.length > 0 && !/\s/.test(tokenName))
        || !(/^\d+$/.test(totalSupply));
    }
  };

  return (
    <>
      <div className="grow flex flex-col mb-20">
        {step === 1 && (
          <div>
            <div className="grid grid-cols-2">
              <div className="col-span-1">
                <h1 className="text-white text-2xl mb-6">{t("token_create")}</h1>
              </div>
              <div className="col-span-1" />
            </div>

            <form className="flex flex-col gap-6">
              <div className="flex gap-4">
                <Button
                  type="button"
                  onClick={createSimpleToken}
                  className={`!text-left ${type !== 'SIMPLE' ? '!bg-contrast2 !text-white hover:!bg-opacity-90' : 'hover:!bg-orange enabled:hover:!opacity-100'}`}
                >
                  {t("simple")}
                </Button>
                <Button
                  type="button"
                  onClick={createCustomToken}
                  className={`!text-left ${type === 'SIMPLE' ? '!bg-contrast2 !text-white hover:!bg-opacity-90' : 'hover:!bg-orange enabled:hover:!opacity-100'}`}
                >
                  {t("custom")}
                </Button>
              </div>
              {type !== 'SIMPLE' && (
                <div>
                  <Dropdown options={OPTIONS} value={type} onChange={setType} />
                </div>
              )}

              {type === "UPLOAD_IMAGE" && (
                <label className={`cursor-pointer mt-2 bg-contrast1 text-grey60 ${!image ? 'hover:bg-contrast1.5 py-20' : 'py-10'}`}>
                  <div className="flex flex-col items-center gap-4">
                    {!image && (
                      <div className="flex flex-col items-center gap-4">
                        <svg className="block" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="1" y="1" width="46" height="46" rx="23" stroke="#FF8630" strokeWidth="2" />
                          <mask id="mask0_5595_53498" maskUnits="userSpaceOnUse" x="12" y="12" width="24" height="24">
                            <rect x="12" y="12" width="24" height="24" fill="#D9D9D9" />
                          </mask>
                          <g mask="url(#mask0_5595_53498)">
                            <path d="M23 28V19.85L20.4 22.45L19 21L24 16L29 21L27.6 22.45L25 19.85V28H23ZM18 32C17.45 32 16.9792 31.8042 16.5875 31.4125C16.1958 31.0208 16 30.55 16 30V27H18V30H30V27H32V30C32 30.55 31.8042 31.0208 31.4125 31.4125C31.0208 31.8042 30.55 32 30 32H18Z" fill="#FF8630" />
                          </g>
                        </svg>
                        <div>{t("upload_image")}</div>
                      </div>
                    )}
                    {image && (
                      <div className="relative w-full h-full min-h-[200px] max-w-[200px] border border-contrast2 rounded-md flex items-center justify-center">
                        <img
                          src={renderImage(image)}
                          alt="Token preview"
                          className="w-full h-fullobject-contain"
                        />
                        <div className="absolute z-[20] right-3 bottom-3">
                          <div onClick={removeImage} className="border border-contrast2 bg-contrast1 hover:bg-contrast2 rounded-full h-[36px] w-[36px] flex items-center justify-center">
                            <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2.6155 16C2.168 16 1.78683 15.8426 1.472 15.528C1.15733 15.2131 1 14.832 1 14.3845V1.99996H0V0.999963H4V0.230713H10V0.999963H14V1.99996H13V14.3845C13 14.8448 12.8458 15.2291 12.5375 15.5375C12.2292 15.8458 11.8448 16 11.3845 16H2.6155ZM12 1.99996H2V14.3845C2 14.564 2.05767 14.7115 2.173 14.827C2.2885 14.9423 2.436 15 2.6155 15H11.3845C11.5385 15 11.6796 14.9359 11.8077 14.8077C11.9359 14.6795 12 14.5385 12 14.3845V1.99996ZM4.80775 13H5.80775V3.99996H4.80775V13ZM8.19225 13H9.19225V3.99996H8.19225V13Z" fill="#E9E9EB" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                    <input type="file" className="hidden" onChange={handleImageUpload} />
                  </div>
                </label>
              )}

              {type === "WEB_URL" && (
                <Input
                  label={t("web_url")}
                  placeholder={t("enter_the_web_url_of_your_image")}
                  value={webUrl}
                  onChange={setWebUrl}
                  validation={(value) => /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value)}
                  validationMessage={t("please_enter_a_valid_web_url")}
                />
              )}

              {type === "SIMPLE" && (
                <Input
                  label={t("token_name")}
                  placeholder={t("enter_the_name_of_your_token")}
                  value={tokenName}
                  onChange={setTokenName}
                  required={true}
                  validation={(value) => {
                    return value.length > 0 && !/\s/.test(value);
                  }}
                  validationMessage={t("a_token_name_is_required_and_must_not_contain_spaces")}
                />
              )}

              {type !== "SIMPLE" && (
                <Input
                  label={t("token_name")}
                  placeholder={t("enter_the_name_of_your_token")}
                  value={tokenName}
                  onChange={setTokenName}
                  required={true}
                  validation={(value) => {
                    return value.length > 0;
                  }}
                  validationMessage={t("a_token_name_is_required")}
                />
              )}

              <Input
                label={t("total_supply")}
                placeholder={t("enter_the_total_supply_of_your_token")}
                value={totalSupply}
                required={true}
                onChange={setTotalSupply}
                validation={(value) => /^\d+$/.test(value)}
                validationMessage={t("token_supply_is_required")}
              />
              <Input
                label={t("decimals")}
                placeholder={t("enter_the_number_of_decimals_for_your_token")}
                value={decimals}
                onChange={setDecimals}
                required={true}
                info={t("the_number_of_decimal_places_for_the_token")}
              />
              <Input
                label={t("description")}
                placeholder={t("add_a_description")}
                value={description}
                onChange={setDescription}
                optionalLabel={t('optional')}
                className={`${['SIMPLE'].includes(type) ? 'hidden' : ''}`}
              />
              <Input
                label={t("ticker")}
                placeholder={t("enter_a_ticker_symbol_for_your_token_eg_btc_eth")}
                value={ticker}
                onChange={setTicker}
                required={false}
                optionalLabel={t('optional')}
                className={`${['SIMPLE'].includes(type) ? 'hidden' : ''}`}
              />
              <Input
                label={t("web_validation_url")}
                placeholder={t("enter_a_web_address")}
                value={webValidationUrl}
                onChange={setWebValidationUrl}
                info={t("the_web_address_to_validate_the_token")}
                validation={(value) => /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value)}
                validationMessage={t("please_enter_a_valid_url")}
                className={`${['SIMPLE'].includes(type) ? 'hidden' : ''}`}
                optionalLabel={t('optional')}
              />
              <Input
                label={t("add_a_burn")}
                placeholder={t("burn")}
                value={burn}
                onChange={setBurn}
                required={false}
                info={t("the_amount_of_tokens_to_burn_to_priortise_the_token")}
                validation={(value) => /^\d+$/.test(value)}
                validationMessage={t("invalid_burn_amount")}
                optionalLabel={t('optional')}
              />

              <div className={`flex flex-col gap-6 ${['SIMPLE'].includes(type) ? 'hidden' : ''}`}>
                <div className="text-sm md:text-base my-2 flex items-center gap-4 text-center text-grey60">
                  <div className="grow h-[1px] bg-contrast4"></div>
                  {t("add_additional_metadata")} ({t('optional')})
                  <div className="relative group">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.25 14.4492H10.75V8.69922H9.25V14.4492ZM10 6.98772C10.2288 6.98772 10.4207 6.9103 10.5755 6.75547C10.7303 6.60064 10.8077 6.4088 10.8077 6.17997C10.8077 5.95114 10.7303 5.7593 10.5755 5.60447C10.4207 5.4498 10.2288 5.37247 10 5.37247C9.77117 5.37247 9.57933 5.4498 9.4245 5.60447C9.26967 5.7593 9.19225 5.95114 9.19225 6.17997C9.19225 6.4088 9.26967 6.60064 9.4245 6.75547C9.57933 6.9103 9.77117 6.98772 10 6.98772ZM10.0017 19.1992C8.68775 19.1992 7.45267 18.9499 6.2965 18.4512C5.14033 17.9526 4.13467 17.2758 3.2795 16.421C2.42433 15.5661 1.74725 14.5609 1.24825 13.4052C0.749417 12.2496 0.5 11.0148 0.5 9.70097C0.5 8.38697 0.749333 7.15189 1.248 5.99572C1.74667 4.83955 2.42342 3.83389 3.27825 2.97872C4.13308 2.12355 5.13833 1.44647 6.294 0.947469C7.44967 0.448635 8.68442 0.199219 9.99825 0.199219C11.3123 0.199219 12.5473 0.448552 13.7035 0.947218C14.8597 1.44589 15.8653 2.12264 16.7205 2.97747C17.5757 3.8323 18.2528 4.83755 18.7518 5.99322C19.2506 7.14889 19.5 8.38364 19.5 9.69747C19.5 11.0115 19.2507 12.2466 18.752 13.4027C18.2533 14.5589 17.5766 15.5646 16.7218 16.4197C15.8669 17.2749 14.8617 17.952 13.706 18.451C12.5503 18.9498 11.3156 19.1992 10.0017 19.1992ZM10 17.6992C12.2333 17.6992 14.125 16.9242 15.675 15.3742C17.225 13.8242 18 11.9326 18 9.69922C18 7.46589 17.225 5.57422 15.675 4.02422C14.125 2.47422 12.2333 1.69922 10 1.69922C7.76667 1.69922 5.875 2.47422 4.325 4.02422C2.775 5.57422 2 7.46589 2 9.69922C2 11.9326 2.775 13.8242 4.325 15.3742C5.875 16.9242 7.76667 17.6992 10 17.6992Z" fill="#91919D" />
                    </svg>
                    <div className="group-hover:opacity-100 z-[1000] text-left pointer-events-none text-white opacity-0 bg-contrast1.5 rounded-md px-3 py-2 absolute text-sm w-full min-w-[210px] top-[calc(100%+14px)] right-[-4px] text-sm text-grey60 before:content-[''] before:absolute before:top-[-4px] before:right-[10px] before:w-[8px] before:h-[8px] before:rotate-45 before:bg-contrast1.5">
                      {t("metadata_is_used_to_store_additional_information_about_the_token")}
                    </div>
                  </div>
                  <div className="grow h-[1px] bg-contrast4"></div>
                </div>

                <div className="flex flex-col gap-4">

                  <div className="flex lg:hidden gap-4 bg-contrast1 p-4 rounded">
                    <div className="flex flex-col gap-2 w-full">
                      <div className="grow bg-contrast1.5 px-4 py-2 rounded">
                        <input
                          placeholder={t("enter_a_key")}
                          className="text-sm w-full bg-transparent h-full placeholder-grey60 appearance-none outline-none"
                          value={metadataKey}
                          onChange={(e) => setMetadataKey(e.target.value)}
                        />
                      </div>
                      <div className="grow bg-contrast1.5 px-4 py-2 rounded">
                        <input
                          placeholder={t("enter_a_value")}
                          className="text-sm bg-transparent w-full h-full placeholder-grey60 appearance-none outline-none"
                          value={metadataValue}
                          onChange={(e) => setMetadataValue(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <button onClick={addMetadata} disabled={!metadataKey || !metadataValue} className="text-sm disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer enabled:text-white enabled:hover:text-grey60 enabled:active:text-orange">
                        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12.2122 19.0322H13.8872V13.5996H19.3335V11.9246H13.8872V6.36556H12.2122V11.9246H6.66683V13.5996H12.2122V19.0322ZM13.0082 25.3656C11.2546 25.3656 9.61027 25.0331 8.07516 24.3682C6.53983 23.7033 5.19827 22.7973 4.0505 21.6502C2.90294 20.5029 1.9965 19.1614 1.33116 17.6259C0.666051 16.0901 0.333496 14.4448 0.333496 12.6899C0.333496 10.9408 0.665941 9.29667 1.33083 7.75756C1.99572 6.21823 2.90172 4.87845 4.04883 3.73823C5.19616 2.598 6.53761 1.69523 8.07316 1.02989C9.60894 0.364782 11.2543 0.0322266 13.0092 0.0322266C14.7583 0.0322266 16.4024 0.36467 17.9415 1.02956C19.4808 1.69445 20.8206 2.59678 21.9608 3.73656C23.1011 4.87634 24.0038 6.21667 24.6692 7.75756C25.3343 9.29845 25.6668 10.9429 25.6668 12.6909C25.6668 14.4444 25.3344 16.0888 24.6695 17.6239C24.0046 19.1592 23.1023 20.4993 21.9625 21.6442C20.8227 22.7893 19.4824 23.6958 17.9415 24.3636C16.4006 25.0316 14.7562 25.3656 13.0082 25.3656Z" fill="currentColor" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="hidden lg:block">
                    <div className="flex gap-4 w-full">
                      <div className="grow bg-contrast1.5 px-4 py-2 rounded">
                        <input
                          placeholder={t("enter_a_key")}
                          className="text-sm bg-transparent w-full h-full placeholder-grey60 appearance-none outline-none"
                          value={metadataKey}
                          onChange={(e) => setMetadataKey(e.target.value)}
                        />
                      </div>
                      <div className="grow bg-contrast1.5 px-4 py-2 rounded">
                        <input
                          placeholder={t("enter_a_value")}
                          className="text-sm bg-transparent w-full h-full placeholder-grey60 appearance-none outline-none"
                          value={metadataValue}
                          onChange={(e) => setMetadataValue(e.target.value)}
                        />
                      </div>
                      <div>
                        <div className="pl-1 pr-4 md:pl-2 py-2 md:pr-5 rounded">
                          <button onClick={addMetadata} disabled={!metadataKey || !metadataValue} className="text-sm disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer enabled:text-white enabled:hover:text-grey60 enabled:active:text-orange">
                            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12.2122 19.0322H13.8872V13.5996H19.3335V11.9246H13.8872V6.36556H12.2122V11.9246H6.66683V13.5996H12.2122V19.0322ZM13.0082 25.3656C11.2546 25.3656 9.61027 25.0331 8.07516 24.3682C6.53983 23.7033 5.19827 22.7973 4.0505 21.6502C2.90294 20.5029 1.9965 19.1614 1.33116 17.6259C0.666051 16.0901 0.333496 14.4448 0.333496 12.6899C0.333496 10.9408 0.665941 9.29667 1.33083 7.75756C1.99572 6.21823 2.90172 4.87845 4.04883 3.73823C5.19616 2.598 6.53761 1.69523 8.07316 1.02989C9.60894 0.364782 11.2543 0.0322266 13.0092 0.0322266C14.7583 0.0322266 16.4024 0.36467 17.9415 1.02956C19.4808 1.69445 20.8206 2.59678 21.9608 3.73656C23.1011 4.87634 24.0038 6.21667 24.6692 7.75756C25.3343 9.29845 25.6668 10.9429 25.6668 12.6909C25.6668 14.4444 25.3344 16.0888 24.6695 17.6239C24.0046 19.1592 23.1023 20.4993 21.9625 21.6442C20.8227 22.7893 19.4824 23.6958 17.9415 24.3636C16.4006 25.0316 14.7562 25.3656 13.0082 25.3656Z" fill="currentColor" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {metadata.map((item, index) => (
                    <div key={`metadata-${index}`}>
                      <div className="flex lg:hidden gap-4 bg-contrast1 p-4 rounded">
                        <div className="flex flex-col gap-2 w-full">
                          <div className="grow bg-contrast2 px-4 py-2 rounded">
                            <input
                              required
                              placeholder="Enter a key"
                              className="text-sm bg-transparent w-full h-full placeholder-grey60 appearance-none outline-none"
                              value={item.key}
                              readOnly
                            />
                          </div>
                          <div className="grow bg-contrast2 px-4 py-2 rounded">
                            <input
                              required
                              placeholder="Enter a value"
                              className="text-sm bg-transparent w-full h-full placeholder-grey60 appearance-none outline-none"
                              value={item.value}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-center">
                          <button onClick={() => removeMetadata(index)} className="text-sm disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer text-orange enabled:hover:text-lighterOrange enabled:active:text-white">
                            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8.10116 18.7777L13.0002 13.8783L17.8992 18.7777L19.0788 17.598L14.1795 12.699L19.0788 7.80002L17.8992 6.62035L13.0002 11.5197L8.10116 6.62035L6.9215 7.80002L11.8208 12.699L6.9215 17.598L8.10116 18.7777ZM13.0025 25.3657C11.2596 25.3657 9.61883 25.0332 8.08016 24.3684C6.5415 23.7035 5.19827 22.7975 4.0505 21.6503C2.90294 20.503 1.9965 19.1603 1.33116 17.6224C0.666051 16.0844 0.333496 14.444 0.333496 12.7013C0.333496 10.9493 0.665941 9.30257 1.33083 7.76102C1.99572 6.21946 2.90172 4.87857 4.04883 3.73835C5.19616 2.59813 6.53883 1.69535 8.07683 1.03002C9.61483 0.364904 11.2552 0.0323486 12.9978 0.0323486C14.7498 0.0323486 16.3966 0.364792 17.9382 1.02968C19.4797 1.69457 20.8206 2.5969 21.9608 3.73668C23.1011 4.87646 24.0038 6.21679 24.6692 7.75768C25.3343 9.29857 25.6668 10.9449 25.6668 12.6967C25.6668 14.4396 25.3344 16.0803 24.6695 17.619C24.0046 19.1577 23.1023 20.5009 21.9625 21.6487C20.8227 22.7962 19.4824 23.7027 17.9415 24.368C16.4006 25.0331 14.7543 25.3657 13.0025 25.3657Z" fill="currentColor" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="hidden lg:flex gap-4 w-full">
                        <div className="grow bg-darkContrast px-4 py-2 rounded">
                          <input
                            required
                            placeholder="Enter a key"
                            className="text-sm bg-transparent w-full h-full placeholder-grey60 appearance-none outline-none"
                            value={item.key}
                            readOnly
                          />
                        </div>
                        <div className="grow bg-darkContrast px-4 py-2 rounded">
                          <input
                            required
                            placeholder="Enter a value"
                            className="text-sm bg-transparent w-full h-full placeholder-grey60 appearance-none outline-none"
                            value={item.value}
                            readOnly
                          />
                        </div>
                        <div>
                          <div className="pl-1 pr-4 md:pl-2 py-2 md:pr-5 rounded">
                            <button onClick={() => removeMetadata(index)} className="text-sm disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer text-orange enabled:hover:text-lighterOrange enabled:active:text-white">
                              <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.10116 18.7777L13.0002 13.8783L17.8992 18.7777L19.0788 17.598L14.1795 12.699L19.0788 7.80002L17.8992 6.62035L13.0002 11.5197L8.10116 6.62035L6.9215 7.80002L11.8208 12.699L6.9215 17.598L8.10116 18.7777ZM13.0025 25.3657C11.2596 25.3657 9.61883 25.0332 8.08016 24.3684C6.5415 23.7035 5.19827 22.7975 4.0505 21.6503C2.90294 20.503 1.9965 19.1603 1.33116 17.6224C0.666051 16.0844 0.333496 14.444 0.333496 12.7013C0.333496 10.9493 0.665941 9.30257 1.33083 7.76102C1.99572 6.21946 2.90172 4.87857 4.04883 3.73835C5.19616 2.59813 6.53883 1.69535 8.07683 1.03002C9.61483 0.364904 11.2552 0.0323486 12.9978 0.0323486C14.7498 0.0323486 16.3966 0.364792 17.9382 1.02968C19.4797 1.69457 20.8206 2.5969 21.9608 3.73668C23.1011 4.87646 24.0038 6.21679 24.6692 7.75768C25.3343 9.29857 25.6668 10.9449 25.6668 12.6967C25.6668 14.4396 25.3344 16.0803 24.6695 17.619C24.0046 19.1577 23.1023 20.5009 21.9625 21.6487C20.8227 22.7962 19.4824 23.7027 17.9415 24.368C16.4006 25.0331 14.7543 25.3657 13.0025 25.3657Z" fill="currentColor" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
              <div className="mt-4">
                <Button disabled={isDisabled()} onClick={goToReview}>
                  {t("review")}
                </Button>
              </div>
            </form>

          </div >
        )}
        {step === 2 && (
          <div className="grow flex flex-col">
            <h1 className="text-white text-2xl mb-6">{t('review')}</h1>
            <div className="mt-2 mb-6 flex flex-col gap-4">
              <div className="bg-contrast1 p-5 md:p-10 rounded-lg">
                {(type === 'UPLOAD_IMAGE' || type === 'WEB_URL') && (
                  <div className="mb-5 mx-auto text-center gap-4">
                    {image && type === "UPLOAD_IMAGE" && (
                      <div className="relative w-full h-full mx-auto min-h-[200px] max-w-[200px] border border-contrast2 rounded-md flex items-center justify-center">
                        <img
                          src={renderImage(image)}
                          alt="Token preview"
                          className="w-full w-full object-contain"
                        />
                      </div>
                    )}
                    {webUrl && type === "WEB_URL" && (
                      <div className="relative w-full h-full mx-auto min-h-[200px] max-w-[200px] border border-contrast2 rounded-md flex items-center justify-center">
                        <img src={webUrl} alt="Token preview" className="object-contain" />
                      </div>
                    )}
                  </div>
                )}
                <label className="text-white">{t('details')}</label>
                <div className="my-4 text-grey20 bg-black p-5 rounded text-sm break-all flex flex-col gap-4">
                  {REVIEW_FIELDS.map((field, index) => (
                    <div key={`${field.label}-${index}`} className={field.className || ""}>
                      <label className={`text-grey60`}>{field.label}</label>
                      <div>{field.value}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-4 mt-8">
                  <Button isLoading={isLoading} disabled={isDisabled()} onClick={createToken}>
                    {t('create')}
                  </Button>
                  <Button onClick={goToCreate} className="!bg-contrast1.5 !hover:bg-contrast2 text-white">
                    {t('cancel')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div >
    </>
  )
}

type DropdownProps = {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}

const Dropdown = ({ options, value, onChange }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const selectedOption = options.find((option) => option.value === value);

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div>
      <div onClick={toggleDropdown} className="relative z-[50] bg-darkContrast relative w-full flex p-3 border-lightDarkContrast rounded cursor-pointer select-none">
        <div className="relative z-[50] flex w-full">
          <div className="px-4 py-1.5">
            {selectedOption?.label}
          </div>
          <span className="flex absolute top-0 right-1 h-full items-center">
            <div className={`p-3 transition-all duration-300 ${isOpen ? 'text-orange -rotate-180' : 'text-grey hover:text-white'}`}>
              <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 6.0625L0 1.0625L1.0625 0L5 3.9375L8.9375 0L10 1.0625L5 6.0625Z" fill="currentColor" />
              </svg>
            </div>
          </span>
        </div>
        <div className={`absolute left-0 top-[100%] border border-contrast2 bg-contrast1.5 p-2 z-[20] w-full custom-scrollbar ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="custom-scrollbar max-h-[300px]">
            {options.map((option, index) => (
              <div key={option.value}>
                <div onClick={() => onChange(option.value)} className="py-3 px-4 rounded cursor-pointer hover:bg-contrast2 flex">
                  {option.label}
                </div>
                {index !== options.length - 1 && (
                  <div className="h-[1px] bg-contrast3 w-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div onClick={toggleDropdown} className={`fixed top-0 left-0 w-full h-full bg-black z-[20] lg:z-[10] ${isOpen ? 'opacity-80' : 'opacity-0 pointer-events-none'}`}></div>
    </div>
  )
}

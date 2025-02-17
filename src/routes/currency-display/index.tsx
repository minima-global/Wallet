import { useContext } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { appContext } from '../../AppContext'
import useTranslation from '../../hooks/useTranslation'

export const Route = createFileRoute('/currency-display/')({
  component: Index,
})

function Index() {
  const { t } = useTranslation();
  const { currencyType, setCurrencyType } = useContext(appContext)

  const OPTIONS = [
    {
      key: '1',
      textContent: "1,000,000.0000",
    },
    {
      key: '2',
      textContent: "1000000.0000",
    },
    {
      key: '3',
      textContent: "1 000 000.0000",
    },
    {
      key: '4',
      textContent: "1 000 000,0000",
    },
    {
      key: '5',
      textContent: "1000000,0000",
    },
    {
      key: '6',
      textContent: "1.000.000,0000",
    },
    {
      key: '7',
      textContent: "1.000.000.0000",
    },
    {
      key: '8',
      textContent: "1,000,000,0000",
    },
  ]

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setCurrencyType(evt.target.value)
    localStorage.setItem('minima_currency_type', evt.target.value)
  }

  return (
    <div>
      <h1 className="text-white text-2xl mb-6">{t("choose_a_display_format")}</h1>
      <div className="flex flex-col gap-3">
        {OPTIONS.map((option) => (
          <div key={option.key} className="bg-darkContrast relative w-full flex p-4 rounded">
            <label htmlFor={option.key} className="flex items-center gap-5 cursor-pointer">
              <input id={option.key} name="currency-display" type="radio" className="peer hidden" value={option.key} checked={currencyType === option.key} onChange={handleChange} />
              <div className="relative peer-checked:[&>div]:opacity-100 w-4 h-4 border-2 border-grey60 peer-checked:border-orange rounded-full flex items-center justify-center">
                <div className="absolute inset-0 opacity-0 top-0.5 left-0.5 w-2 h-2 rounded-full bg-orange" />
              </div>
              <div className="text-white text-sm">{option.textContent}</div>
            </label>
          </div>
        ))}
      </div>
    </div >
  )
}

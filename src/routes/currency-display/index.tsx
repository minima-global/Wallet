import { useContext } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import Header from '../../components/Header'
import Navigation from '../../components/Navigation'
import { appContext } from '../../AppContext'

export const Route = createFileRoute('/currency-display/')({
  component: Index,
})

function Index() {
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
    <>
      <Header />
      <div className="mt-10 container mx-auto flex">
        <div className="flex w-full gap-10">
          <div className="flex flex-col gap-5">
            <Navigation />
          </div>
          <div className="grow flex flex-col">
            <h1 className="text-white text-2xl mb-6">Choose a display format</h1>
            <div className="flex flex-col gap-3">
              {OPTIONS.map((option) => (
                <div className="bg-grey10 dark:bg-darkContrast relative w-full flex p-4 rounded">
                  <label htmlFor={option.value} className="flex items-center gap-5 cursor-pointer">
                    <input id={option.value} name="currency-display" type="radio" className="peer hidden" value={option.key} checked={currencyType === option.key} onChange={handleChange} />
                    <div className="relative peer-checked:[&>div]:opacity-100 w-4 h-4 border-2 border-grey60 peer-checked:border-orange rounded-full flex items-center justify-center">
                      <div className="absolute inset-0 opacity-0 top-0.5 left-0.5 w-2 h-2 rounded-full bg-orange" />
                    </div>
                    <div className="text-white text-sm">{option.textContent}</div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

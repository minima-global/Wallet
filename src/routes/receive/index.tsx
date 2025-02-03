import { createFileRoute } from '@tanstack/react-router'
import Header from '../../components/Header'
import Tabs from '../../components/Tabs'
import Navigation from '../../components/Navigation'

export const Route = createFileRoute('/receive/')({
  component: Index,
})

function Index() {
  const TABS = [
    {
      title: 'Your address',
      href: '/receive',
    },
    {
      title: 'Vallidate',
      href: '/receive/validate',
    },
  ]

  return (
    <>
      <Header />
      <div className="mt-10 container mx-auto flex">
        <div className="flex w-full gap-10">
          <div className="flex flex-col gap-5">
            <Navigation />
          </div>
          <div className="grow flex flex-col">
            <h1 className="text-white text-2xl mb-6">Recieve</h1>
            <Tabs tabs={TABS} />
            <div className="mt-2 mb-6 flex flex-col gap-4">
              <div className="bg-contrast1 p-10 rounded-lg">
                <div className="block bg-red-500 w-[240px] h-[240px] mx-auto mb-4"></div>
                <label className="text-white text-sm">Address name</label>
                <div className="mt-2 text-grey20 bg-grey20 dark:bg-mediumDarkContrast py-3 px-4 rounded text-sm break-all">
                  MxG0856M98N76614NNUKK1MC117BZKMC982PNZVYZQM50NJ4PUD2KCDEKCJ3P9W
                </div>
                <button className="mt-4 w-full bg-orange text-black py-3 px-4 rounded text-sm">
                  Validate this address
                </button>
              </div>
              <div className="bg-contrast1 py-8 px-10 rounded-lg">
                <div className="text-grey20">Your alternative addresses</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

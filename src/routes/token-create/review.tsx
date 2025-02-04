import { createFileRoute } from '@tanstack/react-router'
import Header from '../../components/Header'
import Navigation from '../../components/Navigation'
import Send from '../../components/Button'

export const Route = createFileRoute('/token-create/review')({
  component: Index,
})

const PAGE_TITLE = "Review"

function Index() {

  const FIELDS = [
    {
      label: 'Name',
      value: 'Atomlyze',
    },
    {
      label: "Total Minted",
      value: 1250,
    },
    {
      label: "Description",
      value: "Atomlyze is a token that allows you to create and manage your own tokens on the Atomlyze blockchain.",
    },
    {
      label: "Ticker",
      value: "ATOM",
    },
    {
      label: "Web validation URL",
      value: "www.atomlyze.com",
    },
    {
      label: "Burn",
      value: 10,
    },
    {
      label: "Colour",
      value: "Brown",
    },
    {
      label: "Dog breed",
      value: "Golden Retriever",
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
            <h1 className="text-white text-2xl mb-6">{PAGE_TITLE}</h1>
            <div className="mt-2 mb-6 flex flex-col gap-4">
              <div className="bg-contrast1 p-10 rounded-lg">
                <div className="block bg-red-500 w-[240px] h-[240px] mx-auto mb-4"></div>
                <label className="text-white">Details</label>
                <div className="my-4 text-grey20 bg-black p-5 rounded text-sm break-all flex flex-col gap-4">
                  {FIELDS.map((field, index) => (
                    <div key={index}>
                      <label className="text-grey60">{field.label}</label>
                      <div>{field.value}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-4 -mb-4">
                  <button className="mt-4 w-full bg-orange text-black py-3 px-4 rounded text-sm">
                    Create
                  </button>
                  <Send secondary>
                    Cancel
                  </Send>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

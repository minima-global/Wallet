import {
    createFileRoute,
    Link,
} from '@tanstack/react-router'
import Header from '../../components/Header'
import Navigation from '../../components/Navigation'
import Tabs from '../../components/Tabs'

export const Route = createFileRoute('/receive/validate')({
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
                                <label className="block text-white text-sm mb-4">Validate an address</label>
                                <div className="bg-contrast2 w-full h-[48px] p-3 rounded">
                                    <input type="text" className="bg-transparent text-white w-full h-full outline-none placeholder:text-grey" placeholder="Enter an 0x or Mx address" />
                                </div>
                                <button className="mt-4 w-full bg-orange text-black py-3 px-4 rounded text-sm">
                                    Validate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

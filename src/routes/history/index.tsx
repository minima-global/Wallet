import { createFileRoute } from '@tanstack/react-router'
import Header from '../../components/Header'
import Navigation from '../../components/Navigation'
import SearchBar from '../../components/SearchBar'
import RefreshButton from '../../components/RefreshButton'
import SortButton from '../../components/SortButton'

export const Route = createFileRoute('/history/')({
  component: Index,
})

function Index() {
  return (
    <>
      <Header />
      <div className="mt-10 container mx-auto flex">
        <div className="flex w-full gap-10">
          <div className="flex flex-col gap-5">
            <Navigation />
          </div>
          <div className="grow flex flex-col">
            <div>
              <div className="grid grid-cols-2">
                <div className="col-span-1">
                  <h1 className="text-white text-2xl mb-6">
                    History
                  </h1>
                </div>
                <div className="col-span-1">
                  <div className="flex items-end justify-end flex-col gap-3">
                    <div className="flex flex-col gap-0.5">
                      <div className="w-[4px] h-[4px] bg-grey60 rounded-full" />
                      <div className="w-[4px] h-[4px] bg-grey60 rounded-full" />
                      <div className="w-[4px] h-[4px] bg-grey60 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6 flex gap-2.5">
                <SearchBar />
                <SortButton />
                <RefreshButton />
              </div>

              <div className="mt-8 flex flex-col gap-1">
                <div className="bg-contrast2 w-full rounded px-5 py-3 text-white">
                  <h5>May 28th 2024</h5>
                </div>
                <div className="bg-contrast1 w-full rounded px-4 py-3 text-white flex gap-4">
                  <div data-testid="token-icon">
                    <div className="w-[48px] h-[48px] border border-darkConstrast dark:border-grey80 rounded overflow-hidden"><svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" fill="white"></rect><path d="M32.4428 16.759L31.2053 22.2329L29.6226 15.6286L24.0773 13.3795L22.578 19.9957L21.2571 12.2371L15.7119 10L10 35.2512H16.0569L17.8062 27.4926L19.1271 35.2512H25.1959L26.6834 28.6349L28.266 35.2512H34.323L38 18.9962L32.4428 16.759Z" fill="black"></path></svg></div>
                  </div>
                  <div data-testid="token-name" className="grow w-full">
                    <div className="flex grow">
                      <h6 className="font-bold truncate text-black dark:text-neutral-400">Minima</h6>
                      <div className="!text-blue-500 my-auto ml-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-white" width="16" height="16" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                          <path d="M5 7.2a2.2 2.2 0 0 1 2.2 -2.2h1a2.2 2.2 0 0 0 1.55 -.64l.7 -.7a2.2 2.2 0 0 1 3.12 0l.7 .7c.412 .41 .97 .64 1.55 .64h1a2.2 2.2 0 0 1 2.2 2.2v1c0 .58 .23 1.138 .64 1.55l.7 .7a2.2 2.2 0 0 1 0 3.12l-.7 .7a2.2 2.2 0 0 0 -.64 1.55v1a2.2 2.2 0 0 1 -2.2 2.2h-1a2.2 2.2 0 0 0 -1.55 .64l-.7 .7a2.2 2.2 0 0 1 -3.12 0l-.7 -.7a2.2 2.2 0 0 0 -1.55 -.64h-1a2.2 2.2 0 0 1 -2.2 -2.2v-1a2.2 2.2 0 0 0 -.64 -1.55l-.7 -.7a2.2 2.2 0 0 1 0 -3.12l.7 -.7a2.2 2.2 0 0 0 .64 -1.55v-1"></path>
                          <path d="M9 12l2 2l4 -4"></path>
                        </svg>
                      </div>
                    </div>
                    <p className="font-bold truncate text-grey dark:text-neutral-300">Received - 10:28</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green">+100</p>
                    <p className="font-bold text-grey60">10,985</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

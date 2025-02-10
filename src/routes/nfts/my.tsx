import { createFileRoute } from '@tanstack/react-router'
import Header from '../../components/Header'
import Navigation from '../../components/Navigation'
import HeartButton from '../../components/HeartButton'

export const Route = createFileRoute('/nfts/my')({
  component: Index,
})

const Title = 'NFTs';

const NFTCard = ({ favourted }: { favourted: boolean }) => {
  return (
    <div className="col-span-3">
      <div className="bg-contrast1">
        <img className="w-full h-full" src="https://placehold.co/300x300" alt="NFT" />
      </div>
      <div className="bg-contrast1 py-3 px-4 rounded-b">
        <div className="grid grid-cols-2">
          <div className="col-span-1">
            <h5 className="text-white">NFT name</h5>
            <p className="text-grey60 text-sm">100</p>
          </div>
          <div className="col-span-1 flex items-center justify-end pr-2">
            {favourted ? <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 15L6.95833 14.0625C5.56944 12.8264 4.42361 11.7674 3.52083 10.8854C2.61806 10.0035 1.90625 9.21875 1.38542 8.53125C0.864583 7.84375 0.503472 7.21528 0.302083 6.64583C0.100694 6.07639 0 5.49306 0 4.89583C0 3.65972 0.423611 2.61806 1.27083 1.77083C2.11806 0.923611 3.15972 0.5 4.39583 0.5C5.07639 0.5 5.73611 0.645833 6.375 0.9375C7.01389 1.22917 7.55556 1.63889 8 2.16667C8.44444 1.63889 8.98611 1.22917 9.625 0.9375C10.2639 0.645833 10.9236 0.5 11.6042 0.5C12.8403 0.5 13.8819 0.923611 14.7292 1.77083C15.5764 2.61806 16 3.65972 16 4.89583C16 5.49306 15.9028 6.06944 15.7083 6.625C15.5139 7.18056 15.1562 7.79861 14.6354 8.47917C14.1146 9.15972 13.3993 9.94792 12.4896 10.8438C11.5799 11.7396 10.4167 12.8264 9 14.1042L8 15Z" fill="#FF8630" />
            </svg>
              : <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 15L6.95833 14.0625C5.56944 12.8264 4.42361 11.7674 3.52083 10.8854C2.61806 10.0035 1.90625 9.21875 1.38542 8.53125C0.864583 7.84375 0.503472 7.21528 0.302083 6.64583C0.100694 6.07639 0 5.49306 0 4.89583C0 3.65972 0.423611 2.61806 1.27083 1.77083C2.11806 0.923611 3.15972 0.5 4.39583 0.5C5.07639 0.5 5.73611 0.645833 6.375 0.9375C7.01389 1.22917 7.55556 1.63889 8 2.16667C8.44444 1.63889 8.98611 1.22917 9.625 0.9375C10.2639 0.645833 10.9236 0.5 11.6042 0.5C12.8403 0.5 13.8819 0.923611 14.7292 1.77083C15.5764 2.61806 16 3.65972 16 4.89583C16 5.49306 15.9028 6.06944 15.7083 6.625C15.5139 7.18056 15.1562 7.79861 14.6354 8.47917C14.1146 9.15972 13.3993 9.94792 12.4896 10.8438C11.5799 11.7396 10.4167 12.8264 9 14.1042L8 15ZM8 12.9792C9.29167 11.8264 10.3542 10.8438 11.1875 10.0312C12.0208 9.21875 12.684 8.51042 13.1771 7.90625C13.6701 7.30208 14.0139 6.76389 14.2083 6.29167C14.4028 5.81944 14.5 5.35417 14.5 4.89583C14.5 4.07639 14.2222 3.38889 13.6667 2.83333C13.1111 2.27778 12.4236 2 11.6042 2C11.1181 2 10.6632 2.10069 10.2396 2.30208C9.81597 2.50347 9.45139 2.78472 9.14583 3.14583L8.41667 4H7.58333L6.85417 3.14583C6.54861 2.78472 6.17708 2.50347 5.73958 2.30208C5.30208 2.10069 4.85417 2 4.39583 2C3.57639 2 2.88889 2.27778 2.33333 2.83333C1.77778 3.38889 1.5 4.07639 1.5 4.89583C1.5 5.35417 1.59028 5.80903 1.77083 6.26042C1.95139 6.71181 2.28125 7.23611 2.76042 7.83333C3.23958 8.43056 3.89931 9.13889 4.73958 9.95833C5.57986 10.7778 6.66667 11.7847 8 12.9792Z" fill="#E9E9EB" />
              </svg>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

function Index() {
  return (
    <div className="grow flex flex-col mb-20">
      <div>
        <div className="grid grid-cols-2">
          <div className="col-span-1">
            <h1 className="text-white text-2xl mb-6">{Title}</h1>
          </div>
          <div className="col-span-1" />
        </div>

        <div className="mb-6 flex gap-2.5">
          <HeartButton />
        </div>

        <div className="my-8 grid grid-cols-12 gap-6">
          {new Array(10).fill(0).map((_, index) => <NFTCard favourted={index % 2 === 0} />)}
        </div>

      </div>
    </div>
  )
}

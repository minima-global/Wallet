import { useContext, useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import HamburgerButton from './HamburgerButton.tsx'
import { appContext } from '../../AppContext.tsx'
import useAndroidShowTitleBar from './useAndroidShowTitlebar';

const HEADER_NAV = [
  {
    title: 'Dashboard',
    href: '/',
  },
  {
    title: 'Transactions',
    href: '/transactions',
  },
  {
    title: 'Blocks',
    href: '/blocks',
  },
]

const Header = () => {
  const pathName = '___'
  const { block, hamburgerOpen, setHamburgerOpen } = useContext(appContext)
  const [isAtTop, setIsAtTop] = useState(true)
  const openTitleBar = useAndroidShowTitleBar();

  useEffect(() => {
    const onScroll = () => {
      setIsAtTop(window.scrollY <= 30)
    }

    window.addEventListener('scroll', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    if (hamburgerOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  }, [hamburgerOpen])

  const toggle = () => {
    setHamburgerOpen((prevState) => !prevState);
  }

  const toggleDarkMode = (evt: React.MouseEvent<HTMLLIElement>) => {
    evt.stopPropagation();

    document.body.classList.remove('bg-background')

    if (document.body.classList.contains('dark')) {
      document.body.classList.remove('dark')
      document.body.classList.add('bg-white')
    } else {
      document.body.classList.add('dark')
      document.body.classList.add('dark:bg-background')
    }

    localStorage.setItem(
      'darkMode',
      (!!document.body.classList.contains('dark')).toString()
    )
  }

  return (
    <>
      <header className="sticky top-0 z-50 h-[64px]" onClick={openTitleBar}>
        <div
          className={`${isAtTop ? 'h-[84px]' : 'h-[40px]'} relative border-b-gradient border-[hsla(0, 0%, 100%, 1)] flex h-[64px] items-center border-b bg-white px-5 transition-all dark:border-lightDarkContrast dark:bg-black`}
        >
          <div className="container relative z-50 mx-auto">
            <div className="grid w-full grid-cols-12">
              <div className="col-span-6 flex items-center">
                <Link to="/" className="flex items-center gap-5 text-xs">
                  <svg width="42" height="40" viewBox="0 0 42 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.1247 13.0477L24.6192 17.6251L31.658 14.8219L34.1184 4.09599L24.6192 7.87852L6.56361 0.688477L0 29.2966L10.342 25.1777L13.1247 13.0477Z" fill="white" />
                    <path d="M31.6591 14.822L28.8765 26.952L17.382 22.3746L10.3432 25.1779L7.88281 35.9038L17.382 32.1212L35.4376 39.3113L42.0012 10.7031L31.6591 14.822Z" fill="white" />
                  </svg>
                  <div className="mt-1">
                    <div className="text-white text-sm">Wallet</div>
                  </div>
                </Link>
              </div>
              <div className="col-span-6 flex items-center justify-end">
                <div className="flex lg:hidden">
                  <HamburgerButton isOpen={hamburgerOpen} toggle={toggle} />
                </div>
                <nav className="hidden cursor-pointer lg:block">
                  <ul
                    className={`${isAtTop ? 'gap-6' : 'gap-2.5'} flex items-center text-sm transition-all`}
                  >

                    <li className="text-white flex items-center gap-2">
                      Block: <span className="text-orange font-bold">1,035,000</span>
                      <span className="inline-block ml-2 w-2 h-2 bg-green rounded-full"></span>
                    </li>

                    <li onClick={toggleDarkMode}>
                      <div
                        className={`${!isAtTop ? 'scale-[0.8]' : ''} relative flex h-[44px] w-[44px] scale-100 items-center justify-center rounded-full border border-grey80 bg-white from-[#17191C] to-[#37393F] transition-all duration-75 hover:bg-grey10 active:scale-90 dark:border-mediumDarkContrast dark:bg-darkContrast dark:hover:bg-transparent dark:hover:bg-gradient-to-t`}
                      >
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="invisible absolute scale-0 transition-all delay-150 duration-150 dark:visible dark:scale-100"
                        >
                          <path
                            d="M11 14C11.8333 14 12.5417 13.7083 13.125 13.125C13.7083 12.5417 14 11.8333 14 11C14 10.1667 13.7083 9.45833 13.125 8.875C12.5417 8.29167 11.8333 8 11 8C10.1667 8 9.45833 8.29167 8.875 8.875C8.29167 9.45833 8 10.1667 8 11C8 11.8333 8.29167 12.5417 8.875 13.125C9.45833 13.7083 10.1667 14 11 14ZM11 15.5C9.75133 15.5 8.68917 15.0622 7.8135 14.1865C6.93783 13.3108 6.5 12.2487 6.5 11C6.5 9.75133 6.93783 8.68917 7.8135 7.8135C8.68917 6.93783 9.75133 6.5 11 6.5C12.2487 6.5 13.3108 6.93783 14.1865 7.8135C15.0622 8.68917 15.5 9.75133 15.5 11C15.5 12.2487 15.0622 13.3108 14.1865 14.1865C13.3108 15.0622 12.2487 15.5 11 15.5ZM4 11.75H0.25V10.25H4V11.75ZM21.75 11.75H18V10.25H21.75V11.75ZM10.25 4V0.25H11.75V4H10.25ZM10.25 21.75V18H11.75V21.75H10.25ZM5.573 6.577L3.23075 4.3155L4.2905 3.20575L6.54625 5.523L5.573 6.577ZM17.7095 18.7943L15.4385 16.4615L16.427 15.423L18.7693 17.6845L17.7095 18.7943ZM15.423 5.573L17.6845 3.23075L18.7943 4.2905L16.477 6.54625L15.423 5.573ZM3.20575 17.7095L5.5385 15.4385L6.55775 16.427L4.30575 18.7788L3.20575 17.7095Z"
                            fill="#E9E9EB"
                          />
                        </svg>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="visible absolute scale-100 transition-all delay-150 duration-150 dark:invisible dark:scale-0"
                        >
                          <path
                            d="M9.02905 17.5C6.66805 17.5 4.66113 16.6736 3.0083 15.0207C1.35563 13.3681 0.529297 11.3611 0.529297 8.99998C0.529297 6.73714 1.29688 4.79647 2.83205 3.17797C4.36721 1.55931 6.24696 0.68264 8.4713 0.547974C8.61496 0.547974 8.75605 0.55314 8.89455 0.563474C9.03288 0.573807 9.16871 0.589224 9.30205 0.609724C8.79188 1.08656 8.38555 1.66281 8.08305 2.33847C7.78038 3.01414 7.62905 3.73464 7.62905 4.49997C7.62905 6.13881 8.20271 7.53189 9.35005 8.67922C10.4972 9.82639 11.8902 10.4 13.529 10.4C14.3047 10.4 15.0278 10.2487 15.6983 9.94623C16.3688 9.64356 16.9393 9.23714 17.4098 8.72697C17.4303 8.86031 17.4457 8.99623 17.456 9.13473C17.4662 9.27306 17.4713 9.41406 17.4713 9.55772C17.3431 11.7821 16.4698 13.6618 14.8513 15.197C13.2326 16.7323 11.2919 17.5 9.02905 17.5ZM9.02905 16C10.4957 16 11.8124 15.5958 12.979 14.7875C14.1457 13.9791 14.9957 12.925 15.529 11.625C15.1957 11.7083 14.8624 11.775 14.529 11.825C14.1957 11.875 13.8624 11.9 13.529 11.9C11.479 11.9 9.73321 11.1791 8.29155 9.73747C6.84988 8.29581 6.12905 6.54997 6.12905 4.49997C6.12905 4.16664 6.15405 3.83331 6.20405 3.49997C6.25405 3.16664 6.32071 2.83331 6.40405 2.49997C5.10405 3.03331 4.04988 3.88331 3.24155 5.04997C2.43321 6.21664 2.02905 7.53331 2.02905 8.99998C2.02905 10.9333 2.71238 12.5833 4.07905 13.95C5.44571 15.3166 7.09571 16 9.02905 16Z"
                            fill="#08090B"
                          />
                        </svg>
                      </div>
                    </li>

                    <li className="text-white border-2 border-contrast2 rounded-full pr-3 transition-all active:scale-[90%]">
                      <div className={`relative z-[1000] hidden cursor-pointer items-center gap-2 rounded-full pl-4 lg:flex text-sm xl:text-base transition-all ${isAtTop ? "h-[40px]" : "text-xs h-[34px] !text-[13px] !gap-2"}`}><div className="">EN</div><svg width="20" height="20" className={`transition-all ${isAtTop ? "" : "scale-[80%]"}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 19.5C8.6975 19.5 7.46833 19.2503 6.3125 18.751C5.15667 18.2517 4.14867 17.5718 3.2885 16.7115C2.42817 15.8513 1.74833 14.8433 1.249 13.6875C0.749667 12.5317 0.5 11.3025 0.5 10C0.5 8.68717 0.749667 7.45542 1.249 6.30475C1.74833 5.15408 2.42817 4.14867 3.2885 3.2885C4.14867 2.42817 5.15667 1.74833 6.3125 1.249C7.46833 0.749667 8.6975 0.5 10 0.5C11.3128 0.5 12.5446 0.749667 13.6953 1.249C14.8459 1.74833 15.8513 2.42817 16.7115 3.2885C17.5718 4.14867 18.2517 5.15408 18.751 6.30475C19.2503 7.45542 19.5 8.68717 19.5 10C19.5 11.3025 19.2503 12.5317 18.751 13.6875C18.2517 14.8433 17.5718 15.8513 16.7115 16.7115C15.8513 17.5718 14.8459 18.2517 13.6953 18.751C12.5446 19.2503 11.3128 19.5 10 19.5ZM10 17.9788C10.5103 17.3019 10.9398 16.6192 11.2885 15.9307C11.6372 15.2422 11.9212 14.4897 12.1405 13.673H7.8595C8.09167 14.5153 8.37892 15.2808 8.72125 15.9693C9.06342 16.6578 9.48967 17.3276 10 17.9788ZM8.0635 17.7038C7.68017 17.1538 7.33592 16.5285 7.03075 15.828C6.72558 15.1273 6.48842 14.409 6.31925 13.673H2.927C3.45517 14.7115 4.1635 15.584 5.052 16.2905C5.9405 16.9968 6.94433 17.4679 8.0635 17.7038ZM11.9365 17.7038C13.0557 17.4679 14.0595 16.9968 14.948 16.2905C15.8365 15.584 16.5448 14.7115 17.073 13.673H13.6807C13.4794 14.4153 13.2262 15.1368 12.921 15.8375C12.616 16.5382 12.2878 17.1602 11.9365 17.7038ZM2.298 12.173H6.0155C5.95267 11.8013 5.90708 11.4369 5.87875 11.0798C5.85058 10.7227 5.8365 10.3628 5.8365 10C5.8365 9.63717 5.85058 9.27725 5.87875 8.92025C5.90708 8.56308 5.95267 8.19867 6.0155 7.827H2.298C2.20183 8.16667 2.12817 8.51983 2.077 8.8865C2.02567 9.25317 2 9.62433 2 10C2 10.3757 2.02567 10.7468 2.077 11.1135C2.12817 11.4802 2.20183 11.8333 2.298 12.173ZM7.51525 12.173H12.4848C12.5474 11.8013 12.5929 11.4402 12.6212 11.0895C12.6494 10.7388 12.6635 10.3757 12.6635 10C12.6635 9.62433 12.6494 9.26117 12.6212 8.9105C12.5929 8.55983 12.5474 8.19867 12.4848 7.827H7.51525C7.45258 8.19867 7.40708 8.55983 7.37875 8.9105C7.35058 9.26117 7.3365 9.62433 7.3365 10C7.3365 10.3757 7.35058 10.7388 7.37875 11.0895C7.40708 11.4402 7.45258 11.8013 7.51525 12.173ZM13.9845 12.173H17.702C17.7982 11.8333 17.8718 11.4802 17.923 11.1135C17.9743 10.7468 18 10.3757 18 10C18 9.62433 17.9743 9.25317 17.923 8.8865C17.8718 8.51983 17.7982 8.16667 17.702 7.827H13.9845C14.0473 8.19867 14.0929 8.56308 14.1212 8.92025C14.1494 9.27725 14.1635 9.63717 14.1635 10C14.1635 10.3628 14.1494 10.7227 14.1212 11.0798C14.0929 11.4369 14.0473 11.8013 13.9845 12.173ZM13.6807 6.327H17.073C16.5385 5.27567 15.835 4.40317 14.9625 3.7095C14.09 3.016 13.0813 2.54167 11.9365 2.2865C12.3198 2.8685 12.6608 3.50508 12.9595 4.19625C13.2583 4.88725 13.4987 5.5975 13.6807 6.327ZM7.8595 6.327H12.1405C11.9083 5.491 11.6163 4.72075 11.2645 4.01625C10.9125 3.31175 10.491 2.64675 10 2.02125C9.509 2.64675 9.0875 3.31175 8.7355 4.01625C8.38367 4.72075 8.09167 5.491 7.8595 6.327ZM2.927 6.327H6.31925C6.50125 5.5975 6.74167 4.88725 7.0405 4.19625C7.33917 3.50508 7.68017 2.8685 8.0635 2.2865C6.91217 2.54167 5.90192 3.01767 5.03275 3.7145C4.16342 4.41117 3.4615 5.282 2.927 6.327Z" fill="currentColor"></path></svg><div className="absolute right-0 top-[100%] z-[1000] flex h-fit min-w-[123px] flex-col transition-all duration-150 pointer-events-none translate-y-2 opacity-0"><div className="mt-4 flex flex-col gap-[2px] bg-contrast1"><button className="bg-contrast2 px-4 py-2 text-white hover:bg-white hover:text-black">English</button><button className="bg-contrast2 px-4 py-2 text-white hover:bg-white hover:text-black">汉语</button><button className="bg-contrast2 px-4 py-2 text-white hover:bg-white hover:text-black">Pусский</button><button className="bg-contrast2 px-4 py-2 text-white hover:bg-white hover:text-black">Українська</button><button className="bg-contrast2 px-4 py-2 text-white hover:bg-white hover:text-black">Français</button><button className="bg-contrast2 px-4 py-2 text-white hover:bg-white hover:text-black">Español</button></div></div></div>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="flex lg:hidden">
        {hamburgerOpen && (
          <nav className="fixed left-0 top-0 z-10 h-screen w-screen bg-black pt-20 text-white">
            <div className="p-8">
              <ul className="flex flex-col text-2xl">
                {HEADER_NAV.map(({ title, href }) => {
                  const isOnPage =
                    pathName === href ||
                    (pathName && pathName.includes(href) && href !== '/')

                  return (
                    <li
                      key={title}
                      className={`w-full ${isOnPage ? 'text-orange dark:text-lightOrange' : ''}`}
                    >
                      <Link
                        to={href}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggle();
                        }}
                        className="block w-full px-5 py-4"
                      >
                        {title}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </nav>
        )}
      </div>
      <div className="h-[20px]" />
    </>
  )
}

export default Header

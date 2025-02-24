import { useContext, useEffect } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import HamburgerButton from './HamburgerButton.tsx'
import { appContext } from '../../AppContext.tsx'
import useAndroidShowTitleBar from './useAndroidShowTitlebar';
import NodeStatus from '../NodeStatus/index.tsx';
import LanguageSelector from '../LanguageSelector/index.tsx';
import useTranslation from '../../hooks/useTranslation.ts';
import Logo from './Logo.tsx';

const Header = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { block, hamburgerOpen, setHamburgerOpen } = useContext(appContext)
  const openTitleBar = useAndroidShowTitleBar();

  useEffect(() => {
    if (hamburgerOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  }, [hamburgerOpen]);

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

  const dismissHamburger = () => {
    setHamburgerOpen(false)
  }

  const NAV_ITEMS = [
    {
      title: t("balance"),
      icon: (
        <svg
          width="20"
          height="16"
          viewBox="0 0 20 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 15.5C3.03467 15.5 2.21 15.158 1.526 14.474C0.842 13.79 0.5 12.9653 0.5 12V4C0.5 3.03467 0.842 2.21 1.526 1.526C2.21 0.841999 3.03467 0.5 4 0.5H16C16.9653 0.5 17.79 0.841999 18.474 1.526C19.158 2.21 19.5 3.03467 19.5 4V12C19.5 12.9653 19.158 13.79 18.474 14.474C17.79 15.158 16.9653 15.5 16 15.5H4ZM4 4.25H16C16.3795 4.25 16.7375 4.3045 17.074 4.4135C17.4105 4.5225 17.7192 4.68792 18 4.90975V4C18 3.45 17.8042 2.97917 17.4125 2.5875C17.0208 2.19583 16.55 2 16 2H4C3.45 2 2.97917 2.19583 2.5875 2.5875C2.19583 2.97917 2 3.45 2 4V4.90975C2.28083 4.68792 2.5895 4.5225 2.926 4.4135C3.2625 4.3045 3.6205 4.25 4 4.25ZM2.09225 7.2405L13.323 9.96925C13.4602 10.0026 13.599 10.0042 13.7395 9.974C13.8798 9.94383 14.0071 9.882 14.1212 9.7885L17.7213 6.7635C17.5571 6.46217 17.3221 6.21792 17.0163 6.03075C16.7106 5.84358 16.3718 5.75 16 5.75H4C3.52817 5.75 3.11858 5.88817 2.77125 6.1645C2.42375 6.44067 2.19742 6.79933 2.09225 7.2405Z"
            fill="currentColor"
          />
        </svg>
      ),
      href: '/',
    },
    {
      icon: (
        <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.01953 15.2308C4.29253 14.7423 2.94411 13.8153 1.97428 12.45C1.00445 11.0847 0.519531 9.60133 0.519531 8C0.519531 6.39867 1.00445 4.91533 1.97428 3.55C2.94411 2.18467 4.29253 1.25775 6.01953 0.76925V2.35C4.8362 2.75 3.8737 3.46667 3.13203 4.5C2.39036 5.53333 2.01953 6.7 2.01953 8C2.01953 9.3 2.39036 10.4667 3.13203 11.5C3.8737 12.5333 4.8362 13.25 6.01953 13.65V15.2308ZM14.0195 15.5C11.9375 15.5 10.167 14.7705 8.70803 13.3115C7.24903 11.8525 6.51953 10.082 6.51953 8C6.51953 5.918 7.24903 4.1475 8.70803 2.6885C10.167 1.2295 11.9375 0.5 14.0195 0.5C15.0234 0.5 15.9718 0.685917 16.8648 1.05775C17.7576 1.42958 18.5483 1.94692 19.2368 2.60975L18.183 3.6635C17.6394 3.13917 17.0147 2.73083 16.309 2.4385C15.6032 2.14617 14.84 2 14.0195 2C12.3529 2 10.9362 2.58333 9.76953 3.75C8.60286 4.91667 8.01953 6.33333 8.01953 8C8.01953 9.66667 8.60286 11.0833 9.76953 12.25C10.9362 13.4167 12.3529 14 14.0195 14C14.84 14 15.6032 13.8538 16.309 13.5615C17.0147 13.2692 17.6394 12.8608 18.183 12.3365L19.2368 13.3903C18.5483 14.0531 17.7576 14.5704 16.8648 14.9423C15.9718 15.3141 15.0234 15.5 14.0195 15.5ZM19.8273 11.6538L18.7733 10.6L20.6233 8.75H13.0773V7.25H20.6233L18.7733 5.4L19.8273 4.34625L23.481 8L19.8273 11.6538Z" fill="currentColor" />
        </svg>
      ),
      title: t("send"),
      href: '/send',
    },
    {
      icon: (
        <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.9805 0.769249C19.7075 1.25775 21.0559 2.18467 22.0257 3.55C22.9956 4.91533 23.4805 6.39867 23.4805 8C23.4805 9.60133 22.9956 11.0847 22.0257 12.45C21.0559 13.8153 19.7075 14.7422 17.9805 15.2307L17.9805 13.65C19.1638 13.25 20.1263 12.5333 20.868 11.5C21.6096 10.4667 21.9805 9.3 21.9805 8C21.9805 6.7 21.6096 5.53333 20.868 4.5C20.1263 3.46667 19.1638 2.75 17.9805 2.35L17.9805 0.769249ZM9.98047 0.499999C12.0625 0.499999 13.833 1.2295 15.292 2.6885C16.751 4.1475 17.4805 5.918 17.4805 8C17.4805 10.082 16.751 11.8525 15.292 13.3115C13.833 14.7705 12.0625 15.5 9.98047 15.5C8.97663 15.5 8.02822 15.3141 7.13522 14.9422C6.24238 14.5704 5.45172 14.0531 4.76322 13.3902L5.81697 12.3365C6.36064 12.8608 6.9853 13.2692 7.69097 13.5615C8.3968 13.8538 9.15997 14 9.98047 14C11.6471 14 13.0638 13.4167 14.2305 12.25C15.3971 11.0833 15.9805 9.66667 15.9805 8C15.9805 6.33333 15.3971 4.91667 14.2305 3.75C13.0638 2.58333 11.6471 2 9.98047 2C9.15997 2 8.3968 2.14617 7.69097 2.4385C6.9853 2.73083 6.36064 3.13917 5.81697 3.6635L4.76322 2.60975C5.45172 1.94692 6.24239 1.42958 7.13522 1.05775C8.02822 0.685916 8.97664 0.499999 9.98047 0.499999ZM4.17272 4.34625L5.22672 5.4L3.37672 7.25L10.9227 7.25L10.9227 8.75L3.37672 8.75L5.22672 10.6L4.17272 11.6537L0.518969 8L4.17272 4.34625Z" fill="currentColor" />
        </svg>
      ),
      title: t("receive"),
      href: '/receive',
    },
    {
      icon: (
        <svg
          width="22"
          height="15"
          viewBox="0 0 22 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.1857 11.9212L19.4934 3.61342C19.5382 3.56858 19.5607 3.51408 19.5607 3.44992C19.5607 3.38575 19.5382 3.33125 19.4934 3.28642L18.5204 2.31342C18.4754 2.26858 18.4209 2.24617 18.3569 2.24617C18.2927 2.24617 18.2382 2.26858 18.1934 2.31342L9.88566 10.6212L11.1857 11.9212ZM4.91066 13.7307C3.42349 13.6473 2.30682 13.3166 1.56066 12.7384C0.81449 12.1603 0.441406 11.3423 0.441406 10.2844C0.441406 9.27175 0.866406 8.45033 1.71641 7.82017C2.56641 7.19 3.74782 6.80825 5.26066 6.67492C5.98766 6.61208 6.53291 6.48067 6.89641 6.28067C7.25974 6.08067 7.44141 5.80375 7.44141 5.44992C7.44141 4.95892 7.19557 4.58425 6.70391 4.32592C6.21224 4.06758 5.40616 3.882 4.28566 3.76917L4.42216 2.27867C5.95932 2.42484 7.09682 2.75625 7.83466 3.27292C8.57249 3.78958 8.94141 4.51525 8.94141 5.44992C8.94141 6.24342 8.63666 6.87258 8.02716 7.33742C7.41749 7.80208 6.53249 8.08125 5.37216 8.17492C4.22866 8.27108 3.37099 8.49417 2.79916 8.84417C2.22732 9.19417 1.94141 9.67425 1.94141 10.2844C1.94141 10.9063 2.17957 11.3688 2.65591 11.6722C3.13224 11.9753 3.90432 12.1615 4.97216 12.2307L4.91066 13.7307ZM11.4202 13.8094L7.99716 10.3864L17.3357 1.05767C17.6305 0.762834 17.9751 0.617001 18.3694 0.620168C18.7636 0.623334 19.1081 0.769168 19.4029 1.05767L20.7492 2.40367C21.044 2.69867 21.1914 3.04483 21.1914 3.44217C21.1914 3.83967 21.044 4.18583 20.7492 4.48067L11.4202 13.8094ZM8.07991 14.4999C7.85424 14.5538 7.65557 14.4948 7.48391 14.3229C7.31207 14.1511 7.25307 13.9524 7.30691 13.7269L7.99716 10.3864L11.4202 13.8094L8.07991 14.4999Z"
            fill="currentColor"
          />
        </svg>
      ),
      title: t("token_create"),
      href: '/token-create',
    },
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.30775 19.5C1.80258 19.5 1.375 19.325 1.025 18.975C0.675 18.625 0.5 18.1974 0.5 17.6923V4.30777C0.5 3.80261 0.675 3.37502 1.025 3.02502C1.375 2.67502 1.80258 2.50002 2.30775 2.50002H10.9635L9.4635 4.00002H2.30775C2.23075 4.00002 2.16025 4.03211 2.09625 4.09627C2.03208 4.16027 2 4.23077 2 4.30777V17.6923C2 17.7693 2.03208 17.8398 2.09625 17.9038C2.16025 17.9679 2.23075 18 2.30775 18H15.6923C15.7692 18 15.8398 17.9679 15.9038 17.9038C15.9679 17.8398 16 17.7693 16 17.6923V10.473L17.5 8.97302V17.6923C17.5 18.1974 17.325 18.625 16.975 18.975C16.625 19.325 16.1974 19.5 15.6923 19.5H2.30775ZM6.5 13.5V10.0673L15.5598 1.00777C15.7148 0.852606 15.8853 0.739439 16.0712 0.668272C16.2571 0.597106 16.4462 0.561523 16.6385 0.561523C16.8347 0.561523 17.0231 0.597106 17.2038 0.668272C17.3846 0.739439 17.5493 0.849356 17.698 0.998022L18.9538 2.25002C19.0986 2.40519 19.2098 2.57636 19.2875 2.76352C19.365 2.95069 19.4038 3.14044 19.4038 3.33277C19.4038 3.52511 19.3708 3.71161 19.3048 3.89227C19.2388 4.07311 19.1282 4.24102 18.973 4.39602L9.8845 13.5H6.5ZM8 12H9.24625L15.4788 5.76727L14.8558 5.14427L14.1885 4.50202L8 10.6905V12Z"
            fill="currentColor"
          />
        </svg>
      ),
      title: t("NFTs"),
      href: '/nfts/create',
    },
    {
      icon: (
        <svg
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 19.5C2.30133 19.5 1.71 19.258 1.226 18.774C0.742 18.29 0.5 17.6987 0.5 17V14.1155H3.5V0.5H17.5V17C17.5 17.6987 17.258 18.29 16.774 18.774C16.29 19.258 15.6987 19.5 15 19.5H3ZM15 18C15.2833 18 15.5208 17.9042 15.7125 17.7125C15.9042 17.5208 16 17.2833 16 17V2H5V14.1155H14V17C14 17.2833 14.0958 17.5208 14.2875 17.7125C14.4792 17.9042 14.7167 18 15 18ZM6.19225 6.69225V5.19225H14.8077V6.69225H6.19225ZM6.19225 9.577V8.077H14.8077V9.577H6.19225ZM3 18H12.5V15.6152H2V17C2 17.2833 2.09583 17.5208 2.2875 17.7125C2.47917 17.9042 2.71667 18 3 18ZM3 18H2H12.5H3Z"
            fill="currentColor"
          />
        </svg>
      ),
      title: t("history"),
      href: '/history',
    },
    {
      icon: (
        <svg
          width="14"
          height="10"
          viewBox="0 0 14 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.36719 9.75V1.75H0.367188V0.25H3.86694V9.75H2.36719ZM5.25169 9.75V8.25H6.75169V9.75H5.25169ZM8.13644 9.75V8.25H11.8287C11.9184 8.25 11.992 8.22117 12.0497 8.1635C12.1075 8.10583 12.1364 8.03208 12.1364 7.94225V6.05775C12.1364 5.96792 12.1075 5.89417 12.0497 5.8365C11.992 5.77883 11.9184 5.75 11.8287 5.75H8.13644V0.25H13.6362V1.75H9.63619V4.25H11.8287C12.3337 4.25 12.7612 4.425 13.1112 4.775C13.4612 5.125 13.6362 5.55258 13.6362 6.05775V7.94225C13.6362 8.44742 13.4612 8.875 13.1112 9.225C12.7612 9.575 12.3326 9.75 11.8254 9.75H8.13644Z"
            fill="currentColor"
          />
        </svg>
      ),
      title: t("currency_display"),
      href: '/currency-display',
    },
  ]

  return (
    <>
      <header onClick={openTitleBar} className="sticky relative top-0 z-[10000] h-[64px] lg:h-[72px] px-4 bg-[#000]">
        <div className="container mx-auto h-full relative">
          <div className="grid grid-cols-12 h-full">
            <div className="col-span-6 flex items-center">
              <Link to="/" className="flex items-center gap-4 text-xs">
                <Logo />
                <div className="mt-0.5 flex items-center gap-2 lg:hidden">
                  <div className="gradient-border text-[11px] flex items-center gap-2">
                    <div className="-ml-0.5"><NodeStatus /></div>
                    <div className="flex items-center gap-1">
                      <span className="text-white font-bold">{block?.block}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-0.5 hidden lg:block">
                  <div className="text-white text-sm font-bold">{t('wallet')}</div>
                </div>
              </Link>
            </div>
            <div className="col-span-6 flex items-center justify-end">
              <div className="flex lg:hidden gap-3">
                <LanguageSelector />
                <HamburgerButton isOpen={hamburgerOpen} toggle={toggle} />
              </div>
              <nav className="hidden lg:block">
                <ul
                  className={`gap-4 flex items-center text-sm transition-all`}
                >

                  <li className="text-white flex items-center gap-6">
                    {block && (
                      <div className="gradient-border flex items-center gap-2">
                        <NodeStatus />
                        <div className="flex items-center text-[13px] gap-2">
                          {t('block')} <span className="text-white font-bold">{block?.block}</span>
                        </div>
                      </div>
                    )}
                  </li>

                  <li onClick={toggleDarkMode} className="hidden">
                    <div
                      className={`relative flex h-[44px] w-[44px] scale-100 items-center justify-center rounded-full border border-grey80 bg-white from-[#17191C] to-[#37393F] transition-all duration-75 hover:bg-grey10 active:scale-90 dark:border-mediumDarkContrast dark:bg-darkContrast dark:hover:bg-transparent dark:hover:bg-gradient-to-t`}
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

                  <li>
                    <LanguageSelector />
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
        <div className="bg-minima-gradient h-[1px] absolute bottom-0 left-0 w-full" />
      </header>
      <div className="flex lg:hidden">
        <nav className={`fixed left-0 top-0 z-[1000] h-screen w-screen bg-black pt-20 pl-1 text-white transition-all duration-200 ${hamburgerOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <div className="py-3 px-5">
            <ul className="flex flex-col gap-6 text-2xl">
              {NAV_ITEMS.map((item) => (
                <Link key={item.href} to={item.href} onClick={dismissHamburger} className="flex items-center gap-5">
                  <div className="w-4 flex items-center">
                    <div className={`group-hover:text-grey60 ${pathname === '/' && item.href === '/' || pathname !== '/' && item.href.includes(pathname) ? '[&>svg>path]:!fill-orange' : ''}`}>{item.icon}</div>
                  </div>
                  <div className={`text-sm ${pathname === '/' && item.href === '/' || pathname !== '/' && item.href.includes(pathname) ? '!text-orange' : 'text-white'}`}>{item.title}</div>
                </Link>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </>
  )
}

export default Header
